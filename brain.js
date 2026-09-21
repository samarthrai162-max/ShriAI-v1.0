// ============================================================
// SHRI AI OS
// BRAIN.JS
// MAIN INTELLIGENCE ROUTER
// V5.0 PROFESSIONAL CALCULATOR + MEMORY ROUTER
//
// PRESERVED:
// - Personal Memory
// - Dynamic Memory
// - Relationship Memory
// - Name Memory
// - Greetings
// - Identity
// - AI Name
// - Time
// - Date
// - Mood System
// - Thank You
//
// ADDED / FIXED:
// - Natural speaking calculator
// - × multiplication symbol support
// - * multiplication support
// - "multiplied by"
// - "multiply by"
// - "times"
// - "into"
// - "guna"
// - "divide by"
// - "divided by"
// - "bhaag"
// - plus / minus
// - brackets / parentheses
// - percentage
// - percent of
// - "100 ka 25 percent"
// - "100 ka 25%"
// - modulo / remainder
// - powers
// - square
// - square root
// - ^ operator
// - Hindi / Hinglish math
// - safer calculation parsing
// ============================================================


// ============================================================
// TIME
// ============================================================

function getTime() {

    return new Date().toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );
}


// ============================================================
// DATE
// ============================================================

function getDate() {

    return new Date().toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


// ============================================================
// USER NAME
// ============================================================

function getSafeBrainUserName() {

    try {

        if (
            typeof getSafeUserName ===
            "function"
        ) {

            return getSafeUserName();
        }

    } catch (error) {

        console.error(
            "Username read error:",
            error
        );
    }

    return null;
}


// ============================================================
// GREETING
// ============================================================

function getGreeting() {

    const hour =
        new Date().getHours();

    const userName =
        getSafeBrainUserName();

    let greeting;

    if (hour < 12) {

        greeting =
            "🌞 Good Morning";

    } else if (hour < 17) {

        greeting =
            "☀️ Good Afternoon";

    } else {

        greeting =
            "🌙 Good Evening";
    }

    if (userName) {

        return `${greeting}, ${userName}!`;
    }

    return `${greeting}!`;
}


// ============================================================
// NUMBER WORDS
// ============================================================

const SHRI_NUMBER_WORDS = {

    // English
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
    "thirty": 30,
    "forty": 40,
    "fifty": 50,
    "sixty": 60,
    "seventy": 70,
    "eighty": 80,
    "ninety": 90,

    // Hindi
    "shunya": 0,
    "ek": 1,
    "do": 2,
    "teen": 3,
    "char": 4,
    "chaar": 4,
    "paanch": 5,
    "panch": 5,
    "cheh": 6,
    "chhe": 6,
    "saat": 7,
    "aath": 8,
    "nau": 9,
    "das": 10,
    "gyarah": 11,
    "barah": 12,
    "terah": 13,
    "chaudah": 14,
    "pandrah": 15,
    "solah": 16,
    "satrah": 17,
    "atharah": 18,
    "unnis": 19,
    "bees": 20,
    "tees": 30,
    "chalis": 40,
    "chaalis": 40,
    "pachaas": 50,
    "saath": 60,
    "sattar": 70,
    "assi": 80,
    "nabbe": 90
};


// ============================================================
// REPLACE NUMBER WORDS
// ============================================================

function replaceNumberWords(text) {

    let result =
        String(text);

    const sortedWords =
        Object.keys(
            SHRI_NUMBER_WORDS
        ).sort(
            (a, b) =>
                b.length - a.length
        );

    for (
        const word of sortedWords
    ) {

        const value =
            SHRI_NUMBER_WORDS[word];

        const pattern =
            new RegExp(
                `\\b${word}\\b`,
                "gi"
            );

        result =
            result.replace(
                pattern,
                String(value)
            );
    }

    return result;
}


// ============================================================
// NORMALIZE CALCULATOR TEXT
// ============================================================

function normalizeCalculatorText(text) {

    if (!text) {
        return "";
    }

    let cleaned =
        String(text)
            .toLowerCase()
            .trim();


    // --------------------------------------------------------
    // Speech recognition symbol variations
    // --------------------------------------------------------

    cleaned =
        cleaned

            // multiplication symbols
            .replace(/[×✕✖]/g, "*")

            // division symbols
            .replace(/[÷]/g, "/")

            // minus variations
            .replace(/[−–—]/g, "-")

            // equals
            .replace(/=/g, " ");


    // --------------------------------------------------------
    // Common speech variations
    // --------------------------------------------------------

    cleaned =
        cleaned

            .replace(/what's/g, "what is")
            .replace(/whats/g, "what is")

            // square root
            .replace(
                /square\s+root\s+of/g,
                "sqrt"
            )

            .replace(
                /square\s+root/g,
                "sqrt"
            )

            .replace(
                /squareroot/g,
                "sqrt"
            )

            .replace(
                /sq\s+root/g,
                "sqrt"
            )

            // powers
            .replace(
                /to\s+the\s+power\s+of/g,
                "power"
            )

            .replace(
                /raised\s+to\s+the\s+power\s+of/g,
                "power"
            )

            .replace(
                /raised\s+to/g,
                "power"
            )

            .replace(
                /power\s+of/g,
                "power"
            )

            // percentage
            .replace(
                /percentage\s+of/g,
                "percent of"
            )

            .replace(
                /percentage/g,
                "percent"
            )

            // modulo
            .replace(
                /remainder/g,
                "mod"
            )

            .replace(
                /modulo/g,
                "mod"
            )

            // division
            .replace(
                /divided\s+by/g,
                "divide"
            )

            .replace(
                /divide\s+by/g,
                "divide"
            )
// multiplication

.replace(
    /\bmultiplied\s+by\b/g,
    "multiply"
)

.replace(
    /\bmultiplied\b/g,
    "multiply"
)

.replace(
    /\bmultiply\s+by\b/g,
    "multiply"
)

.replace(
    /\btimes\b/g,
    "multiply"
)

.replace(
    /\binto\b/g,
    "multiply"
)            

            // division Hindi
            .replace(
                /bhaag/g,
                "divide"
            )

            .replace(
                /भाग/g,
                "divide"
            )

            // addition
            .replace(
                /jod/g,
                "plus"
            )

            .replace(
                /जोड़/g,
                "plus"
            )

            // subtraction
            .replace(
                /ghata/g,
                "minus"
            )

            .replace(
                /घटा/g,
                "minus"
            );


    // --------------------------------------------------------
    // Number words
    // --------------------------------------------------------

    cleaned =
        replaceNumberWords(
            cleaned
        );


    // --------------------------------------------------------
    // Normalize spaces
    // --------------------------------------------------------

    return cleaned
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// FORMAT RESULT
// ============================================================

function formatCalculatorResult(result) {

    if (
        typeof result !== "number" ||
        !Number.isFinite(result)
    ) {

        return null;
    }


    // Remove floating-point noise

    const rounded =
        Math.round(
            (
                result +
                Number.EPSILON
            ) *
            100000000
        ) /
        100000000;


    return rounded;
}


// ============================================================
// REMOVE CONVERSATIONAL WORDS
// ============================================================

function removeCalculatorConversation(
    text
) {

    return text

        .replace(
            /\bwhat\s+is\b/g,
            ""
        )

        .replace(
            /\bcalculate\b/g,
            ""
        )

        .replace(
            /\bplease\b/g,
            ""
        )

        .replace(
            /\btell\s+me\b/g,
            ""
        )

        .replace(
            /\banswer\b/g,
            ""
        )

        .replace(
            /\bbatao\b/g,
            ""
        )

        .replace(
            /\bbtao\b/g,
            ""
        )

        .replace(
            /\bkitna\s+hota\s+hai\b/g,
            ""
        )

        .replace(
            /\bkitna\s+hai\b/g,
            ""
        )

        .replace(
            /\bkitne\s+hote\s+hain\b/g,
            ""
        )

        .replace(
            /\bka\s+jawab\b/g,
            ""
        )

        .replace(
            /\bka\s+answer\b/g,
            ""
        )

        .replace(
            /\bhai\b/g,
            ""
        )

        .replace(
            /\bhoga\b/g,
            ""
        )

        .replace(
            /\bhogi\b/g,
            ""
        )

        .replace(
            /\bhote\s+hain\b/g,
            ""
        )

        .replace(
            /\bhota\s+hai\b/g,
            ""
        )

        .replace(
            /\bplease\b/g,
            ""
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();
}


// ============================================================
// BASIC SYMBOL EXPRESSION
// ============================================================

function calculateBasicExpression(
    expression
) {

    if (!expression) {
        return null;
    }


    let cleaned =
        normalizeCalculatorText(
            expression
        );


    cleaned =
        removeCalculatorConversation(
            cleaned
        );


    // --------------------------------------------------------
    // Convert spoken operators
    // --------------------------------------------------------

    cleaned =
        cleaned

            .replace(
                /\bplus\b/g,
                "+"
            )

            .replace(
                /\badd\b/g,
                "+"
            )

            .replace(
                /\bminus\b/g,
                "-"
            )

            .replace(
                /\bsubtract\b/g,
                "-"
            )

            .replace(
                /\bmultiply\b/g,
                "*"
            )

            .replace(
                /\bdivide\b/g,
                "/"
            )

            .replace(
                /\bmod\b/g,
                "%"
            );


    // --------------------------------------------------------
    // IMPORTANT:
    // Keep brackets and operators.
    // --------------------------------------------------------

    cleaned =
        cleaned
            .replace(
                /[^0-9+\-*/().%\s]/g,
                ""
            )
            .trim();


    if (
        !cleaned ||
        !/\d/.test(cleaned) ||
        !/[+\-*/%]/.test(cleaned)
    ) {

        return null;
    }


    // --------------------------------------------------------
    // Safety checks
    // --------------------------------------------------------

    if (
        /\/\s*0(?:\D|$)/.test(
            cleaned
        )
    ) {

        return null;
    }


    try {

        const result =
            Function(
                `"use strict"; return (${cleaned})`
            )();


        return formatCalculatorResult(
            result
        );

    } catch (error) {

        console.error(
            "Basic calculator error:",
            error
        );

        return null;
    }
}


// ============================================================
// SQUARE
// ============================================================

function calculateSquare(text) {

    const t =
        normalizeCalculatorText(
            text
        );


    const cleaned =
        removeCalculatorConversation(
            t
        );


    let match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s+ka\s+square$/
        );


    if (!match) {

        match =
            cleaned.match(
                /^square\s+(-?\d+(?:\.\d+)?)$/
            );
    }


    if (!match) {

        match =
            cleaned.match(
                /^(-?\d+(?:\.\d+)?)\s+square$/
            );
    }


    if (!match) {
        return null;
    }


    const number =
        Number(match[1]);


    if (
        !Number.isFinite(number)
    ) {

        return null;
    }


    return formatCalculatorResult(
        number * number
    );
}


// ============================================================
// SQUARE ROOT
// ============================================================

function calculateSquareRoot(text) {

    const t =
        normalizeCalculatorText(
            text
        );


    const cleaned =
        removeCalculatorConversation(
            t
        );


    let match =
        cleaned.match(
            /^sqrt\s+(-?\d+(?:\.\d+)?)$/
        );


    if (!match) {

        match =
            cleaned.match(
                /^(-?\d+(?:\.\d+)?)\s+ka\s+sqrt$/
            );
    }


    if (!match) {

        match =
            cleaned.match(
                /^square\s+root\s+(-?\d+(?:\.\d+)?)$/
            );
    }


    if (!match) {
        return null;
    }


    const number =
        Number(match[1]);


    if (
        !Number.isFinite(number) ||
        number < 0
    ) {

        return null;
    }


    return formatCalculatorResult(
        Math.sqrt(number)
    );
}


// ============================================================
// POWER
// ============================================================

function calculatePower(text) {

    const t =
        normalizeCalculatorText(
            text
        );


    const cleaned =
        removeCalculatorConversation(
            t
        );


    let match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s+power\s+(-?\d+(?:\.\d+)?)$/
        );


    if (!match) {

        match =
            cleaned.match(
                /(-?\d+(?:\.\d+)?)\s*\^\s*(-?\d+(?:\.\d+)?)/ 
            );
    }


    if (!match) {
        return null;
    }


    const base =
        Number(match[1]);

    const exponent =
        Number(match[2]);


    if (
        !Number.isFinite(base) ||
        !Number.isFinite(exponent)
    ) {

        return null;
    }


    return formatCalculatorResult(
        Math.pow(
            base,
            exponent
        )
    );
}


// ============================================================
// PERCENTAGE
// ============================================================

function calculatePercentage(text) {

    const t =
        normalizeCalculatorText(
            text
        );


    const cleaned =
        removeCalculatorConversation(
            t
        );


    // ========================================================
    // TYPE 1
    // 100 ka 25 percent
    // 100 ka 25%
    // ========================================================

    let match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s+ka\s+(-?\d+(?:\.\d+)?)\s*(?:percent|%)$/
        );


    if (match) {

        const number =
            Number(match[1]);

        const percentage =
            Number(match[2]);


        return formatCalculatorResult(
            number *
            percentage /
            100
        );
    }


    // ========================================================
    // TYPE 2
    // 25 percent of 100
    // 25% of 100
    // ========================================================

    match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s*(?:percent|%)\s+of\s+(-?\d+(?:\.\d+)?)$/
        );


    if (match) {

        const percentage =
            Number(match[1]);

        const number =
            Number(match[2]);


        return formatCalculatorResult(
            number *
            percentage /
            100
        );
    }


    // ========================================================
    // TYPE 3
    // 100 ka 25 percent + extra words
    // ========================================================

    match =
        cleaned.match(
            /(-?\d+(?:\.\d+)?)\s+ka\s+(-?\d+(?:\.\d+)?)\s*(?:percent|%)/ 
        );


    if (match) {

        const number =
            Number(match[1]);

        const percentage =
            Number(match[2]);


        return formatCalculatorResult(
            number *
            percentage /
            100
        );
    }


    // ========================================================
    // TYPE 4
    // 25 percent of 100 + extra words
    // ========================================================

    match =
        cleaned.match(
            /(-?\d+(?:\.\d+)?)\s*(?:percent|%)\s+of\s+(-?\d+(?:\.\d+)?)/ 
        );


    if (match) {

        const percentage =
            Number(match[1]);

        const number =
            Number(match[2]);


        return formatCalculatorResult(
            number *
            percentage /
            100
        );
    }


    return null;
}


