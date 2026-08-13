// ==========================================
// SHRI AI OS - BRAIN.JS
// Multi-User Brain System
// ==========================================


// ==========================================
// TIME
// ==========================================

function getTime() {

    return new Date().toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

}


// ==========================================
// DATE
// ==========================================

function getDate() {

    return new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

}


// ==========================================
// CURRENT USER
// ==========================================

function getSafeUserName() {

    try {

        if (
            typeof getCurrentUserName ===
            "function"
        ) {

            return getCurrentUserName();

        }

    } catch (error) {

        console.warn(
            "User name lookup failed:",
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
        getSafeUserName();


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


// ==========================================
// EXTRACT NAME
// ==========================================

function extractUserName(text) {

    if (!text) {
        return null;
    }


    const original =
        String(text).trim();


    let match;


    // My name is Rahul
    match =
        original.match(
            /\bmy\s+name\s+is\s+([a-zA-Z][a-zA-Z\s'-]{1,30})/i
        );


    if (match) {

        return cleanUserName(
            match[1]
        );

    }


    // I am Rahul
    match =
        original.match(
            /\bi\s+am\s+([a-zA-Z][a-zA-Z\s'-]{1,30})/i
        );


    if (match) {

        return cleanUserName(
            match[1]
        );

    }


    // I'm Rahul
    match =
        original.match(
            /\bi['’]?m\s+([a-zA-Z][a-zA-Z\s'-]{1,30})/i
        );


    if (match) {

        return cleanUserName(
            match[1]
        );

    }


    // Mera naam Rahul hai
    match =
        original.match(
            /mera\s+naam\s+([a-zA-Z][a-zA-Z\s'-]{1,30})(?:\s+hai)?/i
        );


    if (match) {

        return cleanUserName(
            match[1]
        );

    }


    // Mera naam Rahul
    match =
        original.match(
            /mera\s+naam\s+([a-zA-Z][a-zA-Z\s'-]{1,30})/i
        );


    if (match) {

        return cleanUserName(
            match[1]
        );

    }


    return null;

}


// ==========================================
// CLEAN USER NAME
// ==========================================

function cleanUserName(name) {

    if (!name) {
        return null;
    }


    let clean =
        String(name)
            .replace(
                /\b(is|hai|hoon|hun|h|please|pls)\b/gi,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    if (!clean) {
        return null;
    }


    // Avoid accidentally saving long sentences.
    if (clean.length > 30) {
        return null;
    }


    // Name should contain letters.
    if (!/[a-zA-Z]/.test(clean)) {
        return null;
    }


    return clean;

}


// ==========================================
// CALCULATOR
// ==========================================

function calculateExpression(expression) {

    if (!expression) return null;


    let cleaned =
        expression
            .toLowerCase()
            .trim();


    cleaned =
        cleaned
            .replace(/what is/gi, "")
            .replace(/calculate/gi, "")
            .replace(/kitna hota hai/gi, "")
            .replace(/kitne hote hain/gi, "")
            .replace(/answer batao/gi, "")
            .replace(/answer bata/gi, "")
            .replace(/ka answer/gi, "")
            .replace(/ka jawab/gi, "")
            .replace(/hai/gi, "")
            .replace(/hoga/gi, "");


    cleaned =
        cleaned
            .replace(/multiplied by/gi, "*")
            .replace(/multiply by/gi, "*")
            .replace(/times/gi, "*")
            .replace(/into/gi, "*")
            .replace(/guna/gi, "*")
            .replace(/गुना/g, "*")

            .replace(/divided by/gi, "/")
            .replace(/divide by/gi, "/")
            .replace(/divided/gi, "/")
            .replace(/divide/gi, "/")
            .replace(/bhaag/gi, "/")
            .replace(/भाग/g, "/")

            .replace(/plus/gi, "+")
            .replace(/add/gi, "+")
            .replace(/jod/gi, "+")
            .replace(/जोड़/g, "+")

            .replace(/minus/gi, "-")
            .replace(/subtract/gi, "-")
            .replace(/ghata/gi, "-")
            .replace(/घटा/g, "-")

            .replace(/percent/gi, "%")
            .replace(/percentage/gi, "%");


    cleaned =
        cleaned
            .replace(/\bko\b/gi, "")
            .replace(/\bse\b/gi, "")
            .replace(/\bka\b/gi, "")
            .replace(/\bki\b/gi, "")
            .replace(/\bke\b/gi, "")
            .replace(/\banswer\b/gi, "")
            .replace(/\banswer kya hai\b/gi, "")
            .replace(/\bkitna\b/gi, "")
            .replace(/\bkitni\b/gi, "");


    cleaned =
        cleaned
            .replace(
                /[^0-9+\-*/().%\s]/g,
                ""
            )
            .trim();


    if (!cleaned) {
        return null;
    }


    if (!/\d/.test(cleaned)) {
        return null;
    }


    if (!/[+\-*/%]/.test(cleaned)) {
        return null;
    }


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

        console.log(
            "Calculator error:",
            error
        );

    }


    return null;

}


// ==========================================
// MAIN BRAIN
// ==========================================

function handleBrain(message) {

    if (!message) {
        return null;
    }


    const original =
        String(message).trim();


    const text =
        original.toLowerCase().trim();


    // ======================================
    // USER NAME SETTING
    // ======================================

    const detectedName =
        extractUserName(
            original
        );


    if (detectedName) {

        try {

            if (
                typeof setCurrentUserName ===
                "function"
            ) {

                const saved =
                    setCurrentUserName(
                        detectedName
                    );


                if (saved) {

                    return `Nice to meet you, ${detectedName}! 😊 I'll remember your name.`;

                }

            }

        } catch (error) {

            console.error(
                "Name save error:",
                error
            );

        }

    }


    // ======================================
    // ASK MY NAME
    // ======================================

    if (
        text.includes("what is my name") ||
        text.includes("what's my name") ||
        text.includes("mera naam kya hai") ||
        text.includes("mera naam batao") ||
        text.includes("do you know my name")
    ) {

        const userName =
            getSafeUserName();


        if (userName) {

            return `Your name is ${userName}.`;

        }


        return "I don't know your name yet. What should I call you?";

    }


    // ======================================
    // FIRST USER
    // ======================================

    const userName =
        getSafeUserName();


    if (!userName) {

        if (
            /^(hi|hello|hey|namaste|namaskar)\b/i.test(text) ||
            text.includes("hey shri") ||
            text.includes("hello shri") ||
            text.includes("hi shri")
        ) {

            return `${getGreeting()}

I'm ${AI_NAME}.

What should I call you?`;

        }

    }


    // ======================================
    // MEMORY
    // ======================================

    try {

        const personal =
            handlePersonalMemory(original);

        if (personal) {
            return personal;
        }

    } catch (error) {

        console.log(
            "Personal memory skipped:",
            error
        );

    }


    try {

        const dynamic =
            handleDynamicMemory(original);

        if (dynamic) {
            return dynamic;
        }

    } catch (error) {

        console.log(
            "Dynamic memory skipped:",
            error
        );

    }


    // ======================================
    // GREETINGS
    // ======================================

    if (
        /^(hi|hello|hey|namaste|namaskar)\b/i.test(text) ||
        text.includes("hey shri") ||
        text.includes("hey sri") ||
        text.includes("hello shri") ||
        text.includes("hello sri")
    ) {

        return `${getGreeting()}

How can I help you?`;

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

        return `I'm ${AI_NAME}, your personal AI assistant.`;

    }


    // ======================================
    // AI NAME
    // ======================================

    if (
        text.includes("what is your name") ||
        text.includes("what's your name") ||
        text.includes("your name") ||
        text.includes("tumhara naam") ||
        text.includes("aapka naam") ||
        text.includes("apka naam")
    ) {

        return `My name is ${AI_NAME}.`;

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

        return `Abhi time ${getTime()} hai.`;

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

        return `Aaj ${getDate()} hai.`;

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
        /[0-9]\s*[+\-*/%]\s*[0-9]/.test(text);


    if (looksLikeCalculation) {

        const result =
            calculateExpression(text);


        if (result !== null) {

            return `The answer is ${result}.`;

        }

    }


    // ======================================
    // MOOD
    // ======================================

    if (
        text.includes("are you happy") ||
        text.includes("be happy") ||
        text.includes("tum khush ho") ||
        text.includes("aap khush ho")
    ) {

        try {
            saveContext("mood", "happy");
        } catch (error) {}

        return "Absolutely! 😄 I'm feeling happy and energetic.";

    }


    if (
        text.includes("be calm") ||
        text.includes("calm down") ||
        text.includes("calm raho") ||
        text.includes("shaant raho")
    ) {

        try {
            saveContext("mood", "calm");
        } catch (error) {}

        return "Okay. I'll keep things calm and relaxed. 😌";

    }


    if (
        text.includes("be professional") ||
        text.includes("professional mode") ||
        text.includes("professional raho")
    ) {

        try {
            saveContext("mood", "professional");
        } catch (error) {}

        return "Professional mode activated. Let's focus. 💼";

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

        return "I'm doing great! 😄 What are we working on today?";

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
            getSafeUserName();


        if (name) {

            return `You're welcome, ${name}! 😊`;

        }


        return "You're welcome! 😊";

    }


    // ======================================
    // DEFAULT
    // ======================================

    return null;

}


console.log(
    "Shri Brain.js loaded successfully."
);