// ===============================
// Shri AI OS - Main Controller
// ===============================


async function processUserMessage(message) {

    if (!message) {

        return null;

    }


    console.log(
        "User:",
        message
    );


    // Save latest context

    saveContext(
        "lastMessage",
        message
    );


    // Brain processing

    const reply =
        handleBrain(message);


    if (reply) {

        console.log(
            "Shri:",
            reply
        );


        return reply;

    }


    // Optional Gemini fallback

    if (
        SHRI_CONFIG.gemini.enabled &&
        SHRI_CONFIG.gemini.apiKey
    ) {

        return await askGemini(message);

    }


    return "I'm still learning that. Try asking me something else.";
}


// ===============================
// Gemini
// ===============================

async function askGemini(message) {

    try {

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/${SHRI_CONFIG.gemini.model}:generateContent?key=${SHRI_CONFIG.gemini.apiKey}`;


        const userName =
            typeof getCurrentUserName ===
            "function"
                ? getCurrentUserName()
                : null;


        const identity =
            userName
                ? `a friendly Hinglish personal assistant for ${userName}`
                : "a friendly Hinglish personal assistant";


        const response =
            await fetch(
                url,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        contents: [

                            {

                                parts: [

                                    {

                                        text:
                                            `You are Shri AI, ${identity}. Be helpful, respectful and concise.

User: ${message}`

                                    }

                                ]

                            }

                        ]

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `API error: ${response.status}`
            );

        }


        const data =
            await response.json();


        const reply =
            data
                ?.candidates?.[0]
                ?.content?.parts?.[0]
                ?.text;


        if (reply) {

            return reply;

        }


        return "I couldn't generate a response.";

    } catch (error) {

        console.error(
            "Gemini error:",
            error
        );


        return "I couldn't connect to my AI brain right now.";

    }

}


// ===============================
// Microphone
// ===============================

function setupMicrophone() {

    const mic =
        document.getElementById("mic");


    if (!mic) {

        console.error(
            "Microphone button not found."
        );

        return;

    }


    mic.addEventListener(
        "click",
        startListening
    );


    console.log(
        "Microphone connected."
    );

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupMicrophone
    );

} else {

    setupMicrophone();

}


console.log(
    "Script.js loaded successfully."
);