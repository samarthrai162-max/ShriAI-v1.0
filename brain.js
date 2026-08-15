// ==========================================
// SHRI AI OS
// BRAIN.JS
// V4.0 PROFESSIONAL
// MAIN INTELLIGENCE ROUTER
// ==========================================


// ==========================================
// TIME
// ==========================================

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


// ==========================================
// DATE
// ==========================================

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


// ==========================================
// SAFE USER NAME
// ==========================================

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
            "Brain Username Error:",
            error
        );
    }


    return null;
}


// ==========================================
// GREETING
// ==========================================

function getGreeting() {

    const hour =
        new Date().getHours();


    const userName =
        getSafeBrainUserName();


    let greeting;


    if (
        hour < 12
    ) {

        greeting =
            "🌞 Good Morning";

    } else if (
        hour < 17
    ) {

        greeting =
            "☀️ Good Afternoon";

    } else {

        greeting =
            "🌙 Good Evening";
    }


    if (userName) {

        return (
            `${greeting}, ${userName}!`
        );
    }


    return (
        `${greeting}!`
    );
}


// ==========================================
// CALCULATOR
// ==========================================

function calculateExpression(
    expression
) {

    if (!expression) {
        return null;
    }


    let cleaned =
        String(expression)
            .toLowerCase()
            .trim();


    // ======================================
    // REMOVE NATURAL LANGUAGE
    // ======================================

    cleaned =
        cleaned

            .replace(
                /what is/gi,
                ""
            )

            .replace(
                /calculate/gi,
                ""
            )

            .replace(
                /kitna hota hai/gi,
                ""
            )

            .replace(
                /kitne hote hain/gi,
                ""
            )

            .replace(
                /answer batao/gi,
                ""
            )

            .replace(
                /answer bata/gi,
                ""
            )

            .replace(
                /ka answer/gi,
                ""
            )

            .replace(
                /ka jawab/gi,
                ""
            )

            .replace(
                /\bhai\b/gi,
                ""
            )

            .replace(
                /\bhoga\b/gi,
                ""
            );


    // ======================================
    // OPERATORS
    // ======================================

    cleaned =
        cleaned

            .replace(
                /multiplied by/gi,
                "*"
            )

            .replace(
                /multiply by/gi,
                "*"
            )

            .replace(
                /times/gi,
                "*"
            )

            .replace(
                /into/gi,
                "*"
            )

            .replace(
                /guna/gi,
                "*"
            )

            .replace(
                /गुना/g,
                "*"
            )

            .replace(
                /divided by/gi,
                "/"
            )

            .replace(
                /divide by/gi,
                "/"
            )

            .replace(
                /divided/gi,
                "/"
            )

            .replace(
                /divide/gi,
                "/"
            )

            .replace(
                /bhaag/gi,
                "/"
            )

            .replace(
                /भाग/g,
                "/"
            )

            .replace(
                /plus/gi,
                "+"
            )

            .replace(
                /add/gi,
                "+"
            )

            .replace(
                /jod/gi,
                "+"
            )

            .replace(
                /जोड़/g,
                "+"
            )

            .replace(
                /minus/gi,
                "-"
            )

            .replace(
                /subtract/gi,
                "-"
            )

            .replace(
                /ghata/gi,
                "-"
            )

            .replace(
                /घटा/g,
                "-"
            )

            .replace(
                /percent/gi,
                "%"
            )

            .replace(
                /percentage/gi,
                "%"
            );


    // ======================================
    // SECURITY CLEAN
    // ======================================

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


    // ======================================
    // SAFE CALCULATION
    // ======================================

    try {

        const result =
            Function(
                `"use strict"; return (${cleaned})`
            )();


        if (
            typeof result === "number" &&
            Number.isFinite(result)
        ) {

            return result;
        }

    } catch (error) {

        console.error(
            "Calculator Error:",
            error
        );
    }


    return null;
}


// ==========================================
// MEMORY STATUS COMMANDS
// ==========================================

function handleMemorySystemCommand(
    message
) {

    const text =
        String(message)
            .toLowerCase()
            .trim();


    // --------------------------------------
    // SHOW MEMORY
    // --------------------------------------

    if (
        text === "show memory" ||
        text === "show my memory" ||
        text === "meri memory dikhao" ||
        text === "memory dikhao" ||
        text === "memory dikhaao"
    ) {

        try {

            const memory =
                showMemory();

            const count =
                Object.keys(memory).length;


            if (!count) {

                return (
                    "I don't have any saved memories yet."
                );
            }


            const entries =
                Object.entries(
                    memory
                );


            const lines =
                entries.map(
                    ([key, value]) =>
                        `• ${key}: ${value}`
                );


            return (
                `I remember ${count} thing(s):\n` +
                lines.join("\n")
            );

        } catch (error) {

            return (
                "I couldn't access my memory right now."
            );
        }
    }


    // --------------------------------------
    // MEMORY COUNT
    // --------------------------------------

    if (
        text === "memory count" ||
        text === "how many memories" ||
        text === "meri memory kitni hai"
    ) {

        try {

            return (
                `I currently have ${getMemoryCount()} saved memor${getMemoryCount() === 1 ? "y" : "ies"}.`
            );

        } catch (error) {

            return (
                "I couldn't check the memory count."
            );
        }
    }


    // --------------------------------------
    // CLEAR ALL
    // --------------------------------------

    if (
        text === "clear all memory" ||
        text === "clear memory" ||
        text === "delete all memory" ||
        text === "meri saari memory delete karo" ||
        text === "meri sari memory delete karo" ||
        text === "sab memory bhool jao"
    ) {

        if (
            clearMemory()
        ) {

            return (
                "Okay. I've cleared all of my saved memory."
            );
        }

        return (
            "I couldn't clear my memory."
        );
    }


    return null;
}


