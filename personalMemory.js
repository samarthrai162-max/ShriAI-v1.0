// ==========================================
// Shri AI OS - Personal Memory FINAL
// ==========================================


// ==========================================
// CLEAN VALUE
// ==========================================

function cleanMemoryValue(value) {

    if (!value) return "";

    return String(value)
        .replace(/\bhai\b/gi, "")
        .replace(/\bh\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

}


// ==========================================
// NORMALIZE
// ==========================================

function normalizeMemoryText(message) {

    return String(message)
        .toLowerCase()
        .replace(/favourite/g, "favorite")
        .replace(/colour/g, "color")
        .replace(/[?.!,]/g, "")
        .replace(/\s+/g, " ")
        .trim();

}


// ==========================================
// QUESTION DETECTION
// ==========================================

function isMemoryQuestion(text) {

    const t = normalizeMemoryText(text);

    return (
        /\bwhat\b/.test(t) ||
        /\bwho\b/.test(t) ||
        /\bkya\b/.test(t) ||
        /\bkyaa\b/.test(t) ||
        /\bkaun\b/.test(t) ||
        /\bkon\b/.test(t) ||
        /\bkaun\s+sa\b/.test(t) ||
        /\bkaun\s+si\b/.test(t) ||
        /\bkaun\s+se\b/.test(t) ||
        /\bkon\s+sa\b/.test(t) ||
        /\bkon\s+si\b/.test(t) ||
        /\bkon\s+se\b/.test(t) ||
        /\bkaunsa\b/.test(t) ||
        /\bkaunsi\b/.test(t) ||
        /\bkonsa\b/.test(t) ||
        /\bkonsi\b/.test(t)
    );

}


// ==========================================
// RECALL HELPER
// ==========================================

function recallMemory(key, label) {

    const value = recallFact(key);

    if (value) {
        return `Your ${label} is ${value}.`;
    }

    return `I don't know your ${label} yet.`;

}


// ==========================================
// MAIN PERSONAL MEMORY
// ==========================================

function handlePersonalMemory(message) {

    if (!message) return null;

    const original =
        String(message).trim();

    const text =
        normalizeMemoryText(original);


    // ======================================
    // IMPORTANT:
    // QUESTIONS ALWAYS COME FIRST
    // ======================================

    // NAME
    if (
        /^(what is|what's) my name$/.test(text) ||
        /^mera naam (kya|kyaa|kaun|kon) hai$/.test(text) ||
        /^mera naam (kaun|kon)\s+(sa|si)$/.test(text) ||
        text === "who am i"
    ) {

        const value = recallFact("name");

        if (value) {
            return `Your name is ${value}.`;
        }

        return "I don't know your name yet.";

    }


    // ======================================
    // FAVORITE COLOR
    // ======================================

    if (
        /^what is my favorite color$/.test(text) ||
        /^mera favorite color (kya|kyaa) hai$/.test(text) ||
        /^mera favorite color (kaun|kon)\s+(sa|si) hai$/.test(text) ||
        /^mera favorite color (kaunsa|kaunsi|konsa|konsi) hai$/.test(text)
    ) {

        return recallMemory(
            "favoriteColor",
            "favorite color"
        );

    }


    // ======================================
    // FAVORITE GAME
    // ======================================

    if (
        /^what is my favorite game$/.test(text) ||
        /^mera favorite game (kya|kyaa) hai$/.test(text) ||
        /^mera favorite game (kaun|kon)\s+sa hai$/.test(text) ||
        /^mera favorite game (kaunsa|konsa) hai$/.test(text)
    ) {

        return recallMemory(
            "favoriteGame",
            "favorite game"
        );

    }


    // ======================================
    // FAVORITE LANGUAGE
    // ======================================

    if (
        /^what is my favorite language$/.test(text) ||
        /^meri favorite language (kya|kyaa) hai$/.test(text) ||
        /^meri favorite language (kaun|kon)\s+si hai$/.test(text) ||
        /^meri favorite language (kaunsi|konsi) hai$/.test(text) ||
        /^mera favorite language (kya|kyaa) hai$/.test(text) ||
        /^mera favorite language (kaun|kon)\s+si hai$/.test(text) ||
        /^mera favorite language (kaunsi|konsi) hai$/.test(text)
    ) {

        return recallMemory(
            "favoriteLanguage",
            "favorite language"
        );

    }


    // ======================================
    // FAVORITE SINGER
    // ======================================

    if (
        /^what is my favorite singer$/.test(text) ||
        /^mera favorite singer (kya|kyaa) hai$/.test(text) ||
        /^mera favorite singer (kaun|kon) hai$/.test(text)
    ) {

        return recallMemory(
            "favoriteSinger",
            "favorite singer"
        );

    }


    // ======================================
    // FAVORITE FOOD
    // ======================================

    if (
        /^what is my favorite food$/.test(text) ||
        /^mera favorite food (kya|kyaa) hai$/.test(text) ||
        /^mera favorite food (kaun|kon)\s+sa hai$/.test(text) ||
        /^mera favorite food (kaunsa|konsa) hai$/.test(text)
    ) {

        return recallMemory(
            "favoriteFood",
            "favorite food"
        );

    }


    // ======================================
    // FAVORITE BOOK
    // ======================================

    if (
        /^what is my favorite book$/.test(text) ||
        /^meri favorite book (kya|kyaa) hai$/.test(text) ||
        /^meri favorite book (kaun|kon)\s+si hai$/.test(text) ||
        /^meri favorite book (kaunsi|konsi) hai$/.test(text)
    ) {

        return recallMemory(
            "favoriteBook",
            "favorite book"
        );

    }


    // ======================================
    // FAVORITE SUBJECT
    // ======================================

    if (
        /^what is my favorite subject$/.test(text) ||
        /^mera favorite subject (kya|kyaa) hai$/.test(text) ||
        /^mera favorite subject (kaun|kon)\s+sa hai$/.test(text) ||
        /^mera favorite subject (kaunsa|konsa) hai$/.test(text)
    ) {

        return recallMemory(
            "favoriteSubject",
            "favorite subject"
        );

    }


    // ======================================
    // SCHOOL
    // ======================================

    if (
        /^what is my school$/.test(text) ||
        /^mera school (kya|kyaa) hai$/.test(text) ||
        /^mera school (kaun|kon)\s+sa hai$/.test(text) ||
        /^mera school (kaunsa|konsa) hai$/.test(text)
    ) {

        return recallMemory(
            "school",
            "school"
        );

    }


    // ======================================
    // CLASS
    // ======================================

    if (
        /^what class am i in$/.test(text) ||
        /^meri class (kya|kyaa) hai$/.test(text) ||
        /^meri class (kaun|kon)\s+si hai$/.test(text) ||
        /^meri class (kaunsi|konsi) hai$/.test(text)
    ) {

        return recallMemory(
            "class",
            "class"
        );

    }


    // ======================================
    // HOBBY
    // ======================================

    if (
        /^what is my hobby$/.test(text) ||
        /^meri hobby (kya|kyaa) hai$/.test(text) ||
        /^meri hobby (kaun|kon)\s+si hai$/.test(text) ||
        /^meri hobby (kaunsi|konsi) hai$/.test(text)
    ) {

        return recallMemory(
            "hobby",
            "hobby"
        );

    }


    // ======================================
    // CITY
    // ======================================

    if (
        /^what is my city$/.test(text) ||
        /^meri city (kya|kyaa) hai$/.test(text) ||
        /^mera city (kya|kyaa) hai$/.test(text)
    ) {

        return recallMemory(
            "city",
            "city"
        );

    }


    // ======================================
    // AGE
    // ======================================

    if (
        /^what is my age$/.test(text) ||
        /^meri age (kya|kyaa) hai$/.test(text) ||
        /^meri age kitni hai$/.test(text) ||
        /^meri umar (kya|kyaa) hai$/.test(text) ||
        /^meri umar kitni hai$/.test(text)
    ) {

        return recallMemory(
            "age",
            "age"
        );

    }


    // ======================================
    // DO NOT SAVE QUESTIONS
    // ======================================

    if (isMemoryQuestion(text)) {
        return null;
    }


    // ======================================
    // SAVE MEMORY
    // ======================================

    const savePatterns = [

        // NAME
        {
            patterns: [
                /^my name is (.+)$/i,
                /^mera naam (.+) hai$/i,
                /^mera naam (.+) h$/i,
                /^call me (.+)$/i
            ],
            key: "name",
            label: "name"
        },

        // COLOR
        {
            patterns: [
                /^my favorite color is (.+)$/i,
                /^mera favorite color (.+) hai$/i,
                /^meri favorite color (.+) hai$/i,
                /^mera favourite color (.+) hai$/i,
                /^meri favourite color (.+) hai$/i,
                /^mera favourite colour (.+) hai$/i
            ],
            key: "favoriteColor",
            label: "favorite color"
        },

        // GAME
        {
            patterns: [
                /^my favorite game is (.+)$/i,
                /^mera favorite game (.+) hai$/i,
                /^mera favourite game (.+) hai$/i
            ],
            key: "favoriteGame",
            label: "favorite game"
        },

        // LANGUAGE
        {
            patterns: [
                /^my favorite language is (.+)$/i,
                /^meri favorite language (.+) hai$/i,
                /^meri favourite language (.+) hai$/i,
                /^mera favorite language (.+) hai$/i,
                /^mera favourite language (.+) hai$/i
            ],
            key: "favoriteLanguage",
            label: "favorite language"
        },

        // SINGER
        {
            patterns: [
                /^my favorite singer is (.+)$/i,
                /^mera favorite singer (.+) hai$/i,
                /^mera favourite singer (.+) hai$/i
            ],
            key: "favoriteSinger",
            label: "favorite singer"
        },

        // FOOD
        {
            patterns: [
                /^my favorite food is (.+)$/i,
                /^mera favorite food (.+) hai$/i,
                /^mera favourite food (.+) hai$/i
            ],
            key: "favoriteFood",
            label: "favorite food"
        },

        // BOOK
        {
            patterns: [
                /^my favorite book is (.+)$/i,
                /^meri favorite book (.+) hai$/i,
                /^meri favourite book (.+) hai$/i
            ],
            key: "favoriteBook",
            label: "favorite book"
        },

        // SUBJECT
        {
            patterns: [
                /^my favorite subject is (.+)$/i,
                /^mera favorite subject (.+) hai$/i,
                /^mera favourite subject (.+) hai$/i
            ],
            key: "favoriteSubject",
            label: "favorite subject"
        },

        // SCHOOL
        {
            patterns: [
                /^my school is (.+)$/i,
                /^mera school (.+) hai$/i
            ],
            key: "school",
            label: "school"
        },

        // CLASS
        {
            patterns: [
                /^my class is (.+)$/i,
                /^meri class (.+) hai$/i
            ],
            key: "class",
            label: "class"
        },

        // HOBBY
        {
            patterns: [
                /^my hobby is (.+)$/i,
                /^meri hobby (.+) hai$/i
            ],
            key: "hobby",
            label: "hobby"
        },

        // CITY
        {
            patterns: [
                /^my city is (.+)$/i,
                /^meri city (.+) hai$/i,
                /^mera city (.+) hai$/i
            ],
            key: "city",
            label: "city"
        },

        // AGE
        {
            patterns: [
                /^my age is (.+)$/i,
                /^meri age (.+) hai$/i,
                /^meri umar (.+) hai$/i
            ],
            key: "age",
            label: "age"
        }

    ];


    for (const item of savePatterns) {

        for (const pattern of item.patterns) {

            const match =
                original.match(pattern);

            if (!match) continue;


            let value =
                cleanMemoryValue(match[1]);


            if (!value) {
                return null;
            }


            // Safety: question words cannot become values

            if (
                /^(kya|kyaa|kaun|kon|kaun\s+sa|kaun\s+si|kaun\s+se|kon\s+sa|kon\s+si|kon\s+se|kaunsa|kaunsi|konsa|konsi)$/i
                    .test(value)
            ) {

                return null;

            }


            rememberFact(
                item.key,
                value
            );


            return `Done! I'll remember your ${item.label} is ${value}.`;

        }

    }


    return null;

}


console.log(
    "PersonalMemory.js FINAL loaded."
);