// ============================================================
// SPEECH ARITHMETIC
// ============================================================

function calculateSpeechArithmetic(
    text
) {

    const t =
        normalizeCalculatorText(
            text
        );


    const cleaned =
        removeCalculatorConversation(
            t
        );


    // ========================================================
    // PLUS
    // ========================================================

    let match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s+plus\s+(-?\d+(?:\.\d+)?)$/
        );


    if (match) {

        return formatCalculatorResult(
            Number(match[1]) +
            Number(match[2])
        );
    }


    // ========================================================
    // MINUS
    // ========================================================

    match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s+minus\s+(-?\d+(?:\.\d+)?)$/
        );


    if (match) {

        return formatCalculatorResult(
            Number(match[1]) -
            Number(match[2])
        );
    }


    // ========================================================
    // MULTIPLY
    // ========================================================

// MULTIPLY

match =
    cleaned.match(
        /(-?\d+(?:\.\d+)?)\s*(?:multiply|\*)\s*(-?\d+(?:\.\d+)?)/
    );

    if (match) {

        return formatCalculatorResult(
            Number(match[1]) *
            Number(match[2])
        );
    }


    // ========================================================
    // DIVIDE
    // ========================================================

    match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s+divide\s+(-?\d+(?:\.\d+)?)$/
        );


    if (match) {

        const a =
            Number(match[1]);

        const b =
            Number(match[2]);


        if (b === 0) {
            return null;
        }


        return formatCalculatorResult(
            a / b
        );
    }


    // ========================================================
    // MOD
    // ========================================================

    match =
        cleaned.match(
            /^(-?\d+(?:\.\d+)?)\s+mod\s+(-?\d+(?:\.\d+)?)$/
        );


    if (match) {

        const a =
            Number(match[1]);

        const b =
            Number(match[2]);


        if (b === 0) {
            return null;
        }


        return formatCalculatorResult(
            a % b
        );
    }


    return null;
}


