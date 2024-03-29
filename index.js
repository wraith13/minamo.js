"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.minamo = void 0;
var minamo;
(function (minamo) {
    var core;
    (function (core_1) {
        var _this = this;
        function undefinedable(target, defaultResult) {
            return function (parameter) { return undefined === parameter ? defaultResult : target(parameter); };
        }
        core_1.undefinedable = undefinedable;
        function nullable(target, defaultResult) {
            return function (parameter) { return null === parameter ? (defaultResult !== null && defaultResult !== void 0 ? defaultResult : null) : target(parameter); };
        }
        core_1.nullable = nullable;
        function nonexistentable(target, defaultResult) {
            return function (parameter) { return undefined === parameter || null === parameter ? defaultResult : target(parameter); };
        }
        core_1.nonexistentable = nonexistentable;
        core_1.jsonStringify = function (source, replacer, space) { return JSON.stringify(source, replacer, space); };
        core_1.extender = function () { return function (x) { return x; }; }; // TypeScript 4.8 以降では satisfies の使用を推奨
        core_1.timeout = function (wait) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, wait); })];
        }); }); };
        var Timer = /** @class */ (function () {
            function Timer(callback, wait) {
                var _this = this;
                this.callback = callback;
                this.wait = wait;
                this.isWaiting = function () { return undefined !== _this.timer; };
                this.clear = function () {
                    if (_this.isWaiting()) {
                        clearTimeout(_this.timer);
                        _this.timer = undefined;
                    }
                };
                this.set = function (wait) {
                    _this.clear();
                    _this.timer = setTimeout(function () {
                        _this.timer = undefined;
                        return _this.callback();
                    }, wait !== null && wait !== void 0 ? wait : _this.wait);
                };
            }
            return Timer;
        }());
        core_1.Timer = Timer;
        core_1.tryOrThrough = function (title, f) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var result;
            try {
                result = f.apply(void 0, args);
            }
            catch (err) {
                console.error("\uD83D\uDEAB ".concat(title, ": ").concat(err));
            }
            return result;
        };
        core_1.tryOrThroughAsync = function (title, f) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var result, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, f.apply(void 0, args)];
                        case 1:
                            result = _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            console.error("\uD83D\uDEAB ".concat(title, ": ").concat(err_1));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/, result];
                    }
                });
            });
        };
        core_1.simpleDeepCopy = function (source) { return JSON.parse(core_1.jsonStringify(source)); };
        core_1.recursiveAssign = function (target, source) { return core_1.objectForEach(source, function (key, value) {
            if ("object" === core_1.practicalTypeof(value)) {
                if (undefined === target[key]) {
                    target[key] = {};
                }
                core_1.recursiveAssign(target[key], value);
            }
            else if ("array" === core_1.practicalTypeof(value)) {
                if (undefined === target[key]) {
                    target[key] = [];
                }
                core_1.recursiveAssign(target[key], value);
            }
            else {
                target[key] = value;
            }
        }); };
        core_1.objectKeys = function (target) { return Object.keys(target); };
        core_1.practicalTypeof = function (obj) {
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
        core_1.exists = function (i) { return undefined !== i && null !== i; };
        core_1.existsOrThrow = function (i) {
            if (!core_1.exists(i)) {
                throw new ReferenceError("minamo.core.existsOrThrow() encountered a unexist value.");
            }
            return i;
        };
        core_1.existFilter = function (list) { return (list.filter(function (i) { return core_1.exists(i); })); };
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
                this.getWithoutParams = function () { return core_1.separate(_this.url, "?").head; };
                this.getRawParamsString = function () { var _a; return (_a = core_1.separate(_this.url, "?").tail) !== null && _a !== void 0 ? _a : ""; };
                this.getRawParams = function () {
                    if (!_this.rawParams) {
                        var params_1 = _this.rawParams = {};
                        _this.getRawParamsString().split("&")
                            .forEach(function (i) {
                            var _a = core.separate(i, "="), head = _a.head, tail = _a.tail;
                            params_1[head] = tail !== null && tail !== void 0 ? tail : "";
                        });
                    }
                    return _this.rawParams;
                };
                this.getParam = function (key) { return decodeURIComponent(_this.getRawParams()[key]); };
                this.updateParams = function () {
                    var _a;
                    return _this.setRawParamsString(core_1.objectToArray((_a = _this.rawParams) !== null && _a !== void 0 ? _a : {}, function (k, v) { return core_1.bond(k, "=", v); })
                        .join("&"));
                };
                this.setRawParamsString = function (rawParamsString) {
                    _this.url = core_1.bond(_this.getWithoutParams(), "?", rawParamsString);
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
                    return _this.setRawParams(core_1.objectMap(params, function (_key, value) { return encodeURIComponent(value); }));
                };
                this.toString = function () { return _this.url; };
            }
            return Url;
        }());
        core_1.Url = Url;
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
        core_1.Listener = Listener;
        var Property = /** @class */ (function () {
            function Property(updater) {
                var _this = this;
                this.updater = updater;
                this.value = null;
                this.onUpdate = new Listener();
                this.onUpdateOnce = new Listener();
                this.exists = function () { return core_1.exists(_this.value); };
                this.get = function () { return _this.value; };
                this.updateAsync = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!this.updater) return [3 /*break*/, 3];
                            _b = this.setAsync;
                            return [4 /*yield*/, this.updater()];
                        case 1: return [4 /*yield*/, _b.apply(this, [_c.sent()])];
                        case 2:
                            _a = _c.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = null;
                            _c.label = 4;
                        case 4: return [2 /*return*/, _a];
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
            Property.prototype.setAsync = function (value, options) {
                return __awaiter(this, void 0, void 0, function () {
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
                });
            };
            return Property;
        }());
        core_1.Property = Property;
        core_1.getOrCall = function (i) {
            return "function" === typeof i ?
                i() :
                i;
        }; // ここのキャストは不要なハズなんだけど TypeScript v3.2.4 のバグなのか、エラーになる。
        core_1.getOrCallAsync = function (i) { return __awaiter(_this, void 0, void 0, function () {
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
        core_1.getLast = function (x) { return Array.isArray(x) ? x[x.length - 1] : x; };
        core_1.arrayOrToArray = function (x) { return Array.isArray(x) ? x : [x]; };
        core_1.singleOrArray = function (x, singleFunction, arrayFunction) { return Array.isArray(x) ? arrayFunction(x) : singleFunction(x); };
        core_1.flatMap = function (source, mapFunction) {
            var result = [];
            core.arrayOrToArray(source).forEach(function (i) { return result = result.concat(mapFunction(i)); });
            return result;
        };
        core_1.objectForEach = function (source, eachFunction) {
            Object.keys(source).forEach(function (key) { return eachFunction(key, source[key], source); });
        };
        core_1.objectMap = function (source, mapFunction) {
            var result = {};
            core_1.objectForEach(source, function (key) { return result[key] = mapFunction(key, source[key], source); });
            return result;
        };
        core_1.objectFilter = function (source, filterFunction) {
            var result = {};
            core_1.objectForEach(source, function (key) {
                var value = source[key];
                if (filterFunction(key, value, source)) {
                    result[key] = value;
                }
            });
            return result;
        };
        core_1.objectToArray = function (source, mapFunction) {
            var result = [];
            core_1.objectForEach(source, function (key, value) { return result.push(mapFunction(key, value, source)); });
            return result;
        };
        core_1.separate = function (text, separator) {
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
        core_1.bond = function (head, separator, tail) {
            return core_1.exists(tail) ?
                "".concat(core_1.existsOrThrow(head)).concat(core_1.existsOrThrow(separator)).concat(tail) :
                core_1.existsOrThrow(head);
        };
        core_1.loopMap = function (mapFunction, limit) {
            var result = [];
            var index = 0;
            if (!core_1.exists(limit)) {
                limit = 100000;
            }
            while (true) {
                if ("number" === typeof limit && limit <= index) {
                    throw new RangeError("minamo.core.loopMap() overs the limit(".concat(limit, ")"));
                }
                var current = mapFunction(index++, result);
                if (core_1.exists(current)) {
                    result.push(current);
                }
                else {
                    break;
                }
            }
            return result;
        };
        core_1.countMap = function (count, mapFunction) {
            var result = [];
            var index = 0;
            while (index < count) {
                result.push("function" === typeof mapFunction ?
                    mapFunction(index, result) :
                    mapFunction);
                ++index;
            }
            return result;
        };
        core_1.zeroPadding = function (length, n) {
            if (21 < length) {
                throw new RangeError("length(".concat(length, ") in minamo.core.zeroPadding() overs 21."));
            }
            if (1e+21 <= n) {
                throw new RangeError("n(".concat(n, ") in minamo.core.zeroPadding() is 1e+21 or more."));
            }
            if (n <= -1e+21) {
                throw new RangeError("n(".concat(n, ") in minamo.core.zeroPadding() is -1e+21 or less."));
            }
            var sign = n < 0 ? "-" : "";
            var core = "".concat(Math.abs(Math.round(n)));
            var paddingLength = length - (sign.length + core.length);
            var padding = 0 < paddingLength ? "00000000000000000000".substr(-paddingLength) : "";
            return "".concat(sign).concat(padding).concat(core);
        };
        core_1.NYI = function (_) {
            if (_ === void 0) { _ = null; }
            throw new Error("Not Yet Implement!");
        };
        var comparer;
        (function (comparer_1) {
            comparer_1.basic = function (a, b) {
                return a < b ? -1 :
                    b < a ? 1 :
                        0;
            };
            comparer_1.reverse = function (comparer) {
                return function (a, b) { return -comparer(a, b); };
            };
            comparer_1.make = function (source) {
                var _a;
                var invoker = function (i) {
                    var f = i;
                    if ("function" === typeof f) {
                        return function (a, b) { return comparer_1.basic(f(a), f(b)); };
                    }
                    var r = i;
                    if (undefined !== (r === null || r === void 0 ? void 0 : r.raw)) {
                        return r.raw;
                    }
                    var s = i;
                    if (undefined !== (s === null || s === void 0 ? void 0 : s.getter)) {
                        var body_1 = function (a, b) { return comparer_1.basic(s.getter(a), s.getter(b)); };
                        if (undefined === s.condition) {
                            return body_1;
                        }
                        else {
                            var f_1 = s.condition;
                            if ("function" === typeof f_1) {
                                return function (a, b) { return f_1(a, b) ? body_1(a, b) : 0; };
                            }
                            else {
                                var t_1 = s.condition;
                                var getter_1 = t_1.getter;
                                if (undefined === getter_1) {
                                    return function (a, b) { return t_1.type === typeof a && t_1.type === typeof b ? body_1(a, b) : 0; };
                                }
                                else {
                                    return function (a, b) { return t_1.type === typeof getter_1(a) && t_1.type === typeof getter_1(b) ? body_1(a, b) : 0; };
                                }
                            }
                        }
                    }
                    return undefined;
                };
                if (Array.isArray(source)) {
                    var comparerList_1 = source.map(invoker).filter(function (i) { return undefined !== i; });
                    return function (a, b) {
                        var result = 0;
                        for (var i = 0; i < comparerList_1.length && 0 === result; ++i) {
                            result = comparerList_1[i](a, b);
                        }
                        return result;
                    };
                }
                else {
                    return (_a = invoker(source)) !== null && _a !== void 0 ? _a : (function () { return 0; });
                }
            };
            comparer_1.lowerCase = comparer_1.make([function (a) { return a.toLowerCase(); }, { raw: comparer_1.basic }]);
        })(comparer = core_1.comparer || (core_1.comparer = {}));
        core_1.parseTimespan = function (timespan) {
            try {
                switch (typeof timespan) {
                    case "number":
                        return timespan;
                    case "string":
                        if (timespan.endsWith("ms")) {
                            return parseFloat(timespan.substring(0, timespan.length - 2).trim());
                        }
                        else if (timespan.endsWith("s")) {
                            return parseFloat(timespan.substring(0, timespan.length - 1).trim()) * 1000;
                        }
                        else if (timespan.endsWith("m")) {
                            return parseFloat(timespan.substring(0, timespan.length - 1).trim()) * 60 * 1000;
                        }
                        else if (timespan.endsWith("h")) {
                            return parseFloat(timespan.substring(0, timespan.length - 1).trim()) * 60 * 60 * 1000;
                        }
                        else if (timespan.endsWith("d")) {
                            return parseFloat(timespan.substring(0, timespan.length - 1).trim()) * 24 * 60 * 60 * 1000;
                        }
                        else if (timespan.endsWith("w")) {
                            return parseFloat(timespan.substring(0, timespan.length - 1).trim()) * 7 * 24 * 60 * 60 * 1000;
                        }
                        else if (timespan.endsWith("y")) {
                            return parseFloat(timespan.substring(0, timespan.length - 1).trim()) * 365.2425 * 24 * 60 * 60 * 1000;
                        }
                        else {
                            return parseInt(timespan.trim());
                        }
                }
            }
            catch (err) {
                console.error(err);
            }
            return null;
        };
        core_1.timespanToString = function (value) {
            if (value < 0) {
                return "-".concat(core_1.timespanToString(-value));
            }
            else {
                var units = [
                    {
                        label: "y",
                        size: 365.2425 * 24 * 60 * 60 * 1000
                    },
                    {
                        label: "d",
                        size: 24 * 60 * 60 * 1000
                    },
                    {
                        label: "h",
                        size: 60 * 60 * 1000
                    },
                    {
                        label: "m",
                        size: 60 * 1000
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
                var i = 0;
                do {
                    var unit = units[i];
                    if (unit.size <= value) {
                        return "".concat(value / unit.size).concat(unit.label);
                    }
                } while (++i < units.length);
                return "".concat(value, "ms");
            }
        };
    })(core = minamo.core || (minamo.core = {}));
    var environment;
    (function (environment) {
        environment.isIE = function () { return core.NYI(false); };
        environment.isEdge = function () { return core.NYI(false); };
        environment.isSafari = function () { return core.NYI(false); };
        environment.isFirefox = function () { return core.NYI(false); };
        environment.isChrome = function () { return core.NYI(false); };
        environment.isPC = function () { return core.NYI(false); };
        environment.isWindows = function () { return core.NYI(false); };
        environment.isMac = function () { return /Macintosh/.test(navigator.userAgent); };
        environment.isiPhone = function () { return /iPhone/.test(navigator.userAgent); };
        environment.isiPad = function () { return /iPad/.test(navigator.userAgent); };
        environment.isApple = function () { return environment.isMac() || environment.isiPhone() || environment.isiPad(); };
        environment.isPWA = function () { return window.matchMedia("(display-mode: standalone)").matches; };
        environment.isLinux = function () { return core.NYI(false); };
        environment.isiAndroid = function () { return core.NYI(false); };
    })(environment = minamo.environment || (minamo.environment = {}));
    var cookie;
    (function (cookie) {
        cookie.defaultMaxAge = 30 * 24 * 60 * 60;
        var cache = null;
        cookie.setRaw = function (key, value, maxAge) {
            document.cookie = core.exists(maxAge) ?
                "".concat(key, "=").concat(value, "; max-age=").concat(maxAge) :
                "".concat(key, "=").concat(value);
            cookie.cacheOrUpdate()[key] = value;
            return value;
        };
        cookie.set = function (key, value, maxAge) {
            if (maxAge === void 0) { maxAge = cookie.defaultMaxAge; }
            cookie.setRaw(key, encodeURIComponent(core.jsonStringify(value)), maxAge);
            return value;
        };
        cookie.setAsTemporary = function (key, value) { return cookie.set(key, value, null); };
        cookie.setAsDaily = function (key, value) { return cookie.set(key, value, 24 * 60 * 60); };
        cookie.setAsWeekly = function (key, value) { return cookie.set(key, value, 7 * 24 * 60 * 60); };
        cookie.setAsMonthly = function (key, value) { return cookie.set(key, value, 30 * 24 * 60 * 60); };
        cookie.setAsAnnually = function (key, value) { return cookie.set(key, value, 365 * 24 * 60 * 60); };
        cookie.remove = function (key) { return cookie.setRaw(key, null, 0); };
        cookie.update = function () {
            var result = cache = {};
            document.cookie
                .split(";")
                .map(function (i) { return i.trim(); })
                .forEach(function (i) {
                var _a = core.separate(i, "="), head = _a.head, tail = _a.tail;
                result[head] = tail !== null && tail !== void 0 ? tail : "";
            });
            return result;
        };
        cookie.cacheOrUpdate = function () { return cache !== null && cache !== void 0 ? cache : cookie.update(); };
        cookie.getRaw = function (key) { return cookie.cacheOrUpdate()[key]; };
        cookie.getOrNull = function (key) {
            var rawValue = cookie.getRaw(key);
            return core.exists(rawValue) ? JSON.parse(decodeURIComponent(rawValue)) : null;
        };
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
    var localStorage;
    (function (localStorage) {
        localStorage.setRaw = function (key, value) {
            window.localStorage.setItem(key, value);
            return value;
        };
        /**
         * @deprecated User `set2()` instead.
         */
        localStorage.set = function (key, value) {
            localStorage.setRaw(key, encodeURIComponent(core.jsonStringify(value)));
            return value;
        };
        localStorage.set2 = function (key, value) {
            localStorage.setRaw(key, core.jsonStringify(value));
            return value;
        };
        localStorage.remove = function (key) { return window.localStorage.removeItem(key); };
        localStorage.getRaw = function (key) { return window.localStorage.getItem(key); };
        /**
         * @deprecated User `getOrNull2()` instead.
         */
        localStorage.getOrNull = function (key) {
            var rawValue = localStorage.getRaw(key);
            return core.exists(rawValue) ? JSON.parse(decodeURIComponent(rawValue)) : null;
        };
        localStorage.getOrNull2 = function (key) {
            var rawValue = localStorage.getRaw(key);
            return core.exists(rawValue) ? JSON.parse(rawValue) : null;
        };
        /**
         * @deprecated
         */
        var Property = /** @class */ (function (_super) {
            __extends(Property, _super); // 非推奨
            function Property(params) {
                var _this = _super.call(this, params.updater) || this;
                _this.save = function () {
                    cookie.set(core.getOrCall(_this.key), _this.get());
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
                return _this;
            }
            return Property;
        }(core.Property));
        localStorage.Property = Property;
        /**
         * @deprecated
         */
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
        localStorage.AutoSaveProperty = AutoSaveProperty;
    })(localStorage = minamo.localStorage || (minamo.localStorage = {}));
    var sessionStorage;
    (function (sessionStorage) {
        sessionStorage.setRaw = function (key, value) {
            window.sessionStorage.setItem(key, value);
            return value;
        };
        /**
         * @deprecated User `set2()` instead.
         */
        sessionStorage.set = function (key, value) {
            sessionStorage.setRaw(key, encodeURIComponent(core.jsonStringify(value)));
            return value;
        };
        sessionStorage.set2 = function (key, value) {
            sessionStorage.setRaw(key, core.jsonStringify(value));
            return value;
        };
        sessionStorage.remove = function (key) { return window.sessionStorage.removeItem(key); };
        sessionStorage.getRaw = function (key) { return window.sessionStorage.getItem(key); };
        /**
         * @deprecated User `getOrNull2()` instead.
         */
        sessionStorage.getOrNull = function (key) {
            var rawValue = sessionStorage.getRaw(key);
            return core.exists(rawValue) ? JSON.parse(decodeURIComponent(rawValue)) : null;
        };
        sessionStorage.getOrNull2 = function (key) {
            var rawValue = sessionStorage.getRaw(key);
            return core.exists(rawValue) ? JSON.parse(rawValue) : null;
        };
        /**
         * @deprecated
         */
        var Property = /** @class */ (function (_super) {
            __extends(Property, _super);
            function Property(params) {
                var _this = _super.call(this, params.updater) || this;
                _this.save = function () {
                    cookie.set(core.getOrCall(_this.key), _this.get());
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
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.loadAsync()];
                            case 1:
                                result = _b.sent();
                                if (!!core.exists(result)) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.updateAsync()];
                            case 2:
                                result = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : result;
                                _b.label = 3;
                            case 3: return [2 /*return*/, result];
                        }
                    });
                }); };
                _this.key = params.key;
                return _this;
            }
            return Property;
        }(core.Property));
        sessionStorage.Property = Property;
        /**
         * @deprecated
         */
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
        sessionStorage.AutoSaveProperty = AutoSaveProperty;
    })(sessionStorage = minamo.sessionStorage || (minamo.sessionStorage = {}));
    var http;
    (function (http) {
        var _this = this;
        http.request = function (method, url, body, headers) { return new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open(method, url, true);
            if (headers) {
                console.log("headers: ".concat(core.jsonStringify(headers)));
                Object.keys(headers).forEach(function (key) { return request.setRequestHeader(key, headers[key]); });
            }
            request.onreadystatechange = function () {
                if (4 === request.readyState) {
                    if (200 <= request.status && request.status < 300) {
                        resolve(request.responseText);
                    }
                    else {
                        reject({
                            url: url,
                            request: request
                        });
                    }
                }
            };
            console.log("body: ".concat(JSON.stringify(body)));
            request.send(body); // VS Code エディター上で異なる ES バージョンでコンパイルされエラー表示されてしまう問題回避の為の any
        }); };
        http.get = function (url, headers) { return http.request("GET", url, undefined, headers); };
        http.post = function (url, body, headers) { return http.request("POST", url, body, headers); };
        http.getJson = function (url, headers) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, http.get(url, headers)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        }); }); };
        http.postJson = function (url, body, headers) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, http.post(url, body, headers)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        }); }); };
    })(http = minamo.http || (minamo.http = {}));
    var file;
    (function (file_1) {
        file_1.readAsText = function (file) { return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () { return resolve(reader.result); };
            reader.onerror = function () { return reject(reader.error); };
            reader.readAsText(file);
        }); };
    })(file = minamo.file || (minamo.file = {}));
    var dom;
    (function (dom) {
        function get(parent, queryOrElement) {
            if (undefined === queryOrElement) {
                return get(document, parent);
            }
            if ("string" === typeof parent) {
                return get(get(document, parent), queryOrElement);
            }
            if ("string" === typeof queryOrElement) {
                return parent.querySelector(queryOrElement);
            }
            return queryOrElement;
        }
        dom.get = get;
        function getAll(parent, queryOrElement) {
            if (undefined === queryOrElement) {
                return getAll(document, parent);
            }
            if ("string" === typeof parent) {
                return getAll(get(document, parent), queryOrElement);
            }
            if ("string" === typeof queryOrElement) {
                return Array.from(parent.querySelectorAll(queryOrElement));
            }
            return queryOrElement;
        }
        dom.getAll = getAll;
        function make(arg, level) {
            core.existsOrThrow(arg);
            if (arg instanceof Node) {
                return arg;
            }
            if ("string" === core.practicalTypeof(arg)) {
                return document.createTextNode(arg);
            }
            if (arg.prototype) {
                var tag_1 = arg.name.replace(/HTML(.*)Element/, "$1".toLowerCase());
                switch (tag_1) {
                    case "anchor":
                        tag_1 = "a";
                        break;
                    case "heading":
                        tag_1 = "h".concat(level);
                        break;
                    case "dlist":
                        tag_1 = "dl";
                        break;
                    case "olist":
                        tag_1 = "ol";
                        break;
                    case "ulist":
                        tag_1 = "ol";
                        break;
                }
                return function (arg2) { return dom.set(document.createElement(tag_1), arg2); };
            }
            if (arg.outerHTML) {
                return make(HTMLDivElement)({ innerHTML: arg.outerHTML }).firstChild;
            }
            return dom.set(document.createElement(arg.tag), arg);
        }
        dom.make = make;
        dom.tag = function (tag) { return function (className) { return function (children) {
            return "string" === typeof className ?
                {
                    tag: tag,
                    children: children,
                    className: className,
                } :
                Object.assign({
                    tag: tag,
                    children: children,
                }, className);
        }; }; };
        dom.set = function (element, arg) {
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
                core.arrayOrToArray(arg.children).forEach(function (i) { return core.arrayOrToArray(i).forEach(function (j) { return element.appendChild(make(j)); }); });
            }
            if (undefined !== arg.eventListener) {
                core.objectForEach(arg.eventListener, function (key, value) { return element.addEventListener(key, value); });
            }
            if (undefined !== arg.parent) {
                dom.appendChildren(arg.parent, element);
            }
            return element;
        };
        dom.remove = function (node) { var _a, _b; return (_b = (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(node)) !== null && _b !== void 0 ? _b : node; };
        dom.removeChildren = function (parent, isRemoveChild) {
            if (isRemoveChild) {
                parent.childNodes.forEach(function (i) {
                    if (isRemoveChild(i)) {
                        parent.removeChild(i);
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
                parent.appendChild(make(i)) :
                parent.insertBefore(make(i), refChild); }, function (a) { return a.forEach(function (i) { return dom.appendChildren(parent, i, refChild); }); });
            return parent;
        };
        dom.replaceChildren = function (parent, newChildren, isRemoveChild, refChild) {
            dom.removeChildren(parent, isRemoveChild);
            dom.appendChildren(parent, newChildren, refChild);
            return parent;
        };
        dom.getElementsByClassName = function (parent, className) {
            return Array.from(parent.getElementsByClassName(className));
        };
        dom.getDivsByClassName = function (parent, className) {
            return dom.getElementsByClassName(parent, className);
        };
        dom.getSpansByClassName = function (parent, className) {
            return dom.getElementsByClassName(parent, className);
        };
        dom.getButtonsByClassName = function (parent, className) {
            return dom.getElementsByClassName(parent, className);
        };
        dom.getChildNodes = function (parent) {
            return Array.from(parent.childNodes);
        };
        dom.setProperty = function (objectOrQuery, key, value) {
            var element = get(objectOrQuery);
            var isUpdate = value !== element[key];
            if (isUpdate) {
                if (undefined === value && element instanceof CSSStyleDeclaration) {
                    element.removeProperty(key);
                }
                else {
                    element[key] = value;
                }
            }
            var result = {
                object: element,
                key: key,
                value: value,
                isUpdate: isUpdate,
            };
            return result;
        };
        dom.setProperties = function (objectOrQuery, data) {
            return core.objectKeys(data).map(function (key) { return dom.setProperty(objectOrQuery, key, data[key]); });
        };
        dom.removeCSSStyleProperty = function (object, key) {
            var isUpdate = undefined !== object[key];
            if (isUpdate) {
                object.removeProperty(key);
            }
            var result = {
                object: object,
                key: key,
                isUpdate: isUpdate,
            };
            return result;
        };
        dom.setStyleProperty = function (object, key, value) {
            return dom.setProperty(get(object).style, key, value !== null && value !== void 0 ? value : "");
        };
        dom.addCSSClass = function (element, className) {
            var isUpdate = !element.classList.contains(className);
            if (isUpdate) {
                element.classList.add(className);
            }
            var result = {
                element: element,
                className: className,
                isUpdate: isUpdate,
            };
            return result;
        };
        dom.removeCSSClass = function (element, className) {
            var isUpdate = element.classList.contains(className);
            if (isUpdate) {
                element.classList.remove(className);
            }
            var result = {
                element: element,
                className: className,
                isUpdate: isUpdate,
            };
            return result;
        };
        dom.toggleCSSClass = function (element, className, toggle) {
            return toggle ?
                dom.addCSSClass(element, className) :
                dom.removeCSSClass(element, className);
        };
    })(dom = minamo.dom || (minamo.dom = {}));
})(minamo || (exports.minamo = minamo = {}));
//# sourceMappingURL=index.js.map