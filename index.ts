
export module minamo
{
    export module core
    {
        export function undefinedable<ParameterType, ReturnType>(target: (parameter: ParameterType) => ReturnType): (parameter: ParameterType | undefined) => ReturnType | undefined;
        export function undefinedable<ParameterType, ReturnType, DefaultType>(target: (parameter: ParameterType) => ReturnType, defaultResult: DefaultType): (parameter: ParameterType | undefined) => ReturnType | DefaultType;
        export function undefinedable<ParameterType, ReturnType, DefaultType>(target: (parameter: ParameterType) => ReturnType, defaultResult?: DefaultType)
        {
            return (parameter: ParameterType | undefined) => undefined === parameter ? defaultResult: target(parameter);
        }
        export type JsonableValue = null | boolean | number | string;
        export interface JsonableObject
        {
            [key: string]: undefined | Jsonable;
        }
        export type Jsonable = JsonableValue | Jsonable[] | JsonableObject;
        export type JsonablePartial<Target> = { [key in keyof Target]?: Target[key] } & JsonableObject;
        export const jsonStringify = <T extends Jsonable>(source: T, replacer?: (this: any, key: string, value: any) => any, space?: string | number) => JSON.stringify(source, replacer, space);
        export const extender = <Base>() => <Extended extends Base>(x: Extended) => x; // TypeScript 4.8 以降では satisfies の使用を推奨
        export const timeout = async (wait: number): Promise<void> =>
            new Promise<void>(resolve => setTimeout(resolve, wait));
        export const tryOrThrough = function<ResultType, ArgumentType extends unknown[]>(title: string, f: (...args: ArgumentType) => ResultType, ...args: ArgumentType): ResultType | undefined
        {
            let result;
            try
            {
                result = f(...args);
            }
            catch(err)
            {
                console.error(`🚫 ${title}: ${err}`);
            }
            return result;
        };
        export const tryOrThroughAsync = async function<ResultType, ArgumentType extends unknown[]>(title: string, f: (...args: ArgumentType) => Promise<ResultType>, ...args: ArgumentType): Promise<ResultType | undefined>
        {
            let result;
            try
            {
                result = await f(...args);
            }
            catch(err)
            {
                console.error(`🚫 ${title}: ${err}`);
            }
            return result;
        };
        export const simpleDeepCopy = <T extends Jsonable>(source: T): T => JSON.parse(jsonStringify(source)) as T;
        export const recursiveAssign = (target: {[key:string]:any}, source: object): void => objectForEach
        (
            source,
            (key, value) =>
            {
                if ("object" === practicalTypeof(value))
                {
                    if (undefined === target[key])
                    {
                        target[key] = { };
                    }
                    recursiveAssign(target[key], value);
                }
                else
                if ("array" === practicalTypeof(value))
                {
                    if (undefined === target[key])
                    {
                        target[key] = [ ];
                    }
                    recursiveAssign(target[key], value);
                }
                else
                {
                    target[key] = value;
                }
            }
        );
        export const objectKeys = <T extends object>(target: T) => Object.keys(target) as (keyof T & string)[];
        export const practicalTypeof = function(obj: any): string
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
        export const exists = <T>(i: T | null | undefined): i is T => undefined !== i && null !== i;
        export const existsOrThrow = <ValueT>(i: ValueT | null | undefined): ValueT =>
        {
            if (!exists(i))
            {
                throw new ReferenceError("minamo.core.existsOrThrow() encountered a unexist value.");
            }
            return i;
        };
        export const existFilter = <T>(list: (T | null | undefined)[]): T[] => <T[]>(list.filter(i => exists(i)));
        export class Url
        {
            constructor(private url: string)
            {
            }

            rawParams: {[key:string]:string} | null = null;

            set = (url: string) =>
            {
                this.url = url;
                this.rawParams = null;
                return this;
            }

            getWithoutParams = (): string => separate(this.url, "?").head;

            getRawParamsString = (): string => separate(this.url, "?").tail ?? "";
            getRawParams = (): {[key:string]:string} =>
            {
                if (!this.rawParams)
                {
                    const params: {[key:string]:string} = this.rawParams = { };
                    this.getRawParamsString().split("&")
                        .forEach
                        (
                            i =>
                            {
                                const { head, tail } = core.separate(i, "=");
                                params[head] = tail ?? "";
                            }
                        );
                }
                return this.rawParams;
            }
            getParam = (key: string): string => decodeURIComponent(this.getRawParams()[key]);