// ============================================================
// SMART CALCULATOR
// ============================================================

function calculateExpression(
    expression
) {

    if (!expression) {
        return null;
    }


    const original =
        String(expression).trim();


    // --------------------------------------------------------
    // Percentage FIRST
    // --------------------------------------------------------

    let result =
        calculatePercentage(
            original
        );


    if (result !== null) {
        return result;
    }


    // --------------------------------------------------------
    // Square root
    // --------------------------------------------------------

    result =
        calculateSquareRoot(
            original
        );


    if (result !== null) {
        return result;
    }


    // --------------------------------------------------------
    // Square
    // --------------------------------------------------------

    result =
        calculateSquare(
            original
        );


    if (result !== null) {
        return result;
    }


    // --------------------------------------------------------
    // Power
    // --------------------------------------------------------

    result =
        calculatePower(
            original
        );


    if (result !== null) {
        return result;
    }


    // --------------------------------------------------------
    // Speech arithmetic
    // --------------------------------------------------------

    result =
        calculateSpeechArithmetic(
            original
        );


    if (result !== null) {
        return result;
    }


    // --------------------------------------------------------
    // Basic expression
    // --------------------------------------------------------

    result =
        calculateBasicExpression(
            original
        );


    if (result !== null) {
        return result;
    }


    return null;
}


