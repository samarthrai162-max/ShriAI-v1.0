// ==========================================
// SHRI AI OS
// PERSONAL MEMORY SYSTEM
// V4.0 PROFESSIONAL
// ==========================================


// ==========================================
// NORMALIZE TEXT
// ==========================================

function normalizePersonalText(message) {

    if (!message) {
        return "";
    }

    return String(message)
        .toLowerCase()

        .replace(
            /favourite/g,
            "favorite"
        )

        .replace(
            /colour/g,
            "color"
        )

        .replace(
            /\bkaa\b/g,
            "ka"
        )

        .replace(
            /\bkee\b/g,
            "ki"
        )

        .replace(
            /[?.!,]/g,
            ""
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();
}


// ==========================================
// CLEAN VALUE
// ==========================================

function cleanPersonalValue(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(
            /\s+/g,
            " "
        )
        .replace(
            /[.!?,]+$/,
            ""
        )
        .trim();
}


// ==========================================
// QUESTION WORD DETECTION
// ==========================================

function isPersonalQuestion(text) {

    const t =
        normalizePersonalText(text);

    return (
        /\bwhat\b/.test(t) ||
        /\bwho\b/.test(t) ||
        /\bwhose\b/.test(t) ||

        /\bkya\b/.test(t) ||
        /\bkyaa\b/.test(t) ||

        /\bkaun\b/.test(t) ||
        /\bkon\b/.test(t) ||

        /\bkaunsa\b/.test(t) ||
        /\bkaunsi\b/.test(t) ||
        /\bkaunse\b/.test(t) ||

        /\bkonsa\b/.test(t) ||
        /\bkonsi\b/.test(t) ||
        /\bkonse\b/.test(t)
    );
}


// ==========================================
// INVALID VALUE
// ==========================================

function isInvalidPersonalValue(value) {

    const t =
        normalizePersonalText(value);

    if (!t) {
        return true;
    }

    return /^(kya|kyaa|kaun|kon|what|who|whose|kaunsa|kaunsi|kaunse|konsa|konsi|konse)$/i
        .test(t);
}


// ==========================================
// SAFE USER NAME
// ==========================================

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


// ==========================================
// NAME RECALL
// ==========================================

function handleNameRecall(text) {

    const t =
        normalizePersonalText(text);

    const patterns = [

        /^what is my name$/,

        /^what's my name$/,

        /^mera naam kya hai$/,

        /^mera naam batao$/,

        /^mera name kya hai$/,

        /^mera name batao$/,

        /^do you know my name$/,

        /^who am i$/,

        /^mujhe mere naam ke baare mein batao$/

    ];


    if (
        patterns.some(
            pattern =>
                pattern.test(t)
        )
    ) {

        const name =
            getSafeUserName();

        if (name) {

            return (
                `Your name is ${name}. 😊`
            );
        }

        return (
            "I don't know your name yet. " +
            "Tell me, and I'll remember it."
        );
    }

    return null;
}


// ==========================================
// NAME SAVE
// ==========================================

function handleNameSave(original) {

    let match;


    // My name is Samarth
    match =
        original.match(
            /^my\s+name\s+is\s+([a-zA-Z][a-zA-Z\s'-]{0,29})$/i
        );


    // Mera naam Samarth hai
    if (!match) {

        match =
            original.match(
                /^mera\s+naam\s+([a-zA-Z][a-zA-Z\s'-]{0,29})\s+(?:hai|h)$/i
            );
    }


    // Mera naam Samarth
    if (!match) {

        match =
            original.match(
                /^mera\s+naam\s+([a-zA-Z][a-zA-Z\s'-]{0,29})$/i
            );
    }


    // Mera name Samarth hai
    if (!match) {

        match =
            original.match(
                /^mera\s+name\s+([a-zA-Z][a-zA-Z\s'-]{0,29})\s+(?:hai|h)$/i
            );
    }


    // Call me Samarth
    if (!match) {

        match =
            original.match(
                /^call\s+me\s+([a-zA-Z][a-zA-Z\s'-]{0,29})$/i
            );
    }


    if (!match) {
        return null;
    }


    const name =
        cleanPersonalValue(
            match[1]
        );


    if (
        !name ||
        isInvalidPersonalValue(name) ||
        name.split(/\s+/).length > 4
    ) {
        return null;
    }


    if (
        remember(
            "username",
            name
        )
    ) {

        return (
            `Nice to meet you, ${name}! 😊 ` +
            `I'll remember your name.`
        );
    }


    return null;
}


// ==========================================
// PERSONAL FACT DEFINITIONS
// ==========================================

const PERSONAL_FACTS = {

    favoriteColor: {
        label: "favorite color",
        hindi: "favorite color"
    },

    favoriteGame: {
        label: "favorite game",
        hindi: "favorite game"
    },

    favoriteLanguage: {
        label: "favorite language",
        hindi: "favorite language"
    },

    favoriteSinger: {
        label: "favorite singer",
        hindi: "favorite singer"
    },

    favoriteFood: {
        label: "favorite food",
        hindi: "favorite food"
    },

    favoriteBook: {
        label: "favorite book",
        hindi: "favorite book"
    },

    favoriteSubject: {
        label: "favorite subject",
        hindi: "favorite subject"
    },

    school: {
        label: "school",
        hindi: "school"
    },

    class: {
        label: "class",
        hindi: "class"
    },

    hobby: {
        label: "hobby",
        hindi: "hobby"
    },

    city: {
        label: "city",
        hindi: "city"
    },

    age: {
        label: "age",
        hindi: "age"
    }
};


// ==========================================
// PERSONAL RECALL HELPER
// ==========================================

function recallPersonalFact(
    key,
    label
) {

    const value =
        recallFact(key);

    if (value) {

        return (
            `Your ${label} is ${value}.`
        );
    }

    return (
        `I don't know your ${label} yet.`
    );
}


// ==========================================
// PERSONAL RECALL
// ==========================================

function handlePersonalRecall(text) {

    const t =
        normalizePersonalText(text);


    const recallMap = [

        {
            patterns: [
                /^what is my favorite color$/,
                /^mera favorite color kya hai$/,
                /^mera favorite color kaun sa hai$/,
                /^mera favorite color kaunsa hai$/
            ],
            key: "favoriteColor",
            label: "favorite color"
        },

        {
            patterns: [
                /^what is my favorite game$/,
                /^mera favorite game kya hai$/,
                /^mera favorite game kaun sa hai$/,
                /^mera favorite game kaunsa hai$/
            ],
            key: "favoriteGame",
            label: "favorite game"
        },

        {
            patterns: [
                /^what is my favorite language$/,
                /^meri favorite language kya hai$/,
                /^mera favorite language kya hai$/,
                /^meri favorite language kaunsi hai$/,
                /^mera favorite language kaunsi hai$/
            ],
            key: "favoriteLanguage",
            label: "favorite language"
        },

        {
            patterns: [
                /^what is my favorite singer$/,
                /^mera favorite singer kya hai$/,
                /^mera favorite singer kaun hai$/,
                /^mera favorite singer kaun sa hai$/,
                /^mera favorite singer kaunsa hai$/
            ],
            key: "favoriteSinger",
            label: "favorite singer"
        },

        {
            patterns: [
                /^what is my favorite food$/,
                /^mera favorite food kya hai$/,
                /^mera favorite food kaun sa hai$/,
                /^mera favorite food kaunsa hai$/
            ],
            key: "favoriteFood",
            label: "favorite food"
        },

        {
            patterns: [
                /^what is my favorite book$/,
                /^meri favorite book kya hai$/,
                /^meri favorite book kaunsi hai$/,
                /^mera favorite book kya hai$/,
                /^mera favorite book kaunsa hai$/
            ],
            key: "favoriteBook",
            label: "favorite book"
        },

        {
            patterns: [
                /^what is my favorite subject$/,
                /^mera favorite subject kya hai$/,
                /^mera favorite subject kaun sa hai$/,
                /^mera favorite subject kaunsa hai$/
            ],
            key: "favoriteSubject",
            label: "favorite subject"
        },

        {
            patterns: [
                /^what is my school$/,
                /^mera school kya hai$/,
                /^mera school kaun sa hai$/,
                /^mera school kaunsa hai$/
            ],
            key: "school",
            label: "school"
        },

        {
            patterns: [
                /^what class am i in$/,
                /^which class am i in$/,
                /^meri class kya hai$/,
                /^meri class kaunsi hai$/
            ],
            key: "class",
            label: "class"
        },

        {
            patterns: [
                /^what is my hobby$/,
                /^meri hobby kya hai$/,
                /^meri hobby kaun si hai$/,
                /^meri hobby kaunsi hai$/
            ],
            key: "hobby",
            label: "hobby"
        },

        {
            patterns: [
                /^what is my city$/,
                /^mera city kya hai$/,
                /^meri city kya hai$/,
                /^mera shehar kya hai$/
            ],
            key: "city",
            label: "city"
        },

        {
            patterns: [
                /^what is my age$/,
                /^meri age kya hai$/,
                /^meri age kitni hai$/,
                /^meri umar kya hai$/,
                /^meri umar kitni hai$/
            ],
            key: "age",
            label: "age"
        }

    ];


    for (
        const item of recallMap
    ) {

        if (
            item.patterns.some(
                pattern =>
                    pattern.test(t)
            )
        ) {

            return recallPersonalFact(
                item.key,
                item.label
            );
        }
    }


    return null;
}


// ==========================================
// FORGET PERSONAL MEMORY
// ==========================================

function handlePersonalForget(text) {

    const t =
        normalizePersonalText(text);


    const forgetMap = [

        {
            patterns: [
                /^forget my name$/,
                /^mera naam bhool jao$/,
                /^mera naam bhul jao$/
            ],
            key: "username",
            label: "name"
        },

        {
            patterns: [
                /^forget my favorite color$/,
                /^mera favorite color bhool jao$/,
                /^mera favorite color bhul jao$/
            ],
            key: "favoriteColor",
            label: "favorite color"
        },

        {
            patterns: [
                /^forget my favorite game$/,
                /^mera favorite game bhool jao$/,
                /^mera favorite game bhul jao$/
            ],
            key: "favoriteGame",
            label: "favorite game"
        },

        {
            patterns: [
                /^forget my favorite language$/,
                /^meri favorite language bhool jao$/,
                /^meri favorite language bhul jao$/
            ],
            key: "favoriteLanguage",
            label: "favorite language"
        },

        {
            patterns: [
                /^forget my favorite singer$/,
                /^mera favorite singer bhool jao$/,
                /^mera favorite singer bhul jao$/
            ],
            key: "favoriteSinger",
            label: "favorite singer"
        },

        {
            patterns: [
                /^forget my favorite food$/,
                /^mera favorite food bhool jao$/,
                /^mera favorite food bhul jao$/
            ],
            key: "favoriteFood",
            label: "favorite food"
        },

        {
            patterns: [
                /^forget my favorite book$/,
                /^meri favorite book bhool jao$/,
                /^meri favorite book bhul jao$/
            ],
            key: "favoriteBook",
            label: "favorite book"
        },

        {
            patterns: [
                /^forget my favorite subject$/,
                /^mera favorite subject bhool jao$/,
                /^mera favorite subject bhul jao$/
            ],
            key: "favoriteSubject",
            label: "favorite subject"
        },

        {
            patterns: [
                /^forget my school$/,
                /^mera school bhool jao$/,
                /^mera school bhul jao$/
            ],
            key: "school",
            label: "school"
        },

        {
            patterns: [
                /^forget my class$/,
                /^meri class bhool jao$/,
                /^meri class bhul jao$/
            ],
            key: "class",
            label: "class"
        },

        {
            patterns: [
                /^forget my hobby$/,
                /^meri hobby bhool jao$/,
                /^meri hobby bhul jao$/
            ],
            key: "hobby",
            label: "hobby"
        },

        {
            patterns: [
                /^forget my city$/,
                /^meri city bhool jao$/,
                /^meri city bhul jao$/
            ],
            key: "city",
            label: "city"
        },

        {
            patterns: [
                /^forget my age$/,
                /^meri age bhool jao$/,
                /^meri age bhul jao$/
            ],
            key: "age",
            label: "age"
        }

    ];


    for (
        const item of forgetMap
    ) {

        if (
            item.patterns.some(
                pattern =>
                    pattern.test(t)
            )
        ) {

            if (
                !hasMemory(item.key)
            ) {

                return (
                    `I don't have your ${item.label} saved.`
                );
            }

            if (
                forgetMemory(item.key)
            ) {

                return (
                    `Okay, I've forgotten your ${item.label}.`
                );
            }

            return (
                `I couldn't forget your ${item.label}.`
            );
        }
    }


    return null;
}


// ==========================================
// PERSONAL FACT SAVE
// ==========================================

function handlePersonalFactSave(
    original
) {

    let match;


    // ======================================
    // FAVORITE FACTS - ENGLISH
    // ======================================

    match =
        original.match(
            /^my\s+(favorite|favourite)\s+(color|game|language|singer|food|book|subject)\s+is\s+(.+)$/i
        );

    if (match) {

        const type =
            match[2]
                .toLowerCase();

        const key =
            `favorite${type
                .charAt(0)
                .toUpperCase() +
                type.slice(1)
            }`;

        return savePersonalFact(
            key,
            match[3]
        );
    }


    // ======================================
    // FAVORITE FACTS - HINDI
    // ======================================

    match =
        original.match(
            /^(mera|meri)\s+(favorite|favourite)\s+(color|game|language|singer|food|book|subject)\s+(.+)\s+(hai|h)$/i
        );

    if (match) {

        const type =
            match[3]
                .toLowerCase();

        const key =
            `favorite${type
                .charAt(0)
                .toUpperCase() +
                type.slice(1)
            }`;

        return savePersonalFact(
            key,
            match[4]
        );
    }


    // ======================================
    // SCHOOL
    // ======================================

    match =
        original.match(
            /^my\s+school\s+is\s+(.+)$/i
        );

    if (!match) {

        match =
            original.match(
                /^mera\s+school\s+(.+)\s+(hai|h)$/i
            );
    }

    if (match) {

        return savePersonalFact(
            "school",
            match[match.length - 1]
        );
    }


    // ======================================
    // CLASS
    // ======================================

    match =
        original.match(
            /^my\s+class\s+is\s+([0-9]+[a-zA-Z]?)$/i
        );

    if (!match) {

        match =
            original.match(
                /^meri\s+class\s+([0-9]+[a-zA-Z]?)\s+(hai|h)$/i
            );
    }

    if (match) {

        return savePersonalFact(
            "class",
            match[1]
        );
    }


    // ======================================
    // HOBBY
    // ======================================

    match =
        original.match(
            /^my\s+hobby\s+is\s+(.+)$/i
        );

    if (!match) {

        match =
            original.match(
                /^meri\s+hobby\s+(.+)\s+(hai|h)$/i
            );
    }

    if (match) {

        return savePersonalFact(
            "hobby",
            match[match.length - 1]
        );
    }


    // ======================================
    // CITY
    // ======================================

    match =
        original.match(
            /^my\s+city\s+is\s+(.+)$/i
        );

    if (!match) {

        match =
            original.match(
                /^meri\s+city\s+(.+)\s+(hai|h)$/i
            );
    }

    if (match) {

        return savePersonalFact(
            "city",
            match[match.length - 1]
        );
    }


    // ======================================
    // AGE
    // ======================================

    match =
        original.match(
            /^my\s+age\s+is\s+([0-9]+)$/i
        );

    if (!match) {

        match =
            original.match(
                /^meri\s+age\s+([0-9]+)\s+(hai|h)$/i
            );
    }

    if (!match) {

        match =
            original.match(
                /^meri\s+umar\s+([0-9]+)\s+(hai|h)$/i
            );
    }

    if (match) {

        return savePersonalFact(
            "age",
            match[1]
        );
    }


    return null;
}


// ==========================================
// SAVE PERSONAL FACT HELPER
// ==========================================

function savePersonalFact(
    key,
    value
) {

    const cleanValue =
        cleanPersonalValue(value);

    if (
        !cleanValue ||
        isInvalidPersonalValue(
            cleanValue
        )
    ) {
        return null;
    }


    if (
        rememberFact(
            key,
            cleanValue
        )
    ) {

        const label =
            key
                .replace(
                    /([A-Z])/g,
                    " $1"
                )
                .toLowerCase();


        return (
            `Done! I'll remember your ${label} is ${cleanValue}.`
        );
    }


    return null;
}


// ==========================================
// MAIN PERSONAL MEMORY
// ==========================================

function handlePersonalMemory(
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


    // QUESTIONS FIRST
    const recall =
        handleNameRecall(original) ||
        handlePersonalRecall(original);

    if (recall) {
        return recall;
    }


    // FORGET
    const forgotten =
        handlePersonalForget(original);

    if (forgotten) {
        return forgotten;
    }


    // NEVER SAVE QUESTIONS
    if (
        isPersonalQuestion(
            original
        )
    ) {
        return null;
    }


    // NAME
    const nameSaved =
        handleNameSave(original);

    if (nameSaved) {
        return nameSaved;
    }


    // PERSONAL FACTS
    return handlePersonalFactSave(
        original
    );
}


// ==========================================
// LOAD
// ==========================================

console.log(
    "SHRI PersonalMemory.js V4.0 loaded successfully."
);