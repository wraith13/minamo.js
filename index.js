"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var minamo;
(function (minamo) {
    var core;
    (function (core) {
        var _this = this;
        core.timeout = function (wait) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, wait); })];
        }); }); };
        core.tryOrThrough = function (title, f) {
            try {
                f();
            }
            catch (err) {
                console.error("\uD83D\uDEAB " + title + ": " + err);
            }
        };
        core.tryOrThroughAsync = function (title, f) {
            return __awaiter(this, void 0, void 0, function () {
                var err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, f()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.error("\uD83D\uDEAB " + title + ": " + err_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        core.simpleDeepCopy = function (source) { return JSON.parse(JSON.stringify(source)); };
        core.recursiveAssign = function (target, source) { return core.objectForEach(source, function (key, value) {
            if ("object" === core.practicalTypeof(value)) {
                if (undefined === target[key]) {
                    target[key] = {};
                }
                core.recursiveAssign(target[key], value);
            }
            else {
                target[key] = value;
            }
        }); };
        core.practicalTypeof = function (obj) {
            if (undefined === obj) {
                return "undefined";
            }
            if (null === obj) {
                return "null";
            }
            if ("[object Array]" === Object.prototype.toString.call(obj)) {
                return "array";
            }
            return typeof obj;
        };
        core.exists = function (i) { return undefined !== i && null !== i; };
        core.existsOrThrow = function (i) {
            if (!core.exists(i)) {
                throw new ReferenceError("existsOrThrow() encountered a unexist value.");
            }
            return i;
        };
        var Url = /** @class */ (function () {
            function Url(url) {
                var _this = this;
                this.url = url;
                this.rawParams = null;
                this.set = function (url) {
                    _this.url = url;
                    _this.rawParams = null;
                    return _this;
                };
                this.getWithoutParams = function () { return core.separate(_this.url, "?").head; };
                this.getRawParamsString = function () { return core.separate(_this.url, "?").tail; };
                this.getRawParams = function () {
                    if (!_this.rawParams) {
                        _this.rawParams = {};
                        _this.getRawParamsString().split("&")
                            .forEach(function (i) {
                            var _a = core.separate(i, "="), head = _a.head, tail = _a.tail;
                            _this.rawParams[head] = tail;
                        });
                    }
                    return _this.rawParams;
                };
                this.getParam = function (key) { return decodeURIComponent(_this.getRawParams()[key]); };
                this.updateParams = function () { return _this.setRawParamsString(core.objectToArray(_this.rawParams, function (k, v) { return core.bond(k, "=", v); })
                    .join("&")); };
                this.setRawParamsString = function (rawParamsString) {
                    _this.url = core.bond(_this.getWithoutParams(), "?", rawParamsString);
                    return _this;
                };
                this.setRawParam = function (key, rawValue) {
                    _this.getRawParams()[key] = rawValue;
                    return _this.updateParams();
                };
                this.setParam = function (key, value) { return _this.setRawParam(key, encodeURIComponent(value)); };
                this.setRawParams = function (params) {
                    _this.rawParams = params;
                    return _this.updateParams();
                };
                this.setParams = function (params) {
                    return _this.setRawParams(core.objectMap(params, function (_key, value) { return encodeURIComponent(value); }));
                };
                this.toString = function () { return _this.url; };
            }
            return Url;
        }());
        core.Url = Url;
        var Listener = /** @class */ (function () {
            function Listener() {
                var _this = this;
                this.members = [];
                this.push = function (member) {
                    _this.members.push(member);
                    return _this;
                };
                this.remove = function (member) {
                    _this.members = _this.members.filter(function (i) { return member !== i; });
                    return _this;
                };
                this.clear = function () {
                    _this.members = [];
                    return _this;
                };
                this.fireAsync = function (value, options) { return __awaiter(_this, void 0, void 0, function () {
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Promise.all(this.members.map(function (i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, i(value, options)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); }))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
            }
            return Listener;
        }());
        core.Listener = Listener;
        ;
        var Property = /** @class */ (function () {
            function Property(updater) {
                var _this = this;
                this.updater = updater;
                this.value = null;
                this.onUpdate = new Listener();
                this.onUpdateOnce = new Listener();
                this.exists = function () { return core.exists(_this.value); };
                this.get = function () { return _this.value; };
                this.setAsync = function (value, options) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(this.value !== value)) return [3 /*break*/, 3];
                                this.value = value;
                                return [4 /*yield*/, this.onUpdate.fireAsync(this, options)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.onUpdateOnce.fireAsync(this, options)];
                            case 2:
                                _a.sent();
                                this.onUpdateOnce.clear();
                                _a.label = 3;
                            case 3: return [2 /*return*/, value];
                        }
                    });
                }); };
                this.updateAsync = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.setAsync;
                            return [4 /*yield*/, this.updater()];
                        case 1: return [4 /*yield*/, _a.apply(this, [_b.sent()])];
                        case 2: return [2 /*return*/, _b.sent()];
                    }
                }); }); };
                this.getOrUpdateAsync = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.exists()) return [3 /*break*/, 1];
                            _a = this.get();
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, this.updateAsync()];
                        case 2:
                            _a = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, _a];
                    }
                }); }); };
            }
            return Property;
        }());
        core.Property = Property;
        core.getOrCall = function (i) {
            return "function" === typeof i ?
                i() :
                i;
        }; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        core.getOrCallAsync = function (i) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!("function" === typeof i)) return [3 /*break*/, 2];
                        return [4 /*yield*/, i()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = i;
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        }); }; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        core.getLast = function (i) { return i[i.length - 1]; };
        core.arrayOrToArray = function (x) { return Array.isArray(x) ? x : [x]; };
        core.singleOrArray = function (x, singleFunction, arrayFunction) { return Array.isArray(x) ? arrayFunction(x) : singleFunction(x); };
        core.flatMap = function (source, mapFunction) {
            var result = [];
            core.arrayOrToArray(source).forEach(function (i) { return result = result.concat(mapFunction(i)); });
            return result;
        };
        core.objectForEach = function (source, eachFunction) {
            Object.keys(source).forEach(function (key) { return eachFunction(key, source[key], source); });
        };
        core.objectMap = function (source, mapFunction) {
            var result = {};
            core.objectForEach(source, function (key) { return result[key] = mapFunction(key, source[key], source); });
            return result;
        };
        core.objectFilter = function (source, filterFunction) {
            var result = {};
            core.objectForEach(source, function (key) {
                var value = source[key];
                if (filterFunction(key, value, source)) {
                    result[key] = value;
                }
            });
            return result;
        };
        core.objectToArray = function (source, mapFunction) {
            var result = [];
            core.objectForEach(source, function (key, value) { return result.push(mapFunction(key, value, source)); });
            return result;
        };
        core.separate = function (text, separator) {
            var index = text.indexOf(separator);
            return 0 <= index ?
                {
                    head: text.substring(0, index),
                    tail: text.substring(index + separator.length),
                } :
                {
                    head: text,
                    tail: null,
                };
        };
        core.bond = function (head, separator, tail) {
            return core.exists(tail) ?
                "" + core.existsOrThrow(head) + core.existsOrThrow(separator) + tail :
                core.existsOrThrow(head);
        };
        core.countMap = function (mapFunction) {
            var result = [];
            var index = 0;
            while (true) {
                var current = mapFunction(index, result);
                if (core.exists(current)) {
                    result.push(current);
                }
                else {
                    break;
                }
            }
            return result;
        };
    })(core = minamo.core || (minamo.core = {}));
    var cookie;
    (function (cookie) {
        cookie.defaultMaxAge = 30 * 24 * 60 * 60;
        var cache = null;
        cookie.setRaw = function (key, value, maxAge) {
            document.cookie = core.exists(maxAge) ?
                key + "=" + value + "; max-age=" + maxAge :
                key + "=" + value;
            cookie.cacheOrUpdate()[key] = value;
            return value;
        };
        cookie.set = function (key, value, maxAge) {
            if (maxAge === void 0) { maxAge = cookie.defaultMaxAge; }
            cookie.set(key, encodeURIComponent(JSON.stringify(value)), maxAge);
            return value;
        };
        cookie.setAsTemporary = function (key, value) { return cookie.set(key, value, null); };
        cookie.setAsDaily = function (key, value) { return cookie.set(key, value, 24 * 60 * 60); };
        cookie.setAsWeekly = function (key, value) { return cookie.set(key, value, 7 * 24 * 60 * 60); };
        cookie.setAsMonthly = function (key, value) { return cookie.set(key, value, 30 * 24 * 60 * 60); };
        cookie.setAsAnnually = function (key, value) { return cookie.set(key, value, 365 * 24 * 60 * 60); };
        cookie.remove = function (key) { return cookie.setRaw(key, null, 0); };
        cookie.update = function () {
            cache = {};
            document.cookie
                .split(";")
                .map(function (i) { return i.trim(); })
                .forEach(function (i) {
                var _a = core.separate(i, "="), head = _a.head, tail = _a.tail;
                cache[head] = tail;
            });
            return cache;
        };
        cookie.cacheOrUpdate = function () { return cache || cookie.update(); };
        cookie.getRaw = function (key) { return cookie.cacheOrUpdate()[key]; };
        cookie.getOrNull = function (key) { return core.exists(cookie.getRaw(key)) ? JSON.parse(decodeURIComponent(cache[key])) : null; };
        var Property = /** @class */ (function (_super) {
            __extends(Property, _super);
            function Property(params) {
                var _this = _super.call(this, params.updater) || this;
                _this.save = function () {
                    cookie.set(core.getOrCall(_this.key), _this.get(), _this.maxAge);
                    return _this;
                };
                _this.loadAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.setAsync(cookie.getOrNull(core.getOrCall(this.key)), { onLoadAsync: true })];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); };
                _this.loadOrUpdateAsync = function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.loadAsync()];
                            case 1:
                                result = _a.sent();
                                if (!!core.exists(result)) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.updateAsync()];
                            case 2:
                                result = _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, result];
                        }
                    });
                }); };
                _this.key = params.key;
                _this.maxAge = params.maxAge;
                return _this;
            }
            return Property;
        }(core.Property));
        cookie.Property = Property;
        var AutoSaveProperty = /** @class */ (function (_super) {
            __extends(AutoSaveProperty, _super);
            function AutoSaveProperty(params) {
                var _this = _super.call(this, params) || this;
                _this.onUpdate.push(function (_value, options) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!options || !options.onLoadAsync) {
                            this.save();
                        }
                        return [2 /*return*/];
                    });
                }); });
                return _this;
            }
            return AutoSaveProperty;
        }(Property));
        cookie.AutoSaveProperty = AutoSaveProperty;
    })(cookie = minamo.cookie || (minamo.cookie = {}));
    var dom;
    (function (dom) {
        dom.make = function (arg) {
            if (arg instanceof Node) {
                return arg;
            }
            if ("string" === core.practicalTypeof(arg)) {
                return document.createTextNode(arg);
            }
            return dom.setToElement(document.createElement(arg.tag), arg);
        };
        dom.setToElement = function (element, arg) {
            core.objectForEach(arg, function (key, value) {
                switch (key) {
                    case "tag":
                    case "parent":
                    case "children":
                    case "attributes":
                    case "eventListener":
                        //  nop
                        break;
                    default:
                        if (undefined !== value) {
                            if ("object" === core.practicalTypeof(value)) {
                                core.recursiveAssign(element[key], value);
                            }
                            else {
                                element[key] = value;
                            }
                        }
                        break;
                }
            });
            if (undefined !== arg.attributes) {
                //  memo: value を持たない attribute を設定したい場合には value として "" を指定すれば良い。
                core.objectForEach(arg.attributes, function (key, value) { return element.setAttribute(key, value); });
            }
            if (undefined !== arg.children) {
                core.arrayOrToArray(arg.children).forEach(function (i) { return element.appendChild(dom.make(i)); });
            }
            if (undefined !== arg.eventListener) {
                core.objectForEach(arg.eventListener, function (key, value) { return element.addEventListener(key, value); });
            }
            if (undefined !== arg.parent) {
                dom.appendChildren(arg.parent, element);
            }
            return element;
        };
        dom.remove = function (node) { return node.parentNode.removeChild(node); };
        dom.removeChildren = function (parent, isRemoveChild) {
            if (isRemoveChild) {
                parent.childNodes.forEach(function (j) {
                    if (isRemoveChild(j)) {
                        dom.remove(j);
                    }
                });
            }
            else {
                parent.innerHTML = "";
            }
            return parent;
        };
        dom.appendChildren = function (parent, newChildren, refChild) {
            core.singleOrArray(newChildren, function (i) { return undefined === refChild ?
                parent.appendChild(dom.make(i)) :
                parent.insertBefore(dom.make(i), refChild); }, function (a) { return a.forEach(function (i) { return dom.appendChildren(parent, i, refChild); }); });
            return parent;
        };
        dom.replaceChildren = function (parent, newChildren, isRemoveChild, refChild) {
            dom.removeChildren(parent, isRemoveChild);
            dom.appendChildren(parent, newChildren, refChild);
            return parent;
        };
    })(dom = minamo.dom || (minamo.dom = {}));
})(minamo = exports.minamo || (exports.minamo = {}));
//# sourceMappingURL=index.js.map