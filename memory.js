// ===============================
// Shri AI - Memory System
// ===============================

const MEMORY_KEY = "SHRI_AI_MEMORY";


function getMemory() {

    try {

        const data = localStorage.getItem(MEMORY_KEY);

        return data ? JSON.parse(data) : {};

    } catch (error) {

        console.error("Memory read error:", error);

        return {};

    }

}


function saveMemory(memory) {

    try {

        localStorage.setItem(
            MEMORY_KEY,
            JSON.stringify(memory)
        );

        return true;

    } catch (error) {

        console.error("Memory save error:", error);

        return false;

    }

}


function remember(key, value) {

    const memory = getMemory();

    memory[key] = value;

    saveMemory(memory);

}


function recall(key) {

    const memory = getMemory();

    return memory[key] ?? null;

}


function rememberFact(key, value) {

    remember(key, value);

}


function recallFact(key) {

    return recall(key);

}


function clearMemory() {

    localStorage.removeItem(MEMORY_KEY);

}


console.log("Memory.js loaded.");
// ==========================================
// SHRI AI OS - MEMORY INTELLIGENCE LAYER
// ==========================================

// ------------------------------------------
// SAVE CONTEXT
// ------------------------------------------

function saveContext(key, value) {

    if (!key || value === null || value === undefined) {
        return false;
    }

    return remember(
        `context_${key}`,
        value
    );
}


// ------------------------------------------
// GET CONTEXT
// ------------------------------------------

function getContext(key) {

    if (!key) {
        return null;
    }

    return recall(
        `context_${key}`
    );
}


// ------------------------------------------
// SAFE USER NAME
// ------------------------------------------

function getSafeUserName() {

    const name =
        recall("username");

    if (
        !name ||
        typeof name !== "string"
    ) {
        return null;
    }

    return name.trim() || null;
}


// ------------------------------------------
// PERSONAL MEMORY
// ------------------------------------------

function handlePersonalMemory(message) {

    if (!message) {
        return null;
    }

    const text =
        String(message).trim();

// ======================================
// WHAT IS MY NAME? — CHECK FIRST
// ======================================

if (
    /^(what is my name|what's my name|mera naam kya hai|mera naam batao|mera name kya hai|mera name batao|do you know my name)$/i
        .test(text)
) {

    const name =
        getSafeUserName();

    if (name) {
        return `Your name is ${name}. 😊`;
    }

    return "I don't know your name yet. Tell me, and I'll remember it.";
}
// ======================================
    // USER NAME
    // ======================================

const nameMatch =
    text.match(
        /^(?:my name is|mera naam|mera name|call me)\s+(?:is\s+)?([a-zA-Z][a-zA-Z\s]{1,30}?)(?:\s+hai)?$/i
    );
    if (nameMatch) {

        let name =
            nameMatch[1]
                .trim()
                .replace(/[.!?,]+$/, "");


        // Avoid accidentally saving long sentences
        if (
            name &&
            name.split(/\s+/).length <= 4
        ) {

            remember(
                "username",
                name
            );

            return `Okay! I'll remember that your name is ${name}. 😊`;
        }
    }



    return null;
}


// ------------------------------------------
// DYNAMIC MEMORY
// ------------------------------------------

function handleDynamicMemory(message) {

    if (!message) {
        return null;
    }

    const text =
        String(message).trim();


    // ======================================
    // FAVOURITE SUBJECT
    // ======================================

    const subjectMatch =
        text.match(
            /(?:my|mera|meri)\s+(?:favourite|favorite)\s+subject\s+(?:is|hai)\s+(.+)/i
        );


    if (subjectMatch) {

        const subject =
            subjectMatch[1]
                .trim()
                .replace(/[.!?,]+$/, "");


        if (subject) {

            remember(
                "favoriteSubject",
                subject
            );

            return `Got it! I'll remember that your favourite subject is ${subject}. 😊`;
        }
    }


    // ======================================
    // FAVOURITE LANGUAGE
    // ======================================

    const languageMatch =
        text.match(
            /(?:my|meri|mera)\s+(?:favourite|favorite)\s+language\s+(?:is|hai)\s+(.+)/i
        );


    if (languageMatch) {

        const language =
            languageMatch[1]
                .trim()
                .replace(/[.!?,]+$/, "");


        if (language) {

            remember(
                "favoriteLanguage",
                language
            );

            return `Got it! I'll remember that your favourite language is ${language}. 😊`;
        }
    }


    // ======================================
    // CLASS
    // ======================================

    const classMatch =
        text.match(
            /(?:i am|i'm|mai|main)\s+(?:in\s+)?class\s+([0-9]+[a-zA-Z]?)/i
        );


    if (classMatch) {

        const className =
            classMatch[1].trim();


        remember(
            "class",
            className
        );


        return `Okay! I'll remember that you're in class ${className}. 😊`;
    }


    // ======================================
    // FAVOURITE COLOUR
    // ======================================

    const colorMatch =
        text.match(
            /(?:my|mera|meri)\s+(?:favourite|favorite)\s+colou?r\s+(?:is|hai)\s+(.+)/i
        );


    if (colorMatch) {

        const color =
            colorMatch[1]
                .trim()
                .replace(/[.!?,]+$/, "");


        if (color) {

            remember(
                "favoriteColor",
                color
            );

            return `Got it! I'll remember that your favourite colour is ${color}. 😊`;
        }
    }


    return null;
}


console.log(
    "Shri Memory Intelligence Layer loaded successfully."
);