// ==========================================
// MAIN BRAIN
// ==========================================

function handleBrain(
    message
) {

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


    // ======================================
    // MEMORY SYSTEM COMMANDS
    // ======================================

    try {

        const memoryCommand =
            handleMemorySystemCommand(
                original
            );

        if (memoryCommand) {
            return memoryCommand;
        }

    } catch (error) {

        console.error(
            "Memory command error:",
            error
        );
    }


    // ======================================
    // PERSONAL MEMORY
    // ======================================

    try {

        const personal =
            handlePersonalMemory(
                original
            );

        if (personal) {
            return personal;
        }

    } catch (error) {

        console.error(
            "Personal Memory Error:",
            error
        );
    }


    // ======================================
    // DYNAMIC MEMORY
    // ======================================

    try {

        const dynamic =
            handleDynamicMemory(
                original
            );

        if (dynamic) {
            return dynamic;
        }

    } catch (error) {

        console.error(
            "Dynamic Memory Error:",
            error
        );
    }


    // ======================================
    // GREETINGS
    // ======================================

    if (

        /^(hi|hello|hey|namaste|namaskar)\b/i
            .test(text) ||

        text.includes("hey shri") ||

        text.includes("hey sri") ||

        text.includes("hello shri") ||

        text.includes("hello sri")

    ) {

        const userName =
            getSafeBrainUserName();


        if (!userName) {

            return (
                `${getGreeting()}\n\n` +
                `I'm ${AI_NAME}.\n\n` +
                `What should I call you?`
            );
        }


        return (
            `${getGreeting()}\n\n` +
            `How can I help you?`
        );
    }


    // ======================================
    // IDENTITY
    // ======================================

    if (

        text.includes("who are you") ||

        text.includes("who r you") ||

        text.includes("tum kaun ho") ||

        text.includes("aap kaun ho") ||

        text.includes("tu kaun hai") ||

        text.includes("ap kaun ho")

    ) {

        return (
            `I'm ${AI_NAME}, your personal AI assistant.`
        );
    }


    // ======================================
    // AI NAME
    // ======================================

    if (

        text.includes("what is your name") ||

        text.includes("what's your name") ||

        text === "your name" ||

        text.includes("tumhara naam") ||

        text.includes("aapka naam") ||

        text.includes("apka naam")

    ) {

        return (
            `My name is ${AI_NAME}.`
        );
    }


    // ======================================
    // TIME
    // ======================================

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

        return (
            `Abhi time ${getTime()} hai.`
        );
    }


    // ======================================
    // DATE
    // ======================================

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

        return (
            `Aaj ${getDate()} hai.`
        );
    }


    // ======================================
    // CALCULATOR
    // ======================================

    const looksLikeCalculation =

        text.startsWith("calculate") ||

        text.startsWith("what is ") ||

        text.includes("plus") ||

        text.includes("minus") ||

        text.includes("times") ||

        text.includes("multiplied") ||

        text.includes("divided") ||

        text.includes("divide") ||

        text.includes("guna") ||

        text.includes("bhaag") ||

        text.includes("jod") ||

        text.includes("ghata") ||

        /[0-9]\s*[+\-*/%]\s*[0-9]/
            .test(text);


    if (looksLikeCalculation) {

        const result =
            calculateExpression(
                text
            );


        if (
            result !== null
        ) {

            return (
                `The answer is ${result}.`
            );
        }
    }


    // ======================================
    // MOOD - HAPPY
    // ======================================

    if (

        text.includes("are you happy") ||

        text.includes("be happy") ||

        text.includes("tum khush ho") ||

        text.includes("aap khush ho")

    ) {

        try {

            saveContext(
                "mood",
                "happy"
            );

        } catch (error) {}

        return (
            "Absolutely! 😄 I'm feeling happy and energetic."
        );
    }


    // ======================================
    // MOOD - CALM
    // ======================================

    if (

        text.includes("be calm") ||

        text.includes("calm down") ||

        text.includes("calm raho") ||

        text.includes("shaant raho")

    ) {

        try {

            saveContext(
                "mood",
                "calm"
            );

        } catch (error) {}

        return (
            "Okay. I'll keep things calm and relaxed. 😌"
        );
    }


    // ======================================
    // MOOD - PROFESSIONAL
    // ======================================

    if (

        text.includes("be professional") ||

        text.includes("professional mode") ||

        text.includes("professional raho")

    ) {

        try {

            saveContext(
                "mood",
                "professional"
            );

        } catch (error) {}

        return (
            "Professional mode activated. Let's focus. 💼"
        );
    }


    // ======================================
    // HOW ARE YOU
    // ======================================

    if (

        text.includes("how are you") ||

        text.includes("how r u") ||

        text.includes("kaise ho") ||

        text.includes("kaisi ho") ||

        text.includes("aap kaise ho") ||

        text.includes("tum kaise ho")

    ) {

        return (
            "I'm doing great! 😄 What are we working on today?"
        );
    }


    // ======================================
    // THANK YOU
    // ======================================

    if (

        text.includes("thank you") ||

        text.includes("thanks") ||

        text.includes("dhanyawad")

    ) {

        const name =
            getSafeBrainUserName();


        if (name) {

            return (
                `You're welcome, ${name}! 😊`
            );
        }


        return (
            "You're welcome! 😊"
        );
    }


    // ======================================
    // DEFAULT
    // ======================================

    return null;
}


// ==========================================
// LOAD
// ==========================================

console.log(
    "SHRI Brain.js V4.0 loaded successfully."
);