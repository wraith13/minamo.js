import { minamo } from ".";

export module test
{
    interface TestResult
    {
        isSucceeded : boolean;
        testType: string;
        expression : string;
        data? : { };
    }
    const makeResultTable = (result : TestResult[]) =>
    (
        {
            tag : "table",
            children :
            [
                {
                    tag : "tr",
                    children :
                    [
                        {
                            tag : "th",
                            children : "reulst",
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
                result.map
                (
                    i =>
                    (
                        {
                            tag : "tr",
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
            result.error =
            {
                type: typeof error,
                text: error.toString()
            };
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
            testType : "equal",
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
                { tag : "h1", children : "minamo.js test list" },
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
                { tag : "h3", children : "minamo.core.separateAndHead" },
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.separateAndHead("abc@def", "@")`, "abc"),
                        equalTest(`minamo.core.separateAndHead("abc@", "@")`, "abc"),
                        equalTest(`minamo.core.separateAndHead("@def", "@")`, ""),
                        equalTest(`minamo.core.separateAndHead("abc", "@")`, "abc"),
                        equalTest(`minamo.core.separateAndHead("", "@")`, ""),
                        errorTest(`minamo.core.separateAndHead(null, "@")`),
                        equalTest(`minamo.core.separateAndHead("abc@def", null)`, "abc@def"),
                    ]
                ),
                { tag : "h3", children : "minamo.core.separateAndTail" },
                makeResultTable
                (
                    [
                        equalTest(`minamo.core.separateAndTail("abc@def", "@")`, "def"),
                        equalTest(`minamo.core.separateAndTail("abc@", "@")`, ""),
                        equalTest(`minamo.core.separateAndTail("@def", "@")`, "def"),
                        equalTest(`minamo.core.separateAndTail("abc", "@")`, null),
                        equalTest(`minamo.core.separateAndTail("", "@")`, null),
                        errorTest(`minamo.core.separateAndTail(null, "@")`),
                        equalTest(`minamo.core.separateAndTail("abc@def", null)`, null),
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
    };
}
