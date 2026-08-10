// ===============================
// Shri AI OS Configuration
// ===============================

const SHRI_CONFIG = {

    userName: "Samarth",

    aiName: "Shri",

    language: "Hinglish",

    wakeWord: "hey shri",

    voice: {
        enabled: true,
        rate: 0.95,
        pitch: 1.05,
        volume: 1
    },

    gemini: {
        enabled: false,
        apiKey: "",
        model: "gemini-2.5-flash"
    }

};

const USER_NAME = SHRI_CONFIG.userName;
const AI_NAME = SHRI_CONFIG.aiName;

console.log("Config loaded.");