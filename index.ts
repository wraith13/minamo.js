export module minamo
{
    export module core
    {
        export const timeout = async (wait : number) : Promise<void> => new Promise<void>(resolve => setTimeout(resolve, wait));
        export const tryOrThrough = function(title : string, f : () => void) : void
        {
            try
            {
                f();
            }
            catch(err)
            {
                console.error(`🚫 ${title}: ${err}`);
            }
        };
        export const tryOrThroughAsync = async function(title : string, f : () => Promise<void>) : Promise<void>
        {
            try
            {
                await f();
            }
            catch(err)
            {
                console.error(`🚫 ${title}: ${err}`);
            }
        };
        export const simpleDeepCopy = (source : object) : object => JSON.parse(JSON.stringify(source));
        export const recursiveAssign = function(target : object, source : object) : void
        {
            Object.keys(source).forEach
            (
                key =>
                {
                    const value = source[key];
                    if ("object" === practicalTypeof(value))
                    {
                        if (undefined === target[key])
                        {
                            target[key] = { };
                        }
                        recursiveAssign(target[key], value);
                    }
                    else
                    {
                        target[key] = value;
                    }
                }
            );
        };
        export const practicalTypeof = function(obj : any) : string
        {
            if (undefined === obj)
            {
                return "undefined";
            }
            if (null === obj)
            {
                return "null";
            }
            if ("[object Array]" === Object.prototype.toString.call(obj))
            {
                return "array";
            }
    
            return typeof obj;
        };
        export const exists = (i : any) : boolean => undefined !== i && null !== i;
        export class Url
        {
            constructor(private url : string)
            {
            }

            rawParams : {[key:string]:string} = null;

            set = (url : string) =>
            {
                this.url = url;
                this.rawParams = null;
                return this;
            }

            getWithoutParams = () : string => separateAndHead(this.url, "?");

            getRawParamsString = () : string => separateAndTail(this.url, "?");
            getRawParams = () : {[key:string]:string} =>
            {
                if (!this.rawParams)
                {
                    this.rawParams = { };
                    this.getRawParamsString().split("&")
                        .forEach
                        (
                            i =>
                            {
                                const { head, tail } = core.separate(i, "=");
                                this.rawParams[head] = tail;
                            }
                        );
                }
                return this.rawParams;
            }
            getParam = (key : string) : string => decodeURIComponent(this.getRawParams()[key]);

            setRawParamsString = (rawParamsString : string) =>
            {
                this.url = bond(this.getWithoutParams(), "?", rawParamsString);
                return this;
            }
            setRawParam = (key : string, rawValue : string) =>
            {
                this.getRawParams()[key] = rawValue;
                return this.setRawParamsString(Object.keys(this.rawParams).map(key => bond(key, "=", this.rawParams[key])).join("&"));
            }
            setParam = (key : string, value : string) => this.setRawParam(key, encodeURIComponent(value));

            toString = ()=> this.url;
        }
        export class Listener<ValueT>
        {
            private members : ((value : ValueT, options? : { [key:string] : any }) => Promise<void>)[] = [];
            push = (member : (value : ValueT, options? : { [key:string] : any }) => Promise<void>) : Listener<ValueT> =>
            {
                this.members.push(member);
                return this;
            };
            remove = (member : (value : ValueT, options? : { [key:string] : any }) => Promise<void>) : Listener<ValueT> =>
            {
                this.members = this.members.filter(i => member !== i);
                return this;
            };
            clear = () : Listener<ValueT> =>
            {
                this.members = [];
                return this;
            }
            fireAsync = async (value : ValueT, options? : { }) : Promise<void> =>
            {
                await Promise.all(this.members.map(async i => await i(value, options)));
            };
        };
        export class Property<ValueT>
        {
            constructor(private updater? : () => Promise<ValueT>) { }
            private value : ValueT = null;
            onUpdate = new Listener<Property<ValueT>>();
            onUpdateOnce = new Listener<Property<ValueT>>();
            exists = () : boolean => exists(this.value);
            get = () : ValueT => this.value;
            setAsync = async (value : ValueT, options? : { }) : Promise<ValueT> =>
            {
                if (this.value !== value)
                {
                    this.value = value;
                    await this.onUpdate.fireAsync(this, options);
                    await this.onUpdateOnce.fireAsync(this, options);
                    this.onUpdateOnce.clear();
                }
                return value;
            }
            updateAsync = async () : Promise<ValueT> => await this.setAsync(await this.updater());
            getOrUpdateAsync = async () : Promise<ValueT> => this.exists() ? this.get(): await this.updateAsync();
        }
        export const getOrCall = <ValueT>(i : ValueT | (() => ValueT)) : ValueT => "function" === typeof i ? (<() => ValueT>i)(): i; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        export const getOrCallAsync = async <ValueT>(i : ValueT | (() => Promise<ValueT>)) : Promise<ValueT> => "function" === typeof i ? await (<() => Promise<ValueT>>i)(): i; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        export const getLast = <ValutT>(i : ValutT[]) : ValutT => i[i.length - 1];
        export const arrayOrToArray = <ValueT>(i : ValueT | ValueT[]) : ValueT[] => Array.isArray(i) ? i: [i];
        export const flatMap = <ValueT, ResultT>(source : ValueT | ValueT[], mapFunction : (value : ValueT) => ResultT[]) : ResultT[] =>
        {
            let result : ResultT[] = [];
            core.arrayOrToArray(source).forEach
            (
                i => result = result.concat(mapFunction(i))
            );
            return result;
        };

        export const separateAndHead = (text : string, separator : string) : string =>
        {
            const index = text.indexOf(separator);
            return 0 <= index ? text.substring(0, index): text;
        }
        export const separateAndTail = (text : string, separator : string) : string =>
        {
            const index = text.indexOf(separator);
            return 0 <= index ? text.substring(index +separator.length): "";
        }
        export const separate = (text : string, separator : string) : { head : string, tail : string } =>
        {
            const index = text.indexOf(separator);
            return 0 <= index ?
            {
                head: text.substring(0, index),
                tail: text.substring(index +separator.length),
            }:
            {
                head: text,
                tail: null,
            };
        }
        export const bond = (head : string, separator : string, tail : string) => exists(tail) ? `${head}${separator}${tail}`: head;
    }
    export module cookie
    {
        export let defaultMaxAge = 30 * 24 * 60 * 60;
        let cache : {[key:string]:string} = null;
        export const setRaw = (key : string, value : string, maxAge? : number) : string =>
        {
            document.cookie = core.exists(maxAge)  ?
                `${key}=${value}; max-age=${maxAge}`:
                `${key}=${value}`;
            cacheOrUpdate()[key] = value;
            return value;
        };
        export const set = <ValueT>(key : string, value : ValueT, maxAge : number = defaultMaxAge) : ValueT =>
        {
            set(key, encodeURIComponent(JSON.stringify(value)), maxAge);
            return value;
        };
        export const setAsTemporary = <ValueT>(key : string, value : ValueT) : ValueT => set(key, value, null);
        export const setAsDaily = <ValueT>(key : string, value : ValueT) : ValueT => set(key, value, 24 * 60 * 60);
        export const setAsWeekly = <ValueT>(key : string, value : ValueT) : ValueT => set(key, value, 7 * 24 * 60 * 60);
        export const setAsMonthly = <ValueT>(key : string, value : ValueT) : ValueT => set(key, value, 30 * 24 * 60 * 60);
        export const setAsAnnually = <ValueT>(key : string, value : ValueT) : ValueT => set(key, value, 365 * 24 * 60 * 60);
        export const remove = (key : string) => setRaw(key, null, 0);
        export const update = () : {[key:string]:string} =>
        {
            cache = { };
            document.cookie
                .split(";")
                .map(i => i.trim())
                .forEach
                (
                    i =>
                    {
                        const { head, tail } = core.separate(i, "=");
                        cache[head] = tail;
                    }
                );
            return cache;
        };
        export const cacheOrUpdate = () : {[key:string]:string} => cache || update();
        export const getRaw = (key : string) : string => cacheOrUpdate()[key];
        export const getOrNull = <ValueT>(key : string) : ValueT => core.exists(getRaw(key)) ? <ValueT>JSON.parse(decodeURIComponent(cache[key])): null;

        export class Property<ValueT> extends core.Property<ValueT>
        {
            private key : string | (() => string);
            private maxAge? : number;
            constructor
            (
                params :
                {
                    key : string | (() => string),
                    updater? : () => Promise<ValueT>,
                    maxAge? : number,
                }
            )
            {
                super(params.updater);
                this.key = params.key;
                this.maxAge = params.maxAge;
            }
            save = () : Property<ValueT> =>
            {
                cookie.set(core.getOrCall(this.key), this.get(), this.maxAge);
                return this;
            }
            loadAsync = async () : Promise<ValueT> => await this.setAsync(cookie.getOrNull(core.getOrCall(this.key)), { onLoadAsync: true });
            loadOrUpdateAsync = async () : Promise<ValueT> =>
            {
                let result = await this.loadAsync();
                if (!core.exists(result))
                {
                    result = await this.updateAsync();
                }
                return result;
            };
        }
        export class AutoSaveProperty<ValueT> extends Property<ValueT>
        {
            constructor
            (
                params :
                {
                    key : string | (() => string),
                    updater? : () => Promise<ValueT>,
                    maxAge? : number,
                }
            )
            {
                super(params);
                this.onUpdate.push
                (
                    async (_value : Property<ValueT>, options? : { [key:string] : any }) : Promise<void> =>
                    {
                        if (!options || !options.onLoadAsync)
                        {
                            this.save();
                        }
                    }
                );
            }
        }
    }
    export module dom
    {
        export const make = (arg : any) : Node =>
        {
            if (arg instanceof Node)
            {
                return arg;
            }
            if ("string" === core.practicalTypeof(arg))
            {
                return document.createTextNode(arg);
            }
            return setToElement(document.createElement(arg.tag), arg);
        };
        export const setToElement = (element : Element, arg : any) : Node =>
        {
            Object.keys(arg).forEach
            (
                key =>
                {
                    switch(key)
                    {
                    case "tag":
                    case "parent":
                    case "children":
                    case "attributes":
                    case "eventListener":
                        //  nop
                        break;
                    default:
                        const value = arg[key];
                        if (undefined !== value)
                        {
                            if ("object" === core.practicalTypeof(value))
                            {
                                core.recursiveAssign(element[key], value);
                            }
                            else
                            {
                                element[key] = value;
                            }
                        }
                        break;
                    }
                }
            );
            if (undefined !== arg.attributes)
            {
                Object.keys(arg.attributes).forEach
                (
                    key =>
                    {
                        element.setAttribute(key, arg.attributes[key]);
                        //  memo: value を持たない attribute を設定したい場合には value として "" を指定すれば良い。
                    }
                );
            }
            if (undefined !== arg.children)
            {
                core.arrayOrToArray(arg.children).forEach((i : any) => element.appendChild(make(i)));
            }
            if (undefined !== arg.eventListener)
            {
                Object.keys(arg.eventListener).forEach
                (
                    key =>
                    {
                        element.addEventListener(key, arg.eventListener[key]);
                    }
                );
            }
            if (undefined !== arg.parent)
            {
                appendChildren(arg.parent, element);
            }
            return element;
        };
        export const remove = (node : Node) : Node => node.parentNode.removeChild(node);
        export const removeChildren = (parent : Element, isRemoveChild? : (child : Node) => boolean) : Element =>
        {
            if (isRemoveChild)
            {
                parent.childNodes.forEach
                (
                    j =>
                    {
                        if (isRemoveChild(j))
                        {
                            remove(j);
                        }
                    }
                );
            }
            else
            {
                parent.innerHTML = "";
            }
            return parent;
        };
        export const appendChildren = (parent : Element, newChildren : any, refChild? : Node) : Element =>
        {
            if (undefined === refChild)
            {
                core.arrayOrToArray(newChildren).forEach((i : any) => parent.appendChild(make(i)));
            }
            else
            {
                core.arrayOrToArray(newChildren).forEach((i : any) => parent.insertBefore(make(i), refChild));
            }
            return parent;
        };
        export const replaceChildren = (parent : Element, newChildren : any, isRemoveChild? : (child : Node) => boolean, refChild? : Node) : Element =>
        {
            removeChildren(parent, isRemoveChild);
            appendChildren(parent, newChildren, refChild);
            return parent;
        };
    }
}