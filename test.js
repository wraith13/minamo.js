"use strict";
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
var _1 = require(".");
var test;
(function (test) {
    var _this = this;
    var makeResultTable = function (result) {
        return ({
            tag: "table",
            children: [
                {
                    tag: "tr",
                    children: [
                        {
                            tag: "th",
                            children: "reulst",
                        },
                        {
                            tag: "th",
                            children: "type",
                        },
                        {
                            tag: "th",
                            children: "expression",
                        },
                        {
                            tag: "th",
                            children: "data",
                        },
                    ],
                },
            ].concat(result.map(function (i) {
                return ({
                    tag: "tr",
                    children: [
                        {
                            tag: "td",
                            children: i.isSucceeded ? "✅ OK" : "🚫 NG",
                        },
                        {
                            tag: "td",
                            children: i.testType,
                        },
                        {
                            tag: "td",
                            children: i.expression,
                        },
                        {
                            tag: "td",
                            children: undefined === i ?
                                "undefined" :
                                JSON.stringify(i.data),
                        },
                    ]
                });
            }))
        });
    };
    test.start = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            _1.minamo.dom.appendChildren(document.body, [
                { tag: "h1", children: "minamo.js test list" },
                { tag: "h2", children: "minamo.core" },
                { tag: "h3", children: "minamo.core.separate" },
                makeResultTable([
                    test.equalTest("minamo.core.separate(\"abc@def\", \"@\")", { head: "abc", tail: "def" }),
                    test.equalTest("minamo.core.separate(\"abc@\", \"@\")", { head: "abc", tail: "" }),
                    test.equalTest("minamo.core.separate(\"@def\", \"@\")", { head: "", tail: "def" }),
                    test.equalTest("minamo.core.separate(\"abc\", \"@\")", { head: "abc", tail: null }),
                    test.equalTest("minamo.core.separate(\"\", \"@\")", { head: "", tail: null }),
                    test.errorTest("minamo.core.separate(null, \"@\")"),
                    test.equalTest("minamo.core.separate(\"abc@def\", null)", { head: "abc@def", tail: null }),
                ]),
                { tag: "h3", children: "minamo.core.separateAndHead" },
                makeResultTable([
                    test.equalTest("minamo.core.separateAndHead(\"abc@def\", \"@\")", "abc"),
                    test.equalTest("minamo.core.separateAndHead(\"abc@\", \"@\")", "abc"),
                    test.equalTest("minamo.core.separateAndHead(\"@def\", \"@\")", ""),
                    test.equalTest("minamo.core.separateAndHead(\"abc\", \"@\")", "abc"),
                    test.equalTest("minamo.core.separateAndHead(\"\", \"@\")", ""),
                    test.errorTest("minamo.core.separateAndHead(null, \"@\")"),
                    test.equalTest("minamo.core.separateAndHead(\"abc@def\", null)", "abc@def"),
                ]),
                { tag: "h3", children: "minamo.core.separateAndTail" },
                makeResultTable([
                    test.equalTest("minamo.core.separateAndTail(\"abc@def\", \"@\")", "def"),
                    test.equalTest("minamo.core.separateAndTail(\"abc@\", \"@\")", ""),
                    test.equalTest("minamo.core.separateAndTail(\"@def\", \"@\")", "def"),
                    test.equalTest("minamo.core.separateAndTail(\"abc\", \"@\")", null),
                    test.equalTest("minamo.core.separateAndTail(\"\", \"@\")", null),
                    test.errorTest("minamo.core.separateAndTail(null, \"@\")"),
                    test.equalTest("minamo.core.separateAndTail(\"abc@def\", null)", null),
                ]),
            ]);
            return [2 /*return*/];
        });
    }); };
    test.equalTest = function (expression, predicted) {
        var result = eval(expression);
        return {
            isSucceeded: JSON.stringify(predicted) === JSON.stringify(result),
            testType: "equal",
            expression: JSON.stringify(predicted) + " === " + expression,
            data: { predicted: predicted, result: result },
        };
    };
    test.errorTest = function (expression) {
        var isSucceeded = false;
        var data = {};
        try {
            data.result = eval(expression);
        }
        catch (error) {
            data.error = error;
            isSucceeded = true;
        }
        return { isSucceeded: isSucceeded, testType: "error", expression: expression, data: data };
    };
})(test = exports.test || (exports.test = {}));
//# sourceMappingURL=test.js.map