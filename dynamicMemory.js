// ===============================
// Shri AI - Dynamic Memory
// ===============================

function handleDynamicMemory(message) {

    if (!message) return null;


    const sentences =
        message.split(/\s+(?:and|aur)\s+/i);


    // Multiple memories

    if (sentences.length > 1) {

        const saved = [];


        for (const sentence of sentences) {

            const result =
                handleSingleMemory(sentence.trim());


            if (
                result &&
                result.startsWith("Done!")
            ) {

                saved.push(result);

            }

        }


        if (saved.length > 0) {

            return saved.join(" ");

        }

    }


    return handleSingleMemory(message);

}


function handleSingleMemory(message) {

    if (!message) return null;


    const text = message
        .toLowerCase()
        .replace(/favourite/g, "favorite")
        .replace(/colour/g, "color");


    // ===============================
    // SAVE
    // ===============================

    const saveMatch =
        text.match(/^my (.+?) is (.+)$/i);


    if (saveMatch) {

        const key =
            saveMatch[1]
                .trim()
                .replace(/\s+/g, "");


        let value =
            message.match(/^my (.+?) is (.+)$/i);


        if (value && value[2]) {

            value = value[2]
                .replace(/\bhai\b/gi, "")
                .trim();


            rememberFact(key, value);


            return `Done! I'll remember your ${saveMatch[1]} is ${value}.`;

        }

    }


    // ===============================
    // RECALL
    // ===============================

    const recallMatch =
        text.match(/^what(?:'s| is) my (.+?)\??$/i);


    if (recallMatch) {

        const label =
            recallMatch[1].trim();


        const key =
            label
                .replace(/\?/g, "")
                .replace(/\s+/g, "");


        const value =
            recallFact(key);


        if (value) {

            return `Your ${label} is ${value}.`;

        }


        return `I don't know your ${label} yet.`;

    }


    return null;

}


console.log("DynamicMemory.js loaded.");