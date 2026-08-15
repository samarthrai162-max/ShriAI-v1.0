// ==========================================
// SHRI AI OS
// DYNAMIC MEMORY SYSTEM
// V4.0 PROFESSIONAL
// RELATIONSHIP + CUSTOM MEMORY
// ==========================================


// ==========================================
// NORMALIZE
// ==========================================

function normalizeDynamicText(message) {

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
            /\bkyaa\b/g,
            "kya"
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
// CLEAN LABEL
// ==========================================

function cleanDynamicLabel(label) {

    if (!label) {
        return "";
    }

    return String(label)

        .replace(
            /^(mera|meri|mere|my)\s+/i,
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

function cleanDynamicValue(value) {

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
// KEY
// ==========================================

function createDynamicKey(label) {

    const cleanLabel =
        cleanDynamicLabel(
            label
        );

    if (!cleanLabel) {
        return "";
    }

    return cleanLabel
        .toLowerCase()
        .replace(/\s+/g, "");
}


// ==========================================
// QUESTION WORDS
// ==========================================

function isInvalidDynamicValue(
    value
) {

    const t =
        normalizeDynamicText(
            value
        );

    return /^(kya|kaun|kon|what|who|whose|kaunsa|kaunsi|kaunse|konsa|konsi|konse)$/i
        .test(t);
}


// ==========================================
// DYNAMIC QUESTION DETECTOR
// ==========================================

function isDynamicMemoryQuestion(
    message
) {

    const t =
        normalizeDynamicText(
            message
        );

    if (!t) {
        return false;
    }

    return (

        /\bwhat\b/.test(t) ||

        /\bwho\b/.test(t) ||

        /\bwhose\b/.test(t) ||

        /\bkya\b/.test(t) ||

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
// RELATIONSHIP TYPES
// ==========================================

const RELATIONSHIP_TYPES = [

    "pet",
    "brother",
    "sister",
    "friend",
    "best friend"

];


// ==========================================
// SAVE DYNAMIC MEMORY
// ==========================================

function saveDynamicMemory(
    label,
    value
) {

    const cleanLabel =
        cleanDynamicLabel(
            label
        );

    const cleanValue =
        cleanDynamicValue(
            value
        );


    if (
        !cleanLabel ||
        !cleanValue
    ) {
        return null;
    }


    if (
        isInvalidDynamicValue(
            cleanValue
        )
    ) {
        return null;
    }


    const key =
        createDynamicKey(
            cleanLabel
        );


    if (!key) {
        return null;
    }


    if (
        rememberFact(
            key,
            cleanValue
        )
    ) {

        return (
            `Done! I'll remember your ${cleanLabel} is ${cleanValue}.`
        );
    }


    return null;
}


// ==========================================
// RECALL DYNAMIC MEMORY
// ==========================================

function recallDynamicMemory(
    label,
    type = "normal"
) {

    const cleanLabel =
        cleanDynamicLabel(
            label
        );

    const key =
        createDynamicKey(
            cleanLabel
        );

    const value =
        recallFact(key);


    if (!value) {

        if (
            type === "name"
        ) {

            return (
                `I don't know your ${cleanLabel}'s name yet.`
            );
        }

        return (
            `I don't know your ${cleanLabel} yet.`
        );
    }


    if (
        type === "name"
    ) {

        return (
            `Your ${cleanLabel}'s name is ${value}.`
        );
    }


    return (
        `Your ${cleanLabel} is ${value}.`
    );
}


// ==========================================
// RELATIONSHIP SAVE
// ==========================================

function handleRelationshipSave(
    original
) {

    let match;


    // --------------------------------------
    // HINDI
    // --------------------------------------

    match =
        original.match(
            /^(mera|meri|mere)\s+(pet|brother|sister|friend|best\s+friend)\s+(.+)\s+(hai|h)$/i
        );


    if (match) {

        return saveDynamicMemory(
            match[2],
            match[3]
        );
    }


    // --------------------------------------
    // ENGLISH
    // --------------------------------------

    match =
        original.match(
            /^my\s+(pet|brother|sister|friend|best\s+friend)\s+is\s+(.+)$/i
        );


    if (match) {

        return saveDynamicMemory(
            match[1],
            match[2]
        );
    }


    return null;
}


// ==========================================
// RELATIONSHIP RECALL
// ==========================================

function handleRelationshipRecall(
    original
) {

    const text =
        normalizeDynamicText(
            original
        );

    let match;


    // ======================================
    // HINDI NAME
    // ======================================

    match =
        text.match(
            /^(mera|meri|mere)\s+(pet|brother|sister|friend|best\s+friend)\s+ka\s+naam\s+(kya)\s+(hai|h)$/
        );


    if (match) {

        return recallDynamicMemory(
            match[2],
            "name"
        );
    }


    // ======================================
    // HINDI KAUN HAI
    // ======================================

    match =
        text.match(
            /^(mera|meri|mere)\s+(pet|brother|sister|friend|best\s+friend)\s+(kaun|kon)\s+(hai|h)$/
        );


    if (match) {

        return recallDynamicMemory(
            match[2]
        );
    }


    // ======================================
    // HINDI KYA HAI
    // ======================================

    match =
        text.match(
            /^(mera|meri|mere)\s+(pet|brother|sister|friend|best\s+friend)\s+(kya)\s+(hai|h)$/
        );


    if (match) {

        return recallDynamicMemory(
            match[2]
        );
    }


    // ======================================
    // KAUN SA / SI / SE
    // ======================================

    match =
        text.match(
            /^(mera|meri|mere)\s+(pet|brother|sister|friend|best\s+friend)\s+(kaun|kon)\s+(sa|si|se)\s+(hai|h)$/
        );


    if (match) {

        return recallDynamicMemory(
            match[2]
        );
    }


    // ======================================
    // COMPACT KAUNSA
    // ======================================

    match =
        text.match(
            /^(mera|meri|mere)\s+(pet|brother|sister|friend|best\s+friend)\s+(kaunsa|kaunsi|kaunse|konsa|konsi|konse)\s+(hai|h)$/
        );


    if (match) {

        return recallDynamicMemory(
            match[2]
        );
    }


    // ======================================
    // ENGLISH NAME
    // ======================================

    match =
        text.match(
            /^what(?:'s| is)\s+my\s+(pet|brother|sister|friend|best\s+friend)(?:'s)?\s+name$/
        );


    if (match) {

        return recallDynamicMemory(
            match[1],
            "name"
        );
    }


    // ======================================
    // ENGLISH NORMAL
    // ======================================

    match =
        text.match(
            /^what(?:'s| is)\s+my\s+(pet|brother|sister|friend|best\s+friend)$/
        );


    if (match) {

        return recallDynamicMemory(
            match[1]
        );
    }


    return null;
}


// ==========================================
// RELATIONSHIP FORGET
// ==========================================

function handleRelationshipForget(
    original
) {

    const text =
        normalizeDynamicText(
            original
        );


    const match =
        text.match(
            /^(?:forget|bhool jao|bhul jao)\s+(?:my|mera|meri|mere)\s+(pet|brother|sister|friend|best\s+friend)$/
        );


    if (!match) {
        return null;
    }


    const label =
        match[1];

    const key =
        createDynamicKey(
            label
        );


    if (
        !hasMemory(key)
    ) {

        return (
            `I don't have your ${label} saved.`
        );
    }


    if (
        forgetMemory(key)
    ) {

        return (
            `Okay, I've forgotten your ${label}.`
        );
    }


    return (
        `I couldn't forget your ${label}.`
    );
}


// ==========================================
// GENERIC FORGET
// ==========================================

function handleDynamicForget(
    original
) {

    const text =
        normalizeDynamicText(
            original
        );


    const match =
        text.match(
            /^(?:forget|bhool jao|bhul jao)\s+(?:my|mera|meri|mere)\s+(.+)$/
        );


    if (!match) {
        return null;
    }


    const label =
        cleanDynamicLabel(
            match[1]
        );


    if (!label) {
        return null;
    }


    // Relationship handled separately
    if (
        RELATIONSHIP_TYPES.includes(
            label
        )
    ) {
        return null;
    }


    const key =
        createDynamicKey(
            label
        );


    if (
        !hasMemory(key)
    ) {

        return (
            `I don't have your ${label} saved.`
        );
    }


    if (
        forgetMemory(key)
    ) {

        return (
            `Okay, I've forgotten your ${label}.`
        );
    }


    return (
        `I couldn't forget your ${label}.`
    );
}


// ==========================================
// GENERIC RECALL
// ==========================================

function handleGenericDynamicRecall(
    original
) {

    const text =
        normalizeDynamicText(
            original
        );


    // --------------------------------------
    // English
    // what is my hobby
    // what's my city
    // --------------------------------------

    let match =
        text.match(
            /^what(?:'s| is)\s+my\s+(.+)$/
        );


    if (match) {

        const label =
            cleanDynamicLabel(
                match[1]
            );


        if (
            !label ||
            RELATIONSHIP_TYPES.includes(label)
        ) {
            return null;
        }


        const key =
            createDynamicKey(
                label
            );


        if (
            !hasMemory(key)
        ) {

            return (
                `I don't know your ${label} yet.`
            );
        }


        return recallDynamicMemory(
            label
        );
    }


    // --------------------------------------
    // Hindi
    // mera hobby kya hai
    // meri city kya hai
    // --------------------------------------

    match =
        text.match(
            /^(mera|meri|mere)\s+(.+?)\s+(kya|kaun|kon)\s+(hai|h)$/
        );


    if (match) {

        const label =
            cleanDynamicLabel(
                match[2]
            );


        if (
            !label ||
            RELATIONSHIP_TYPES.includes(label)
        ) {
            return null;
        }


        return recallDynamicMemory(
            label
        );
    }


    // --------------------------------------
    // Hindi kaunsa / kaunsi
    // --------------------------------------

    match =
        text.match(
            /^(mera|meri|mere)\s+(.+?)\s+(kaunsa|kaunsi|kaunse|konsa|konsi|konse)\s+(hai|h)$/
        );


    if (match) {

        const label =
            cleanDynamicLabel(
                match[2]
            );


        if (
            !label ||
            RELATIONSHIP_TYPES.includes(label)
        ) {
            return null;
        }


        return recallDynamicMemory(
            label
        );
    }


    return null;
}


// ==========================================
// SINGLE DYNAMIC MEMORY
// ==========================================

function handleSingleMemory(
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


    // ======================================
    // RECALL FIRST
    // ======================================

    if (
        isDynamicMemoryQuestion(
            original
        )
    ) {

        return (

            handleRelationshipRecall(
                original
            ) ||

            handleGenericDynamicRecall(
                original
            )

        );
    }


    // ======================================
    // FORGET
    // ======================================

    const relationshipForget =
        handleRelationshipForget(
            original
        );

    if (relationshipForget) {
        return relationshipForget;
    }


    const genericForget =
        handleDynamicForget(
            original
        );

    if (genericForget) {
        return genericForget;
    }


    // ======================================
    // RELATIONSHIP SAVE
    // ======================================

    const relationship =
        handleRelationshipSave(
            original
        );


    if (relationship) {
        return relationship;
    }


    // ======================================
    // GENERIC ENGLISH
    // ======================================
    //
    // my hobby is gaming
    // my city is Delhi
    // my favorite thing is coding
    //
    // ======================================

    let match =
        original.match(
            /^my\s+([a-zA-Z][a-zA-Z\s]{1,40}?)\s+is\s+(.+)$/i
        );


    if (match) {

        const label =
            cleanDynamicLabel(
                match[1]
            );


        if (
            RELATIONSHIP_TYPES.includes(
                label.toLowerCase()
            )
        ) {

            return null;
        }


        return saveDynamicMemory(
            label,
            match[2]
        );
    }


    // ======================================
    // GENERIC HINDI
    // ======================================
    //
    // mera hobby gaming hai
    // meri city Delhi hai
    //
    // ======================================

    match =
        original.match(
            /^(mera|meri|mere)\s+([a-zA-Z][a-zA-Z\s]{1,40}?)\s+(.+)\s+(hai|h)$/i
        );


    if (match) {

        const label =
            cleanDynamicLabel(
                match[2]
            );

        const value =
            cleanDynamicValue(
                match[3]
            );


        if (
            RELATIONSHIP_TYPES.includes(
                label.toLowerCase()
            )
        ) {

            return null;
        }


        if (
            isInvalidDynamicValue(
                value
            )
        ) {
            return null;
        }


        return saveDynamicMemory(
            label,
            value
        );
    }


    return null;
}


// ==========================================
// MULTIPLE MEMORY
// ==========================================

function handleDynamicMemory(
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


    // ======================================
    // QUESTIONS NEVER SPLIT
    // ======================================

    if (
        isDynamicMemoryQuestion(
            original
        )
    ) {

        return handleSingleMemory(
            original
        );
    }


    // ======================================
    // FORGET NEVER SPLIT
    // ======================================

    if (
        /^(?:forget|bhool jao|bhul jao)\b/i
            .test(original)
    ) {

        return handleSingleMemory(
            original
        );
    }


    // ======================================
    // MULTIPLE SAVES
    // ======================================

    const sentences =
        original.split(
            /\s+(?:and|aur)\s+/i
        );


    if (
        sentences.length > 1
    ) {

        const results = [];


        for (
            const sentence of sentences
        ) {

            const result =
                handleSingleMemory(
                    sentence.trim()
                );


            if (result) {

                results.push(
                    result
                );
            }
        }


        if (
            results.length > 0
        ) {

            return results.join(" ");
        }
    }


    return handleSingleMemory(
        original
    );
}


// ==========================================
// LOAD
// ==========================================

console.log(
    "SHRI DynamicMemory.js V4.0 loaded successfully."
);