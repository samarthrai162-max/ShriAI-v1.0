// ==========================================
// Shri AI OS - Voice System v2
// ==========================================

let recognition = null;
let isListening = false;
let voices = [];


// ==========================================
// LOAD AVAILABLE VOICES
// ==========================================

function loadVoices() {

    if (!("speechSynthesis" in window)) {
        return;
    }

    voices = speechSynthesis.getVoices();

    console.log(
        "Shri voices loaded:",
        voices.length
    );
}


if ("speechSynthesis" in window) {

    speechSynthesis.onvoiceschanged =
        loadVoices;

    loadVoices();
}


// ==========================================
// CLEAN TEXT BEFORE SPEAKING
// ==========================================

function cleanSpeechText(text) {

    if (!text) {
        return "";
    }

    let cleaned = String(text);

    // Remove emojis
    cleaned = cleaned.replace(
        /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
        ""
    );

    // Remove extra spaces
    cleaned = cleaned.replace(
        /\s+/g,
        " "
    );

    return cleaned.trim();
}


// ==========================================
// TEXT TO SPEECH
// ==========================================

function speak(text) {

    if (!text) {
        return;
    }


    if (
        typeof SHRI_CONFIG !== "undefined" &&
        SHRI_CONFIG.voice &&
        !SHRI_CONFIG.voice.enabled
    ) {
        return;
    }


    if (!("speechSynthesis" in window)) {

        console.error(
            "Speech synthesis is not supported."
        );

        return;
    }


    const spokenText =
        cleanSpeechText(text);


    if (!spokenText) {
        return;
    }


    // Stop previous speech
    speechSynthesis.cancel();


    const utterance =
        new SpeechSynthesisUtterance(
            spokenText
        );


    // ======================================
    // VOICE SETTINGS
    // ======================================

    if (
        typeof SHRI_CONFIG !== "undefined" &&
        SHRI_CONFIG.voice
    ) {

        utterance.rate =
            SHRI_CONFIG.voice.rate ?? 1;

        utterance.pitch =
            SHRI_CONFIG.voice.pitch ?? 1;

        utterance.volume =
            SHRI_CONFIG.voice.volume ?? 1;

    } else {

        utterance.rate = 1;

        utterance.pitch = 1;

        utterance.volume = 1;

    }


    // ======================================
    // FIND PREFERRED VOICE
    // ======================================

    const preferredVoice =
        voices.find(voice =>
            /female|zira|samantha|google uk english female|google हिन्दी|hindi/i
                .test(voice.name)
        );


    if (preferredVoice) {

        utterance.voice =
            preferredVoice;

    }


    // ======================================
    // SPEECH EVENTS
    // ======================================

    utterance.onstart = function () {

        console.log(
            "Shri started speaking."
        );

    };


    utterance.onend = function () {

        console.log(
            "Shri finished speaking."
        );

    };


    utterance.onerror = function (event) {

        console.error(
            "Speech synthesis error:",
            event.error
        );

    };


    speechSynthesis.speak(
        utterance
    );

}


// ==========================================
// INITIALIZE SPEECH RECOGNITION
// ==========================================