// ============================================================
// CALCULATOR INTENT DETECTION
// ============================================================

function looksLikeCalculation(
    text
) {

    if (!text) {
        return false;
    }


    const t =
        normalizeCalculatorText(
            text
        );


    // ========================================================
    // Explicit math words
    // ========================================================

    if (
        /\bcalculate\b/.test(t) ||
        /\bplus\b/.test(t) ||
        /\bminus\b/.test(t) ||
        /\bmultiply\b/.test(t) ||
        /\bdivide\b/.test(t) ||
        /\bmod\b/.test(t) ||
        /\bpower\b/.test(t) ||
        /\bsquare\b/.test(t) ||
        /\bsqrt\b/.test(t) ||
        /\bpercent\b/.test(t) ||
        /\bpercentage\b/.test(t)
    ) {

        return true;
    }


    // ========================================================
    // Mathematical symbols
    // ========================================================

    if (
        /[0-9]\s*[+\-*/%×÷^]\s*[0-9]/.test(
            t
        )
    ) {

        return true;
    }


    // ========================================================
    // Brackets
    // ========================================================

    if (
        /\([^)]+\)/.test(t) &&
        /\d/.test(t)
    ) {

        return true;
    }


    // ========================================================
    // "ka" percentage / calculation
    // ========================================================

    if (
        /\d+(?:\.\d+)?\s+ka\s+\d+(?:\.\d+)?\s*(?:percent|%|square|sqrt)/.test(
            t
        )
    ) {

        return true;
    }


    // ========================================================
    // Number + ka + math
    // ========================================================

    if (
        /\d+(?:\.\d+)?\s+ka\s+\d+(?:\.\d+)?\s+/.test(
            t
        )
    ) {

        return true;
    }


    return false;
}


