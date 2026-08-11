// ==========================================
// Shri AI OS - Voice System v3
// Android Native TTS + Web Speech
// ==========================================

let recognition = null;
let isListening = false;
let voices = [];


// ==========================================
// LOAD VOICES
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
// CLEAN TEXT
// ==========================================

function cleanSpeechText(text) {

    if (!text) {
        return "";
    }

    let cleaned = String(text);

    cleaned = cleaned.replace(
        /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
        ""
    );

    cleaned = cleaned.replace(
        /\s+/g,
        " "
    );

    return cleaned.trim();
}


// ==========================================
// ANDROID NATIVE TTS
// ==========================================
function speak(text) {

    if (!text) {
        return;
    }

    const spokenText = cleanSpeechText(text);

    if (!spokenText) {
        return;
    }

    // ==========================================
    // ANDROID NATIVE TTS
    // ==========================================

    if (
        typeof AndroidTTS !== "undefined" &&
        typeof AndroidTTS.speak === "function"
    ) {
        try {
            AndroidTTS.speak(spokenText);
            return;
        } catch (error) {
            console.error(
                "Android TTS failed:",
                error
            );
        }
    }

    // ==========================================
    // BROWSER TTS FALLBACK
    // ==========================================

    if (!("speechSynthesis" in window)) {
        console.error(
            "Speech synthesis is not supported."
        );
        return;
    }

    speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(
            spokenText
        );

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(
        utterance
    );
}
function speakNative(text) {

    const cleaned =
        cleanSpeechText(text);

    if (!cleaned) {
        return false;
    }

    if (
        typeof window.AndroidTTS !== "undefined" &&
        typeof window.AndroidTTS.speak === "function"
    ) {

        try {

            window.AndroidTTS.speak(
                cleaned
            );

            console.log(
                "Shri speaking using Android TTS"
            );

            return true;

        } catch (error) {

            console.error(
                "Android TTS error:",
                error
            );
        }
    }

    return false;
}


// ==========================================
// WEBVIEW SPEECH SYNTHESIS FALLBACK
// ==========================================

function speakWeb(text) {

    if (!("speechSynthesis" in window)) {
        return false;
    }

    const cleaned =
        cleanSpeechText(text);

    if (!cleaned) {
        return false;
    }

    try {

        speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                cleaned
            );

        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        const preferredVoice =
            voices.find(
                voice =>
                    /hindi|india|zira|samantha|female/i
                        .test(voice.name)
            );

        if (preferredVoice) {

            utterance.voice =
                preferredVoice;
        }

        utterance.lang =
            "en-IN";

        utterance.onstart =
            function () {

                console.log(
                    "Web TTS started"
                );
            };

        utterance.onerror =
            function (event) {

                console.error(
                    "Web TTS error:",
                    event.error
                );
            };

        speechSynthesis.speak(
            utterance
        );

        return true;

    } catch (error) {

        console.error(
            "Web TTS failed:",
            error
        );

        return false;
    }
}


// ==========================================
// MAIN SPEAK FUNCTION
// ==========================================

function speak(text) {

    const cleaned =
        cleanSpeechText(text);

    if (!cleaned) {
        return;
    }

    if (
        typeof SHRI_CONFIG !== "undefined" &&
        SHRI_CONFIG.voice &&
        SHRI_CONFIG.voice.enabled === false
    ) {

        console.log(
            "Shri voice disabled in config"
        );

        return;
    }


    // ======================================
    // FIRST: ANDROID NATIVE TTS
    // ======================================

    const nativeStarted =
        speakNative(cleaned);

    if (nativeStarted) {
        return;
    }


    // ======================================
    // FALLBACK: WEB TTS
    // ======================================

    speakWeb(cleaned);
}


// ==========================================
// STOP SPEAKING
// ==========================================

function stopSpeaking() {

    try {

        if (
            typeof window.AndroidTTS !== "undefined" &&
            typeof window.AndroidTTS.stop === "function"
        ) {

            window.AndroidTTS.stop();
        }

    } catch (error) {

        console.error(
            "Native TTS stop error:",
            error
        );
    }


    try {

        if ("speechSynthesis" in window) {

            speechSynthesis.cancel();
        }

    } catch (error) {

        console.error(
            "Web TTS stop error:",
            error
        );
    }
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


    recognition.lang =
        "en-IN";

    recognition.continuous =
        false;

    recognition.interimResults =
        false;

    recognition.maxAlternatives =
        1;


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
        };


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


                if (
                    typeof addUserMessage ===
                    "function"
                ) {

                    addUserMessage(
                        transcript
                    );
                }


                let message =
                    transcript;


                message =
                    message.replace(
                        /^(hey|hi|hello)?\s*(shri|sri|shree|siri)[\s,]*/i,
                        ""
                    )
                    .trim();


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

                    reply =
                        "Sorry, my brain is not connected yet.";
                }


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


    recognition.onerror =
        function (event) {

            console.error(
                "Voice recognition error:",
                event.error
            );

            if (
                typeof setStatus ===
                "function"
            ) {

                setStatus(
                    "Voice error: " +
                    event.error
                );
            }
        };


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
        };


    return true;
}


// ==========================================
// START / STOP LISTENING
// ==========================================

function startListening() {

    if (!recognition) {

        const ready =
            initVoiceRecognition();

        if (!ready) {
            return;
        }
    }


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


    try {

        recognition.start();

    } catch (error) {

        console.error(
            "Could not start recognition:",
            error
        );

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
// READY
// ==========================================

console.log(
    "Shri Voice System v3 loaded successfully."
);