            private updateParams = () => this.setRawParamsString
            (
                objectToArray(this.rawParams ?? { }, (k, v) => bond(k, "=", v))
                    .join("&")
            )

            setRawParamsString = (rawParamsString: string) =>
            {
                this.url = bond(this.getWithoutParams(), "?", rawParamsString);
                return this;
            }
            setRawParam = (key: string, rawValue: string) =>
            {
                this.getRawParams()[key] = rawValue;
                return this.updateParams();
            }
            setParam = (key: string, value: string) => this.setRawParam(key, encodeURIComponent(value));
            setRawParams = (params: {[key:string]:string}) =>
            {
                this.rawParams = params;
                return this.updateParams();
            }
            setParams = (params: {[key:string]:string}) =>
                this.setRawParams(objectMap(params, (_key, value) => encodeURIComponent(value)))

            toString = ()=> this.url;
        }
        export class Listener<ValueT>
        {
            private members: ((value: ValueT, options?: { [key:string]: any }) => Promise<void>)[] = [];
            push = (member: (value: ValueT, options?: { [key:string]: any }) => Promise<void>): Listener<ValueT> =>
            {
                this.members.push(member);
                return this;
            }
            remove = (member: (value: ValueT, options?: { [key:string]: any }) => Promise<void>): Listener<ValueT> =>
            {
                this.members = this.members.filter(i => member !== i);
                return this;
            }
            clear = (): Listener<ValueT> =>
            {
                this.members = [];
                return this;
            }
            fireAsync = async (value: ValueT, options?: { }): Promise<void> =>
            {
                await Promise.all(this.members.map(async i => await i(value, options)));
            }
        }
        export class Property<ValueT>
        {
            constructor(private updater?: () => Promise<ValueT>) { }
            private value: ValueT | null = null;
            onUpdate = new Listener<Property<ValueT>>();
            onUpdateOnce = new Listener<Property<ValueT>>();
            exists = (): boolean => exists(this.value);
            get = (): ValueT | null => this.value;
            async setAsync(value: null, options?: { }): Promise<null>;
            async setAsync(value: ValueT, options?: { }): Promise<ValueT>;
            async setAsync(value: ValueT | null, options?: { }): Promise<ValueT | null>
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
            updateAsync = async (): Promise<ValueT | null> => this.updater ? await this.setAsync(await this.updater()): null;
            getOrUpdateAsync = async (): Promise<ValueT | null> => this.exists() ? this.get(): await this.updateAsync();
        }
        export const getOrCall = <ValueT>(i: ValueT | (() => ValueT)): ValueT =>
            "function" === typeof i ?
                (<() => ValueT>i)():
                i; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        export const getOrCallAsync = async <ValueT>(i: ValueT | (() => Promise<ValueT>)): Promise<ValueT> =>
            "function" === typeof i ?
                await (<() => Promise<ValueT>>i)():
                i; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        export const getLast = <ValueT>(x: ValueT | ValueT[]): ValueT =>  Array.isArray(x) ? x[x.length - 1]: x;
        export const arrayOrToArray = <ValueT>(x: ValueT | ValueT[]): ValueT[] => Array.isArray(x) ? x: [x];
        export const singleOrArray = <ValueT>
        (
            x: ValueT | ValueT[],
            singleFunction: (i: ValueT) => void,
            arrayFunction: (a: ValueT[]) => void
        ): void => Array.isArray(x) ? arrayFunction(x): singleFunction(x);

        export const flatMap = <ValueT, ResultT>
        (
            source: ValueT | ValueT[],
            mapFunction: (value: ValueT) => ResultT[]
        ): ResultT[] =>
        {
            let result: ResultT[] = [];
            core.arrayOrToArray(source).forEach
            (
                i => result = result.concat(mapFunction(i))
            );
            return result;
        };
        export const objectForEach =
        (
            source: {[key:string]:any},
            eachFunction: (key: string, value: any, object: {[key:string]:any}) => void
        ): void =>
        {
            Object.keys(source).forEach
            (
                key => eachFunction(key, source[key], source)
            );
        };
        export const objectMap =
        (
            source: {[key:string]:any},
            mapFunction: (key: string, value: any, object: {[key:string]:any}) => any
        ): {[key:string]:any} =>
        {
            const result: {[key:string]:any} = { };
            objectForEach(source, key => result[key] = mapFunction(key, source[key], source));
            return result;
        };
        export const objectFilter =
        (
            source: {[key:string]:any},
            filterFunction: (key: string, value: any, object: {[key:string]:any}) => boolean
        ): {[key:string]:any} =>
        {
            const result: {[key:string]:any} = { };
            objectForEach
            (
                source,
                key =>
                {
                    const value = source[key];
                    if (filterFunction(key, value, source))
                    {
                        result[key] = value;
                    }
                }
            );
            return result;
        };
        export const objectToArray = <ResultT>
        (
            source: {[key:string]:any},
            mapFunction: (key: string, value: any, object: {[key:string]:any}) => ResultT
        ): ResultT[] =>
        {
            const result: ResultT[] = [ ];
            objectForEach(source, (key, value) => result.push(mapFunction(key, value, source)));
            return result;
        };