// ============================================================
// CALCULATOR RESPONSE
// ============================================================

function getCalculatorResponse(
    original,
    result
) {

    const t =
        normalizeCalculatorText(
            original
        );


    // ========================================================
    // SQUARE ROOT
    // ========================================================

    if (
        /\bsqrt\b/.test(t) ||
        /\bsquare\s+root\b/.test(t)
    ) {

        return `The square root is ${result}.`;
    }


    // ========================================================
    // SQUARE
    // ========================================================

    if (
        /\bsquare\b/.test(t)
    ) {

        return `The square is ${result}.`;
    }


    // ========================================================
    // POWER
    // ========================================================

    if (
        /\bpower\b/.test(t) ||
        /\^/.test(t)
    ) {

        return `The answer is ${result}.`;
    }


    // ========================================================
    // PERCENTAGE
    // ========================================================

    if (
        /\bpercent\b/.test(t) ||
        /%/.test(t)
    ) {

        return `The answer is ${result}.`;
    }


    // ========================================================
    // MOD
    // ========================================================

    if (
        /\bmod\b/.test(t) ||
        /\bremainder\b/.test(t)
    ) {

        return `The remainder is ${result}.`;
    }


    // ========================================================
    // DEFAULT
    // ========================================================

    return `The answer is ${result}.`;
}


