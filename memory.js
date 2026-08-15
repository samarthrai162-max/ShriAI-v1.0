// ==========================================
// SHRI AI OS
// MEMORY SYSTEM
// V4.0 PROFESSIONAL
// CORE STORAGE + SAFE STORAGE + CONTEXT
// ==========================================

const MEMORY_KEY = "SHRI_AI_MEMORY";
const MEMORY_VERSION = 4;


// ==========================================
// GET ALL MEMORY
// ==========================================

function getMemory() {

    try {

        const data =
            localStorage.getItem(MEMORY_KEY);

        if (!data) {
            return {};
        }

        const memory =
            JSON.parse(data);

        if (
            !memory ||
            typeof memory !== "object" ||
            Array.isArray(memory)
        ) {
            return {};
        }

        return memory;

    } catch (error) {

        console.error(
            "SHRI Memory Read Error:",
            error
        );

        return {};
    }
}


// ==========================================
// SAVE ALL MEMORY
// ==========================================

function saveMemory(memory) {

    try {

        if (
            !memory ||
            typeof memory !== "object" ||
            Array.isArray(memory)
        ) {
            return false;
        }

        localStorage.setItem(
            MEMORY_KEY,
            JSON.stringify(memory)
        );

        return true;

    } catch (error) {

        console.error(
            "SHRI Memory Save Error:",
            error
        );

        return false;
    }
}


// ==========================================
// NORMALIZE MEMORY KEY
// ==========================================

function normalizeMemoryKey(key) {

    if (
        key === null ||
        key === undefined
    ) {
        return "";
    }

    return String(key)
        .toLowerCase()
        .trim()

        .replace(/['’]/g, "")

        .replace(
            /favourite/g,
            "favorite"
        )

        .replace(
            /colour/g,
            "color"
        )

        .replace(
            /[?.!,]/g,
            ""
        )

        .replace(
            /\s+/g,
            ""
        );
}


// ==========================================
// CLEAN STORED VALUE
// ==========================================

function cleanStoredMemoryValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/\s+/g, " ")
        .trim();
}


// ==========================================
// REMEMBER
// ==========================================

function remember(key, value) {

    const normalizedKey =
        normalizeMemoryKey(key);

    const cleanValue =
        cleanStoredMemoryValue(value);

    if (
        !normalizedKey ||
        !cleanValue
    ) {
        return false;
    }

    try {

        const memory =
            getMemory();

        memory[normalizedKey] =
            cleanValue;

        return saveMemory(memory);

    } catch (error) {

        console.error(
            "SHRI Remember Error:",
            error
        );

        return false;
    }
}


// ==========================================
// RECALL
// ==========================================

function recall(key) {

    const normalizedKey =
        normalizeMemoryKey(key);

    if (!normalizedKey) {
        return null;
    }

    try {

        const memory =
            getMemory();

        if (
            !Object.prototype.hasOwnProperty.call(
                memory,
                normalizedKey
            )
        ) {
            return null;
        }

        const value =
            memory[normalizedKey];

        if (
            value === null ||
            value === undefined
        ) {
            return null;
        }

        return String(value).trim() || null;

    } catch (error) {

        console.error(
            "SHRI Recall Error:",
            error
        );

        return null;
    }
}


// ==========================================
// REMEMBER FACT
// ==========================================

function rememberFact(key, value) {

    return remember(
        key,
        value
    );
}


// ==========================================
// RECALL FACT
// ==========================================

function recallFact(key) {

    return recall(key);
}


// ==========================================
// HAS MEMORY
// ==========================================

function hasMemory(key) {

    const value =
        recall(key);

    return (
        value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
    );
}


// ==========================================
// FORGET ONE MEMORY
// ==========================================

function forgetMemory(key) {

    const normalizedKey =
        normalizeMemoryKey(key);

    if (!normalizedKey) {
        return false;
    }

    try {

        const memory =
            getMemory();

        if (
            !Object.prototype.hasOwnProperty.call(
                memory,
                normalizedKey
            )
        ) {
            return false;
        }

        delete memory[normalizedKey];

        return saveMemory(memory);

    } catch (error) {

        console.error(
            "SHRI Forget Error:",
            error
        );

        return false;
    }
}


// ==========================================
// UPDATE MEMORY
// ==========================================
// Task 1:
// Existing value ko safely replace/update karta hai.
// ==========================================

function updateMemory(key, value) {

    return remember(
        key,
        value
    );
}


// ==========================================
// FORGET MANY
// ==========================================

function forgetMemories(keys) {

    if (!Array.isArray(keys)) {
        return false;
    }

    let changed = false;

    for (const key of keys) {

        if (
            forgetMemory(key)
        ) {
            changed = true;
        }
    }

    return changed;
}


// ==========================================
// CLEAR ALL MEMORY
// ==========================================

function clearMemory() {

    try {

        localStorage.removeItem(
            MEMORY_KEY
        );

        return true;

    } catch (error) {

        console.error(
            "SHRI Clear Memory Error:",
            error
        );

        return false;
    }
}


// ==========================================
// MEMORY COUNT
// ==========================================

function getMemoryCount() {

    try {

        return Object.keys(
            getMemory()
        ).length;

    } catch (error) {

        return 0;
    }
}


// ==========================================
// DEBUG
// ==========================================

function showMemory() {

    const memory =
        getMemory();

    console.log(
        "=============================="
    );

    console.log(
        "SHRI AI MEMORY"
    );

    console.log(
        memory
    );

    console.log(
        "Memory Count:",
        Object.keys(memory).length
    );

    console.log(
        "Memory Version:",
        MEMORY_VERSION
    );

    console.log(
        "=============================="
    );

    return memory;
}


// ==========================================
// CONTEXT MEMORY
// ==========================================

function saveContext(key, value) {

    if (
        !key ||
        value === null ||
        value === undefined
    ) {
        return false;
    }

    return remember(
        `context_${key}`,
        value
    );
}


// ==========================================
// GET CONTEXT
// ==========================================

function getContext(key) {

    if (!key) {
        return null;
    }

    return recall(
        `context_${key}`
    );
}


// ==========================================
// DELETE CONTEXT
// ==========================================

function forgetContext(key) {

    if (!key) {
        return false;
    }

    return forgetMemory(
        `context_${key}`
    );
}


// ==========================================
// MEMORY EXPORT
// ==========================================

function exportMemory() {

    try {

        return JSON.stringify(
            getMemory()
        );

    } catch (error) {

        console.error(
            "Memory Export Error:",
            error
        );

        return "{}";
    }
}


// ==========================================
// MEMORY IMPORT
// ==========================================

function importMemory(data) {

    try {

        let imported;

        if (
            typeof data === "string"
        ) {

            imported =
                JSON.parse(data);

        } else {

            imported = data;
        }

        if (
            !imported ||
            typeof imported !== "object" ||
            Array.isArray(imported)
        ) {
            return false;
        }

        return saveMemory(
            imported
        );

    } catch (error) {

        console.error(
            "Memory Import Error:",
            error
        );

        return false;
    }
}


// ==========================================
// MEMORY STATUS
// ==========================================

function getMemoryStatus() {

    const memory =
        getMemory();

    return {

        version:
            MEMORY_VERSION,

        key:
            MEMORY_KEY,

        count:
            Object.keys(memory).length,

        available:
            true

    };
}


// ==========================================
// LOAD
// ==========================================

console.log(
    "SHRI Memory.js V4.0 loaded successfully."
);