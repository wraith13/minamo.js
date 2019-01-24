import { minamo } from "..";

export module test
{
    interface TestResult
    {
        isSucceeded : boolean;
        testType: string;
        expression : string;
        data? : { };
    }
    const counts =
    {
        total: 0,
        ok: 0,
        ng: 0,
    };
    const resultCount = (result : TestResult) : TestResult =>
    {
        ++counts.total;
        result.isSucceeded ? ++counts.ok: ++counts.ng;
        return result;
    }
    const makeResultTable = (result : TestResult[]) =>
    (
        {
            tag : "table",
            className : "details",
            children :
            [
                {
                    tag : "tr",
                    children :
                    [
                        {
                            tag : "th",
                            children : "result",
                        },
                        {
                            tag : "th",
                            children : "type",
                        },
                        {
                            tag : "th",
                            children : "expression",
                        },
                        {
                            tag : "th",
                            children : "data",
                        },
                    ],
                },
            ].concat
            (
                result
                    .map(i => resultCount(i))
                    .map
                    (
                        i =>
                        (
                            {
                                tag : "tr",
                                className: i.isSucceeded ? undefined: "error",
                                children :
                                [
                                    {
                                        tag : "td",
                                        children : i.isSucceeded ? "✅ OK": "🚫 NG",
                                    },
                                    {
                                        tag : "td",
                                        children : i.testType,
                                    },
                                    {
                                        tag : "td",
                                        children : i.expression,
                                    },
                                    {
                                        tag : "td",
                                        children : undefined === i ?
                                            "undefined":
                                            JSON.stringify(i.data),
                                    },
                                ]
                            }
                        )
                    )
            )
        }
    )
    export const tryTest = (expression : string) : { isSucceeded : boolean, result : any, error: any } =>
    {
        const result =
        {
            isSucceeded :  false,
            result : undefined,
            error : undefined,
        };
        try
        {
            result.result = eval(expression);
            result.isSucceeded = true;
        }
        catch(error)
        {
            result.error = error instanceof Error ?
            {
                name: error.name,
                message: error.message,
            }:
            error;
        }
        return result;
    }
    export const equalTest = (expression : string, predicted : any) =>
    {
        const result = tryTest(expression);
        return {
            isSucceeded : result.isSucceeded && JSON.stringify(predicted) === JSON.stringify(result.result),
            testType : "equal",
            expression : `${JSON.stringify(predicted)} === ${expression}`,
            data : result.isSucceeded ?
                { predicted, result:result.result, }:
                { predicted, error:result.error, },
        };
    }
    export const errorTest = (expression : string) =>
    {
        const result = tryTest(expression);
        return {
            isSucceeded : !result.isSucceeded,
            testType : "error",
            expression,
            data : result.isSucceeded ?
                { result:result.result, }:
                { error:result.error, },
        };
    }
    export const start = async () : Promise<void> =>
    {
        minamo.dom.appendChildren
        (
            document.body,
            [
                { tag : "h1", children : document.title },
                {
                    tag: "p",
                    children:
                    [
                        "minamo.js is a necessary, sufficient, simple and compact JavaScript/TypeScript library.",
                        { tag: "a", className: "github", href:"https://github.com/wraith13/minamo.js", children: "GitHub", },
                    ],
                },
                { tag : "h2", children : "summary" },
                { tag : "h2", children : "minamo.core" },
                { tag : "h3", children : "minamo.core.exists" },
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.exists("abc")`, true),
                        equalTest(`minamo.core.exists(true)`, true),
                        equalTest(`minamo.core.exists(false)`, true),
                        equalTest(`minamo.core.exists("0")`, true),
                        equalTest(`minamo.core.exists(0)`, true),
                        equalTest(`minamo.core.exists("")`, true),
                        equalTest(`minamo.core.exists(null)`, false),
                        equalTest(`minamo.core.exists(undefined)`, false),
                    ]
                ),
                { tag : "h3", children : "minamo.core.separate" },
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.separate("abc@def", "@")`, { head:"abc", tail:"def" }),
                        equalTest(`minamo.core.separate("abc@", "@")`, { head:"abc", tail:"" }),
                        equalTest(`minamo.core.separate("@def", "@")`, { head:"", tail:"def" }),
                        equalTest(`minamo.core.separate("abc", "@")`, { head:"abc", tail:null }),
                        equalTest(`minamo.core.separate("", "@")`, { head:"", tail:null }),
                        errorTest(`minamo.core.separate(null, "@")`),
                        equalTest(`minamo.core.separate("abc@def", null)`, { head:"abc@def", tail:null }),
                    ]
                ),
                { tag : "h3", children : "minamo.core.bond" },
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.bond("abc", "@", "def")`, "abc@def"),
                        equalTest(`minamo.core.bond("abc", "@", "")`, "abc@"),
                        equalTest(`minamo.core.bond("", "@", "def")`, "@def"),
                        equalTest(`minamo.core.bond("abc", "@", null)`, "abc"),
                        errorTest(`minamo.core.bond(null, null, null)`),
                        errorTest(`minamo.core.bond(null, "@", null)`),
                        errorTest(`minamo.core.bond(null, "@", "def")`),
                        errorTest(`minamo.core.bond("abc", null, "def")`),
                    ]
                ),
            ]
        );
        minamo.dom.appendChildren
        (
            document.body,
            {
                tag : "table",
                className : "summary",
                children :
                [
                    {
                        tag : "tr",
                        children :
                        [
                            {
                                tag : "th",
                                children : "total",
                            },
                            {
                                tag : "th",
                                children : "✅ OK",
                            },
                            {
                                tag : "th",
                                children : "🚫 NG",
                            },
                        ],
                    },
                    {
                        tag : "tr",
                        children :
                        [
                            {
                                tag : "td",
                                children : counts.total.toLocaleString(),
                            },
                            {
                                tag : "td",
                                children : counts.ok.toLocaleString(),
                            },
                            {
                                tag : "td",
                                children : counts.ng.toLocaleString(),
                            },
                        ],
                    },
                ],
            },
            document.getElementsByTagName("h2")[1]
        )
        if (counts.ng)
        {
            document.title = `(${counts.ng}) ${document.title}`
        }
    };
}
