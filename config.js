// ===============================
// Shri AI OS Configuration
// ===============================

const SHRI_CONFIG = {

    // Default user name.
    // First-time user ke case mein Shri naam poochega.
    userName: "",

    aiName: "Shri",

    language: "Hinglish",

    wakeWord: "hey shri",

    voice: {
        enabled: true,
        language: "en-IN",
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


// ==========================================
// AI NAME
// ==========================================

const AI_NAME =
    SHRI_CONFIG.aiName;


// ==========================================
// CURRENT USER NAME
// ==========================================
//
// Memory se naam milega.
// Agar memory mein naam nahi hai,
// config ka fallback use hoga.
//

function getCurrentUserName() {

    try {

        if (
            typeof recall === "function"
        ) {

            const savedName =
                recall("userName");

            if (
                savedName &&
                String(savedName).trim()
            ) {

                return String(
                    savedName
                ).trim();
            }
        }

    } catch (error) {

        console.warn(
            "Unable to read user name:",
            error
        );

    }


    if (
        SHRI_CONFIG.userName &&
        String(
            SHRI_CONFIG.userName
        ).trim()
    ) {

        return String(
            SHRI_CONFIG.userName
        ).trim();

    }


    return null;

}


// ==========================================
// USER NAME SAVE
// ==========================================

function setCurrentUserName(name) {

    if (
        !name ||
        !String(name).trim()
    ) {

        return false;

    }


    const cleanName =
        String(name)
            .replace(/\s+/g, " ")
            .trim();


    try {

        if (
            typeof remember ===
            "function"
        ) {

            return remember(
                "userName",
                cleanName
            );

        }

    } catch (error) {

        console.error(
            "Unable to save user name:",
            error
        );

    }


    return false;

}


// ==========================================
// COMPATIBILITY
// ==========================================

const USER_NAME =
    getCurrentUserName();


console.log(
    "Config loaded."
);

console.log(
    "Current user:",
    getCurrentUserName() || "New user"
);