// ============================================================
// MAIN BRAIN
// ============================================================

function handleBrain(message) {

    if (!message) {
        return null;
    }


    const original =
        String(message).trim();


    if (!original) {
        return null;
    }


    const text =
        original
            .toLowerCase()
            .trim();


    // ========================================================
    // PERSONAL MEMORY
    // ========================================================

    try {

        if (
            typeof handlePersonalMemory ===
            "function"
        ) {

            const personal =
                handlePersonalMemory(
                    original
                );

            if (personal) {
                return personal;
            }
        }

    } catch (error) {

        console.error(
            "Personal memory error:",
            error
        );
    }


    // ========================================================
    // DYNAMIC / RELATIONSHIP MEMORY
    // ========================================================

    try {

        if (
            typeof handleDynamicMemory ===
            "function"
        ) {

            const dynamic =
                handleDynamicMemory(
                    original
                );

            if (dynamic) {
                return dynamic;
            }
        }

    } catch (error) {

        console.error(
            "Dynamic memory error:",
            error
        );
    }


    // ========================================================
    // CALCULATOR
    // ========================================================

    if (
        looksLikeCalculation(
            original
        )
    ) {

        const result =
            calculateExpression(
                original
            );


        if (result !== null) {

            return getCalculatorResponse(
                original,
                result
            );
        }
    }


    // ========================================================
    // GREETINGS
    // ========================================================

    if (
        /^(hi|hello|hey|namaste|namaskar)\b/i.test(
            text
        ) ||

        text.includes("hey shri") ||

        text.includes("hey sri") ||

        text.includes("hello shri") ||

        text.includes("hello sri")
    ) {

        const userName =
            getSafeBrainUserName();


        if (!userName) {

            return `${getGreeting()}

I'm ${AI_NAME}.

What should I call you?`;
        }


        return `${getGreeting()}

How can I help you?`;
    }


    // ========================================================
    // IDENTITY
    // ========================================================

    if (
        text.includes("who are you") ||
        text.includes("who r you") ||
        text.includes("tum kaun ho") ||
        text.includes("aap kaun ho") ||
        text.includes("tu kaun hai") ||
        text.includes("ap kaun ho")
    ) {

        return `I'm ${AI_NAME}, your personal AI assistant.`;
    }


    // ========================================================
    // AI NAME
    // ========================================================

    if (
        text.includes("what is your name") ||
        text.includes("what's your name") ||
        text === "your name" ||
        text.includes("tumhara naam") ||
        text.includes("aapka naam") ||
        text.includes("apka naam")
    ) {

        return `My name is ${AI_NAME}.`;
    }


    // ========================================================
    // TIME
    // ========================================================

    const askingTime =

        text.includes("what time") ||

        text.includes("current time") ||

        text === "time" ||

        text.includes("time batao") ||

        text.includes("time btao") ||

        text.includes("time batana") ||

        text.includes("mujhe time") ||

        text.includes("abhi time") ||

        text.includes("abhi kitne baje") ||

        text.includes("kitne baje") ||

        text.includes("samay kya") ||

        text.includes("samay batao") ||

        text.includes("samay btao") ||

        text.includes("waqt kya") ||

        text.includes("waqt batao") ||

        text.includes("waqt btao");


    if (askingTime) {

        return `Abhi time ${getTime()} hai.`;
    }


    // ========================================================
    // DATE
    // ========================================================

    const askingDate =

        text.includes("today's date") ||

        text.includes("todays date") ||

        text.includes("what is the date") ||

        text === "date" ||

        text.includes("aaj ki date") ||

        text.includes("aaj date") ||

        text.includes("aaj ki tarikh") ||

        text.includes("aaj ki tareekh") ||

        text.includes("date kya hai") ||

        text.includes("date batao") ||

        text.includes("date btao") ||

        text.includes("tarikh kya hai") ||

        text.includes("tareekh kya hai");


    if (askingDate) {

        return `Aaj ${getDate()} hai.`;
    }


    // ========================================================
    // MOOD - HAPPY
    // ========================================================

    if (
        text.includes("are you happy") ||
        text.includes("be happy") ||
        text.includes("tum khush ho") ||
        text.includes("aap khush ho")
    ) {

        try {

            if (
                typeof saveContext ===
                "function"
            ) {

                saveContext(
                    "mood",
                    "happy"
                );
            }

        } catch (error) {

            console.error(
                "Mood save error:",
                error
            );
        }


        return "Absolutely! 😄 I'm feeling happy and energetic.";
    }


    // ========================================================
    // MOOD - CALM
    // ========================================================

    if (
        text.includes("be calm") ||
        text.includes("calm down") ||
        text.includes("calm raho") ||
        text.includes("shaant raho")
    ) {

        try {

            if (
                typeof saveContext ===
                "function"
            ) {

                saveContext(
                    "mood",
                    "calm"
                );
            }

        } catch (error) {

            console.error(
                "Mood save error:",
                error
            );
        }


        return "Okay. I'll keep things calm and relaxed. 😌";
    }


    // ========================================================
    // MOOD - PROFESSIONAL
    // ========================================================

    if (
        text.includes("be professional") ||
        text.includes("professional mode") ||
        text.includes("professional raho")
    ) {

        try {

            if (
                typeof saveContext ===
                "function"
            ) {

                saveContext(
                    "mood",
                    "professional"
                );
            }

        } catch (error) {

            console.error(
                "Mood save error:",
                error
            );
        }


        return "Professional mode activated. Let's focus. 💼";
    }


    // ========================================================
    // HOW ARE YOU
    // ========================================================

    if (
        text.includes("how are you") ||
        text.includes("how r u") ||
        text.includes("kaise ho") ||
        text.includes("kaisi ho") ||
        text.includes("aap kaise ho") ||
        text.includes("tum kaise ho")
    ) {

        return "I'm doing great! 😄 What are we working on today?";
    }


    // ========================================================
    // THANK YOU
    // ========================================================

    if (
        text.includes("thank you") ||
        text.includes("thanks") ||
        text.includes("dhanyawad")
    ) {

        const name =
            getSafeBrainUserName();


        if (name) {

            return `You're welcome, ${name}! 😊`;
        }


        return "You're welcome! 😊";
    }


    // ========================================================
    // DEFAULT
    // ========================================================

    return null;
}


// ============================================================
// LOAD
// ============================================================

console.log(
    "Shri Brain.js V5.0 loaded successfully."
);