function initVoiceRecognition() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        console.error(
            "Speech Recognition is not supported."
        );


        if (
            typeof setStatus === "function"
        ) {

            setStatus(
                "Voice recognition not supported"
            );

        }

        return false;

    }


    recognition =
        new SpeechRecognition();


    // ======================================
    // RECOGNITION SETTINGS
    // ======================================

    recognition.lang =
        "en-IN";

    recognition.continuous =
        false;

    recognition.interimResults =
        false;

    recognition.maxAlternatives =
        1;


    // ======================================
    // WHEN LISTENING STARTS
    // ======================================

    recognition.onstart =
        function () {

            isListening = true;


            if (
                typeof setStatus === "function"
            ) {

                setStatus(
                    "🎙️ Listening..."
                );

            }


            const mic =
                document.getElementById("mic");


            if (mic) {

                mic.classList.add(
                    "listening"
                );

            }


            console.log(
                "Shri listening..."
            );

        };


    // ======================================
    // SPEECH RESULT
    // ======================================

    recognition.onresult =
        async function (event) {

            try {

                let transcript =
                    event
                        .results[0][0]
                        .transcript
                        .trim();


                if (!transcript) {
                    return;
                }


                console.log(
                    "User said:",
                    transcript
                );


                // ==================================
                // SHOW USER MESSAGE
                // ==================================

                if (
                    typeof addUserMessage ===
                    "function"
                ) {

                    addUserMessage(
                        transcript
                    );

                }


                // ==================================
                // REMOVE WAKE WORD
                // ==================================

                let message =
                    transcript;


                message =
                    message.replace(
                        /^(hey|hi|hello)?\s*(shri|sri|shree|siri)[\s,]*/i,
                        ""
                    )
                    .trim();


                // ==================================
                // ONLY WAKE WORD
                // ==================================

                if (!message) {

                    const reply =
                        "Yes Samarth, I'm listening.";


                    if (
                        typeof addAIMessage ===
                        "function"
                    ) {

                        addAIMessage(
                            reply
                        );

                    }


                    speak(reply);

                    return;

                }


                // ==================================
                // PROCESS MESSAGE
                // ==================================

                let reply = null;


                if (
                    typeof processUserMessage ===
                    "function"
                ) {

                    reply =
                        await processUserMessage(
                            message
                        );

                } else {

                    console.error(
                        "processUserMessage() not found."
                    );

                    reply =
                        "Sorry, my brain is not connected yet.";

                }


                // ==================================
                // SHOW + SPEAK REPLY
                // ==================================

                if (reply) {

                    if (
                        typeof addAIMessage ===
                        "function"
                    ) {

                        addAIMessage(
                            reply
                        );

                    }


                    speak(reply);

                } else {

                    const fallback =
                        "I'm still learning that. Try asking me something else.";


                    if (
                        typeof addAIMessage ===
                        "function"
                    ) {

                        addAIMessage(
                            fallback
                        );

                    }


                    speak(fallback);

                }

            } catch (error) {

                console.error(
                    "Voice result error:",
                    error
                );

            }

        };


    // ======================================
    // VOICE ERROR
    // ======================================

    recognition.onerror =
        function (event) {

            console.error(
                "Voice recognition error:",
                event.error
            );


            switch (event.error) {

                case "not-allowed":

                    if (
                        typeof setStatus ===
                        "function"
                    ) {

                        setStatus(
                            "🎤 Microphone permission denied"
                        );

                    }

                    break;


                case "no-speech":

                    if (
                        typeof setStatus ===
                        "function"
                    ) {

                        setStatus(
                            "No speech detected"
                        );

                    }

                    break;


                case "audio-capture":

                    if (
                        typeof setStatus ===
                        "function"
                    ) {

                        setStatus(
                            "Microphone unavailable"
                        );

                    }

                    break;


                case "network":

                    if (
                        typeof setStatus ===
                        "function"
                    ) {

                        setStatus(
                            "Voice network error"
                        );

                    }

                    break;


                default:

                    if (
                        typeof setStatus ===
                        "function"
                    ) {

                        setStatus(
                            "Voice error: " +
                            event.error
                        );

                    }

                    break;

            }

        };


    // ======================================
    // RECOGNITION ENDED
    // ======================================

    recognition.onend =
        function () {

            isListening = false;


            const mic =
                document.getElementById("mic");


            if (mic) {

                mic.classList.remove(
                    "listening"
                );

            }


            if (
                typeof setStatus ===
                "function"
            ) {

                setStatus(
                    "Ready to Listen..."
                );

            }


            console.log(
                "Shri stopped listening."
            );

        };


    return true;

}


// ==========================================
// START / STOP LISTENING
// ==========================================

function startListening() {

    // Initialize recognition
    if (!recognition) {

        const ready =
            initVoiceRecognition();


        if (!ready) {
            return;
        }

    }


    // Stop if already listening
    if (isListening) {

        try {

            recognition.stop();

        } catch (error) {

            console.error(
                "Stop recognition error:",
                error
            );

        }

        return;

    }


    // Start listening
    try {

        recognition.start();

    } catch (error) {

        console.error(
            "Could not start recognition:",
            error
        );


        // Recognition may already be running
        if (
            typeof setStatus ===
            "function"
        ) {

            setStatus(
                "Ready to Listen..."
            );

        }

    }

}


// ==========================================
// VOICE SYSTEM READY
// ==========================================

console.log(
    "Shri Voice System v2 loaded successfully."
);