        export const separate = (text: string, separator: string): { head: string, tail: string | null } =>
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
        };
        export const bond = (head: string, separator: string, tail: string) =>
            exists(tail) ?
                `${existsOrThrow(head)}${existsOrThrow(separator)}${tail}`:
                existsOrThrow(head);
        export const loopMap = <ValueT>(mapFunction: (index: number, result: ValueT[]) => ValueT | null, limit?: number) =>
        {
            const result: ValueT[] = [];
            let index = 0;
            if (!exists(limit))
            {
                limit = 100000;
            }
            while(true)
            {
                if ("number" === typeof limit && limit <= index)
                {
                    throw new RangeError(`minamo.core.loopMap() overs the limit(${limit})`);
                }
                const current = mapFunction(index++, result);
                if (exists(current))
                {
                    result.push(current);
                }
                else
                {
                    break;
                }
            }
            return result;
        };
        export const countMap = <ValueT>(count: number, mapFunction: ValueT | ((index: number, result: ValueT[]) => ValueT)) =>
        {
            const result: ValueT[] = [];
            let index = 0;
            while(index < count)
            {
                result.push
                (
                    "function" === typeof mapFunction ?
                        (<(index: number, result: ValueT[]) => ValueT>mapFunction)(index, result):
                        mapFunction
                );
                ++index;
            }
            return result;
        };
        export const zeroPadding = (length: number, n: number): string =>
        {
            if (21 < length)
            {
                throw new RangeError(`length(${length}) in minamo.core.zeroPadding() overs 21.`);
            }
            if (1e+21 <= n)
            {
                throw new RangeError(`n(${n}) in minamo.core.zeroPadding() is 1e+21 or more.`);
            }
            if (n <= -1e+21)
            {
                throw new RangeError(`n(${n}) in minamo.core.zeroPadding() is -1e+21 or less.`);
            }

            const sign = n < 0 ? "-": "";
            const core = `${Math.abs(Math.round(n))}`;
            const paddingLength = length -(sign.length + core.length);
            const padding = 0 < paddingLength ? "00000000000000000000".substr(-paddingLength): "";
            return `${sign}${padding}${core}`;
        };
        export const NYI = <T>(_: T | null = null): T => { throw new Error("Not Yet Implement!"); };
        export module comparer
        {
            export type TypeOfResultType = "unknown" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function" | string;
            export type CompareResultType = -1 | 0 | 1;
            export type ComparerType<objectT> = (a: objectT, b: objectT) => CompareResultType;
            export const basic = <valueT>(a: valueT, b: valueT): CompareResultType =>
                a < b ? -1:
                b < a ? 1:
                0;
            export interface RawSource<objectT>
            {
                raw: ComparerType<objectT>;
            }
            export interface Source<objectT, valueT, valueT2>
            {
                condition?: ((a: objectT, b: objectT) => boolean) | TypeSource<objectT, valueT2>;
                getter: (object: objectT) => valueT;
            }
            export interface TypeSource<objectT, valueT>
            {
                getter?: (object: objectT) => valueT;
                type: TypeOfResultType;
            }
            export const make = <objectT, valueT = unknown, valueT2 = unknown>
            (
                source: ((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2> |
                    ((((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2>)[])
            ): ComparerType<objectT> =>
            {
                const invoker = <objectT>(i: ((object: objectT) => valueT) | RawSource<objectT> | Source<objectT, valueT, valueT2>): ComparerType<objectT> | undefined =>
                {
                    const f = i as ((object: objectT) => valueT);
                    if ("function" === typeof f)
                    {
                        return (a: objectT, b: objectT) => basic(f(a), f(b));
                    }
                    const r = i as RawSource<objectT>;
                    if (undefined !== r?.raw)
                    {
                        return r.raw;
                    }
                    const s = i as Source<objectT, valueT, valueT2>;
                    if (undefined !== s?.getter)
                    {
                        const body = (a: objectT, b: objectT) => basic(s.getter(a), s.getter(b));
                        if (undefined === s.condition)
                        {
                            return body;
                        }
                        else
                        {
                            const f = s.condition as ((a: objectT, b: objectT) => boolean);
                            if ("function" === typeof f)
                            {
                                return (a: objectT, b: objectT) => f(a, b) ? body(a, b): 0;
                            }
                            else
                            {
                                const t = (s.condition as TypeSource<objectT, valueT2>);
                                const getter = t.getter;
                                if (undefined === getter)
                                {
                                    return (a: objectT, b: objectT) => t.type === typeof a && t.type === typeof b ? body(a, b): 0;
                                }
                                else
                                {
                                    return (a: objectT, b: objectT) => t.type === typeof getter(a) && t.type === typeof getter(b) ? body(a, b): 0;
                                }
                            }
                        }
                    }
                    return undefined;
                };
                if (Array.isArray(source))
                {
                    const comparerList = <ComparerType<objectT>[]>source.map(invoker).filter(i => undefined !== i);
                    return (a: objectT, b: objectT) =>
                    {
                        let result: CompareResultType  = 0;
                        for(let i = 0; i < comparerList.length && 0 === result; ++i)
                        {
                            result = comparerList[i](a, b);
                        }
                        return result;
                    };
                }
                else
                {
                    return invoker(source) ?? (() => 0);
                }
            };
            export const lowerCase = make<string>([a => a.toLowerCase(), { raw:basic }]);
        }
        export const parseTimespan = (timespan: any):number | null =>
        {
            try
            {
                switch(typeof timespan)
                {
                case "number":
                    return timespan;
                case "string":
                    if (timespan.endsWith("ms"))
                    {
                        return parseFloat(timespan.substring(0, timespan.length -2).trim());
                    }
                    else
                    if (timespan.endsWith("s"))
                    {
                        return parseFloat(timespan.substring(0, timespan.length -1).trim()) *1000;
                    }
                    else
                    if (timespan.endsWith("m"))
                    {
                        return parseFloat(timespan.substring(0, timespan.length -1).trim()) *60 *1000;
                    }
                    else
                    if (timespan.endsWith("h"))
                    {
                        return parseFloat(timespan.substring(0, timespan.length -1).trim()) *60 *60 *1000;
                    }
                    else
                    if (timespan.endsWith("d"))
                    {
                        return parseFloat(timespan.substring(0, timespan.length -1).trim()) *24 *60 *60 *1000;
                    }
                    else
                    if (timespan.endsWith("y"))
                    {
                        return parseFloat(timespan.substring(0, timespan.length -1).trim()) *365.2425 *24 *60 *60 *1000;
                    }
                    else
                    {
                        return parseInt(timespan.trim());
                    }
                }
            }
            catch(err)
            {
                console.error(err);
            }
            return null;
        };
        export const timespanToString = (value: number): string =>
        {
            if (value < 0)
            {
                return `-${timespanToString(-value)}`;
            }
            else
            {
                const units =
                [
                    {
                        label: "y",
                        size: 365.2425 *24 *60 *60 *1000
                    },
                    {
                        label: "d",
                        size: 24 *60 *60 *1000
                    },
                    {
                        label: "h",
                        size: 60 *60 *1000
                    },
                    {
                        label: "m",
                        size: 60 *1000
                    },
                    {
                        label: "s",
                        size: 1000
                    },
                    {
                        label: "ms",
                        size: 1
                    }
                ];
                let i = 0;
                do
                {
                    const unit = units[i];
                    if (unit.size <= value)
                    {
                        return `${value/unit.size}${unit.label}`;
                    }
                }
                while(++i < units.length);
                return `${value}ms`;
            }
        };
    }
    export module environment
    {
        export const isIE = (): boolean => core.NYI(false);
        export const isEdge = (): boolean => core.NYI(false);
        export const isSafari = (): boolean => core.NYI(false);
        export const isFirefox = (): boolean => core.NYI(false);
        export const isChrome = (): boolean => core.NYI(false);
        export const isPC = (): boolean => core.NYI(false);
        export const isWindows = (): boolean => core.NYI(false);
        export const isMac = (): boolean => core.NYI(false);
        export const isLinux = (): boolean => core.NYI(false);
        export const isiOs = (): boolean => core.NYI(false);
        export const isiAndroid = (): boolean => core.NYI(false);
    }
    export module cookie
    {
        export let defaultMaxAge = 30 * 24 * 60 * 60;
        let cache: {[key:string]:(string|null)} | null = null;
        export const setRaw = (key: string, value: string | null, maxAge?: number | null): string | null =>
        {
            document.cookie = core.exists(maxAge)  ?
                `${key}=${value}; max-age=${maxAge}`:
                `${key}=${value}`;
            cacheOrUpdate()[key] = value;
            return value;
        };
        export const set = <ValueT extends core.Jsonable>(key: string, value: ValueT, maxAge: number | null = defaultMaxAge): ValueT =>
        {
            setRaw(key, encodeURIComponent(core.jsonStringify(value)), maxAge);
            return value;
        };
        export const setAsTemporary = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT => set(key, value, null);
        export const setAsDaily = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT => set(key, value, 24 * 60 * 60);
        export const setAsWeekly = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT => set(key, value, 7 * 24 * 60 * 60);
        export const setAsMonthly = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT => set(key, value, 30 * 24 * 60 * 60);
        export const setAsAnnually = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT => set(key, value, 365 * 24 * 60 * 60);
        export const remove = (key: string) => setRaw(key, null, 0);
        export const update = (): {[key:string]:(string|null)} =>
        {
            const result: {[key:string]:(string|null)} = cache = { };
            document.cookie
                .split(";")
                .map(i => i.trim())
                .forEach
                (
                    i =>
                    {
                        const { head, tail } = core.separate(i, "=");
                        result[head] = tail ?? "";
                    }
                );
            return result;
        };
        export const cacheOrUpdate = (): {[key:string]:(string|null)} => cache ?? update();
        export const getRaw = (key: string): string | null => cacheOrUpdate()[key];
        export const getOrNull = <ValueT>(key: string): ValueT | null =>
        {
            const rawValue = getRaw(key);
            return core.exists(rawValue) ? <ValueT>JSON.parse(decodeURIComponent(rawValue)): null;
        };

        export class Property<ValueT extends core.Jsonable> extends core.Property<ValueT>
        {
            private key: string | (() => string);
            private maxAge?: number;
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params.updater);
                this.key = params.key;
                this.maxAge = params.maxAge;
            }
            save = (): Property<ValueT> =>
            {
                cookie.set(core.getOrCall(this.key), this.get(), this.maxAge);
                return this;
            }
            loadAsync = async (): Promise<ValueT | null> => await this.setAsync
            (
                cookie.getOrNull(core.getOrCall(this.key)),
                { onLoadAsync: true }
            )
            loadOrUpdateAsync = async (): Promise<ValueT | null> =>
            {
                let result = await this.loadAsync();
                if (!core.exists(result))
                {
                    result = await this.updateAsync();
                }
                return result;
            }
        }
        export class AutoSaveProperty<ValueT extends core.Jsonable> extends Property<ValueT>
        {
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params);
                this.onUpdate.push
                (
                    async (_value: core.Property<ValueT>, options?: { [key:string]: any }): Promise<void> =>
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

    export module localStorage
    {
        export const setRaw = (key: string, value: string): string =>
        {
            window.localStorage.setItem(key, value);
            return value;
        };
        /**
         * @deprecated User `set2()` instead.
         */
        export const set = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT => // 非推奨
        {
            setRaw(key, encodeURIComponent(core.jsonStringify(value)));
            return value;
        };
        export const set2 = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT =>
        {
            setRaw(key, core.jsonStringify(value));
            return value;
        };
        export const remove = (key: string) => window.localStorage.removeItem(key);
        export const getRaw = (key: string): string | null => window.localStorage.getItem(key);

        /**
         * @deprecated User `getOrNull2()` instead.
         */
         export const getOrNull = <ValueT>(key: string): ValueT | null => // 非推奨
        {
            const rawValue = getRaw(key);
            return  core.exists(rawValue) ? <ValueT>JSON.parse(decodeURIComponent(rawValue)): null;
        };
        export const getOrNull2 = <ValueT>(key: string): ValueT | null =>
        {
            const rawValue = getRaw(key);
            return  core.exists(rawValue) ? <ValueT>JSON.parse(rawValue): null;
        };

        /**
         * @deprecated
         */
         export class Property<ValueT extends core.Jsonable> extends core.Property<ValueT> // 非推奨
        {
            private key: string | (() => string);
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>
                }
            )
            {
                super(params.updater);
                this.key = params.key;
            }
            save = (): Property<ValueT> =>
            {
                cookie.set(core.getOrCall(this.key), this.get());
                return this;
            }
            loadAsync = async (): Promise<ValueT | null> => await this.setAsync
            (
                cookie.getOrNull(core.getOrCall(this.key)),
                { onLoadAsync: true }
            )
            loadOrUpdateAsync = async (): Promise<ValueT | null> =>
            {
                let result = await this.loadAsync();
                if (!core.exists(result))
                {
                    result = await this.updateAsync();
                }
                return result;
            }
        }
        /**
         * @deprecated
         */
         export class AutoSaveProperty<ValueT extends core.Jsonable> extends Property<ValueT>
        {
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params);
                this.onUpdate.push
                (
                    async (_value: core.Property<ValueT>, options?: { [key:string]: any }): Promise<void> =>
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
    
    export module sessionStorage
    {
        export const setRaw = (key: string, value: string): string =>
        {
            window.sessionStorage.setItem(key, value);
            return value;
        };
        /**
         * @deprecated User `set2()` instead.
         */
         export const set = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT =>
        {
            setRaw(key, encodeURIComponent(core.jsonStringify(value)));
            return value;
        };
        export const set2 = <ValueT extends core.Jsonable>(key: string, value: ValueT): ValueT =>
        {
            setRaw(key, core.jsonStringify(value));
            return value;
        };
        export const remove = (key: string) => window.sessionStorage.removeItem(key);
        export const getRaw = (key: string): string | null => window.sessionStorage.getItem(key);

        /**
         * @deprecated User `getOrNull2()` instead.
         */
         export const getOrNull = <ValueT>(key: string): ValueT | null =>
        {
            const rawValue = getRaw(key);
            return  core.exists(rawValue) ? <ValueT>JSON.parse(decodeURIComponent(rawValue)): null;
        };
        export const getOrNull2 = <ValueT>(key: string): ValueT | null =>
        {
            const rawValue = getRaw(key);
            return  core.exists(rawValue) ? <ValueT>JSON.parse(rawValue): null;
        };

        /**
         * @deprecated
         */
         export class Property<ValueT extends core.Jsonable> extends core.Property<ValueT>
        {
            private key: string | (() => string);
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>
                }
            )
            {
                super(params.updater);
                this.key = params.key;
            }
            save = (): Property<ValueT> =>
            {
                cookie.set(core.getOrCall(this.key), this.get());
                return this;
            }
            loadAsync = async (): Promise<ValueT | null> => await this.setAsync
            (
                cookie.getOrNull(core.getOrCall(this.key)),
                { onLoadAsync: true }
            )
            loadOrUpdateAsync = async (): Promise<ValueT | null> =>
            {
                let result = await this.loadAsync();
                if (!core.exists(result))
                {
                    result = (await this.updateAsync()) ?? result;
                }
                return result;
            }
        }
        /**
         * @deprecated
         */
         export class AutoSaveProperty<ValueT extends core.Jsonable> extends Property<ValueT>
        {
            constructor
            (
                params :
                {
                    key: string | (() => string),
                    updater?: () => Promise<ValueT>,
                    maxAge?: number,
                }
            )
            {
                super(params);
                this.onUpdate.push
                (
                    async (_value: core.Property<ValueT>, options?: { [key:string]: any }): Promise<void> =>
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

    export module http
    {
        export const request = (method: string, url: string, body?: Document | BodyInit | null, headers?: { [key: string]: string}): Promise<string> => new Promise<string>
        (
            (resolve, reject) =>
            {
                const request = new XMLHttpRequest();
                request.open(method, url, true);
                if (headers)
                {
                    console.log(`headers: ${core.jsonStringify(headers)}`);
                    Object.keys(headers).forEach(key => request.setRequestHeader(key, headers[key]));
                }
                request.onreadystatechange = function()
                {
                    if (4 === request.readyState)
                    {
                        if (200 <= request.status && request.status < 300)
                        {
                            resolve(request.responseText);
                        }
                        else
                        {
                            reject
                            (
                                {
                                    url,
                                    request
                                }
                            );
                        }
                    }
                };
                console.log(`body: ${JSON.stringify(body)}`);
                request.send(body as any); // VS Code エディター上で異なる ES バージョンでコンパイルされエラー表示されてしまう問題回避の為の any
            }
        );

        export const get = (url : string, headers?: { [key: string]: string}): Promise<string> => request("GET", url, undefined, headers);
        export const post = (url : string, body?: Document | BodyInit | null, headers?: { [key: string]: string}): Promise<string> => request("POST", url, body, headers);
        export const getJson = async <T>(url : string, headers?: { [key: string]: string}): Promise<T> => <T>JSON.parse(await get(url, headers));
        export const postJson = async <T>(url : string, body?: Document | BodyInit | null, headers?: { [key: string]: string}): Promise<T> => <T>JSON.parse(await post(url, body, headers));
    }
    
    export module file
    {
        export const readAsText = (file: File): Promise<string> => new Promise<string>
        (
            (resolve, reject) =>
            {
                const reader = new FileReader();
                reader.onload = ()=> resolve(<string>reader.result);
                reader.onerror = ()=> reject(reader.error);
                reader.readAsText(file);
            }
        );
    }
    
    export module dom
    {
        export function get<T extends Element>(query: string): T;
        export function get<T extends Element>(queryOrElement: T | string): T;
        export function get<T extends Element>(parent: Document | Element | string, queryOrElement: T | string): T;
        export function get<T extends Element>(parent: any, queryOrElement?: T | string): T
        {
            if (undefined === queryOrElement)
            {
                return get(document, parent as any);
            }
            if ("string" === typeof parent)
            {
                return get(get(document, parent), queryOrElement);
            }
            if ("string" === typeof queryOrElement)
            {
                return <T>parent.querySelector(queryOrElement);
            }
            return queryOrElement;
        }
        export function getAll<T extends Element>(queryOrElement: T[] | string): T[];
        export function getAll<T extends Element>(parent: Document | Element | string, queryOrElement: T[] | string): T[];
        export function getAll<T extends Element>(parent: any, queryOrElement?: T[] | string): T[]
        {
            if (undefined === queryOrElement)
            {
                return getAll(document, parent as any);
            }
            if ("string" === typeof parent)
            {
                return getAll(get(document, parent), queryOrElement);
            }
            if ("string" === typeof queryOrElement)
            {
                return <T[]>Array.from(parent.querySelectorAll(queryOrElement));
            }
            return queryOrElement;
        }
        type AlphaSource =
            {
                outerHTML: string,
            } |
            string |
            Node;
        type EventHandler<EventType extends Event> = (event: EventType) => unknown;
        export type AttributesSource = { [key: string]: EventHandler<any> | string };
        export type AlphaObjectSource = { [key: string]: EventHandler<any> | Source | AttributesSource | undefined } &
        {
            tag?: string,
            className?: string,
            style?: string,
            attributes?: AttributesSource,
            children?: Source,
            onclick?: (event: MouseEvent) => unknown,
        };
        export type ObjectSource = AlphaObjectSource &
        {
            tag: string,
        };
        export type Source = AlphaSource | ObjectSource | Source[];
        export function make<T extends Element>(constructor: { new (): T, prototype: T }): (arg: object) => T;
        export function make(constructor: { new (): HTMLHeadingElement, prototype: HTMLHeadingElement }, level: number): (arg: object) => HTMLHeadingElement;
        export function make(arg: Source): Node;
        export function make(arg: any, level?: number): any
        {
            core.existsOrThrow(arg);
            if (arg instanceof Node)
            {
                return arg;
            }
            if ("string" === core.practicalTypeof(arg))
            {
                return document.createTextNode(<string>arg);
            }
            if (arg.prototype)
            {
                let tag = arg.name.replace(/HTML(.*)Element/, "$1".toLowerCase());
                switch(tag)
                {
                case "anchor":
                    tag = "a";
                    break;
                case "heading":
                    tag = `h${level}`;
                    break;
                case "dlist":
                    tag = "dl";
                    break;
                case "olist":
                    tag = "ol";
                    break;
                case "ulist":
                    tag = "ol";
                    break;
                }
                return (arg2: any) => set(document.createElement(tag), arg2);
            }
            if (arg.outerHTML)
            {
                return make(HTMLDivElement)({innerHTML: arg.outerHTML}).firstChild;
            }
            return set(document.createElement(arg.tag), arg);
        }
        export const tag = (tag: string) => (className: string | minamo.dom.AlphaObjectSource) => (children: minamo.dom.Source) =>
            "string" === typeof className ?
            {
                tag,
                children,
                className,
            }:
            Object.assign
            (
                {
                    tag,
                    children,
                },
                className,
            );
        export const set = <T extends Element>(element: T, arg: any): T =>
        {
            core.objectForEach
            (
                arg,
                (key, value) =>
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
                        if (undefined !== value)
                        {
                            if ("object" === core.practicalTypeof(value))
                            {
                                core.recursiveAssign((element as any)[key], value);
                            }
                            else
                            {
                                (element as any)[key] = value;
                            }
                        }
                        break;
                    }
                }
            );
            if (undefined !== arg.attributes)
            {
                //  memo: value を持たない attribute を設定したい場合には value として "" を指定すれば良い。
                core.objectForEach(arg.attributes, (key, value) => element.setAttribute(key, value));
            }
            if (undefined !== arg.children)
            {
                core.arrayOrToArray(arg.children).forEach
                (
                    (i: Source) => core.arrayOrToArray(i).forEach
                    (
                        (j: Source) => element.appendChild(make(j))
                    )
                );
            }
            if (undefined !== arg.eventListener)
            {
                core.objectForEach(arg.eventListener, (key, value) => element.addEventListener(key, value));
            }
            if (undefined !== arg.parent)
            {
                appendChildren(arg.parent, element);
            }
            return element;
        };
        export const remove = <NodeType extends Node>(node: NodeType): NodeType => node.parentNode?.removeChild(node) ?? node;
        export const removeChildren = <ElementType extends Element>(parent: ElementType, isRemoveChild?: (child: Node) => boolean): ElementType =>
        {
            if (isRemoveChild)
            {
                parent.childNodes.forEach
                (
                    i =>
                    {
                        if (isRemoveChild(i))
                        {
                            parent.removeChild(i);
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
        export const appendChildren = <ElementType extends Element>(parent: ElementType, newChildren: Source, refChild?: Node): ElementType =>
        {
            core.singleOrArray
            (
                newChildren,
                i => undefined === refChild ?
                    parent.appendChild(make(i)):
                    parent.insertBefore(make(i), refChild),
                a => a.forEach(i => appendChildren(parent, i, refChild))
            );
            return parent;
        };
        export const replaceChildren =
        <ElementType extends Element>(
            parent: ElementType,
            newChildren: any,
            isRemoveChild?: (child: Node) => boolean,
            refChild?: Node
        ): ElementType =>
        {
            removeChildren(parent, isRemoveChild);
            appendChildren(parent, newChildren, refChild);
            return parent;
        };
        export const getElementsByClassName = <T extends Element>(parent: Document | Element, className: string) =>
            Array.from(parent.getElementsByClassName(className)) as T[];
        export const getDivsByClassName = (parent: Document | Element, className: string) =>
            getElementsByClassName<HTMLDivElement>(parent, className);
        export const getSpansByClassName = (parent: Document | Element, className: string) =>
            getElementsByClassName<HTMLSpanElement>(parent, className);
        export const getButtonsByClassName = (parent: Document | Element, className: string) =>
            getElementsByClassName<HTMLButtonElement>(parent, className);
        export const getChildNodes = <T extends ChildNode>(parent: Node) =>
            Array.from(parent.childNodes) as T[];
        export const setProperty = <T extends Node | CSSStyleDeclaration, U>(objectOrQuery: T | string, key: string, value: U) =>
        {
            const element = get(objectOrQuery as string);
            const isUpdate = value !== (element as any)[key];
            if (isUpdate)
            {
                if (undefined === value && element instanceof CSSStyleDeclaration)
                {
                    element.removeProperty(key);
                }
                else
                {
                    (element as any)[key] = value;
                }
            }
            const result =
            {
                object: element,
                key,
                value,
                isUpdate,
            };
            return result;
        };
        export const setProperties = <T extends Node | CSSStyleDeclaration>(objectOrQuery: T | string, data: { [key: string]: unknown }) =>
            core.objectKeys(data).map(key => setProperty(objectOrQuery, key, data[key]));
        export const removeCSSStyleProperty = <T extends CSSStyleDeclaration>(object: T, key: string) =>
        {
            const isUpdate = undefined !== (object as any)[key];
            if (isUpdate)
            {
                object.removeProperty(key);
            }
            const result =
            {
                object,
                key,
                isUpdate,
            };
            return result;
        };
        export const setStyleProperty = <T extends HTMLElement | SVGAElement, U>(object: T | string, key: keyof CSSStyleDeclaration, value: U) =>
            setProperty(get(object).style, key as string, value ?? "");
        export const addCSSClass = <T extends Element>(element: T, className: string) =>
        {
            const isUpdate = ! element.classList.contains(className);
            if (isUpdate)
            {
                element.classList.add(className);
            }
            const result =
            {
                element,
                className,
                isUpdate,
            };
            return result;
        };
        export const removeCSSClass = <T extends Element>(element: T, className: string) =>
        {
            const isUpdate = element.classList.contains(className);
            if (isUpdate)
            {
                element.classList.remove(className);
            }
            const result =
            {
                element,
                className,
                isUpdate,
            };
            return result;
        };
        export const toggleCSSClass = <T extends Element>(element: T, className: string, toggle: boolean) =>
            toggle ?
                addCSSClass(element, className):
                removeCSSClass(element, className);
    }
}
