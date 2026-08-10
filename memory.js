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