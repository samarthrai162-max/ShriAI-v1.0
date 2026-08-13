// ============================================================
// SHRI AI OS V1.5
// PROFESSIONAL VOICE ENGINE
// ============================================================
//
// Features:
// • Android Native TTS
// • Web Speech TTS fallback
// • Speech Recognition
// • Hinglish / Indian English support
// • Wake-word cleanup
// • Mic state management
// • Duplicate speak prevention
// • Safe error handling
// • Config-based voice settings
// • AndroidTTS bridge compatibility
//
// Android bridge name:
//     AndroidTTS
//
// Expected external functions:
//     addUserMessage()
//     addAIMessage()
//     processUserMessage()
//     setStatus()
// ============================================================


"use strict";


// ============================================================
// GLOBAL STATE
// ============================================================

let recognition = null;

let isListening = false;

let isRecognitionStarting = false;

let voices = [];

let speechSupported = false;

let recognitionSupported = false;

let lastSpokenText = "";

let lastSpeechTime = 0;

let recognitionRequestId = 0;


// ============================================================
// CONSTANTS
// ============================================================

const SHRI_VOICE_DEFAULTS = {

    language: "en-IN",

    rate: 1.0,

    pitch: 1.0,

    volume: 1.0,

    maxAlternatives: 1,

    continuous: false,

    interimResults: false

};


// ============================================================
// SAFE CONFIG ACCESS
// ============================================================

function getVoiceConfig() {

    const defaults = {
        ...SHRI_VOICE_DEFAULTS
    };

    try {

        if (
            typeof SHRI_CONFIG !== "undefined" &&
            SHRI_CONFIG &&
            SHRI_CONFIG.voice
        ) {

            const config =
                SHRI_CONFIG.voice;

            if (
                typeof config.language ===
                "string" &&
                config.language.trim()
            ) {

                defaults.language =
                    config.language.trim();
            }

            if (
                typeof config.rate ===
                "number"
            ) {

                defaults.rate =
                    clamp(
                        config.rate,
                        0.5,
                        2.0
                    );
            }

            if (
                typeof config.pitch ===
                "number"
            ) {

                defaults.pitch =
                    clamp(
                        config.pitch,
                        0.5,
                        2.0
                    );
            }

            if (
                typeof config.volume ===
                "number"
            ) {

                defaults.volume =
                    clamp(
                        config.volume,
                        0.0,
                        1.0
                    );
            }

            if (
                typeof config.continuous ===
                "boolean"
            ) {

                defaults.continuous =
                    config.continuous;
            }

            if (
                typeof config.interimResults ===
                "boolean"
            ) {

                defaults.interimResults =
                    config.interimResults;
            }
        }

    } catch (error) {

        console.warn(
            "Shri voice config error:",
            error
        );
    }

    return defaults;
}


// ============================================================
// NUMBER CLAMP
// ============================================================

function clamp(
    value,
    min,
    max
) {

    return Math.min(
        Math.max(
            value,
            min
        ),
        max
    );
}


// ============================================================
// SAFE STATUS
// ============================================================

function setVoiceStatus(
    message
) {

    try {

        if (
            typeof setStatus ===
            "function"
        ) {

            setStatus(
                String(message)
            );
        }

    } catch (error) {

        console.warn(
            "Status update failed:",
            error
        );
    }
}


// ============================================================
// MIC UI STATE
// ============================================================

function setMicListeningState(
    listening
) {

    try {

        const mic =
            document.getElementById(
                "mic"
            );

        if (!mic) {
            return;
        }

        if (listening) {

            mic.classList.add(
                "listening"
            );

            mic.setAttribute(
                "aria-pressed",
                "true"
            );

        } else {

            mic.classList.remove(
                "listening"
            );

            mic.setAttribute(
                "aria-pressed",
                "false"
            );
        }

    } catch (error) {

        console.warn(
            "Mic UI update failed:",
            error
        );
    }
}


// ============================================================
// SPEECH SYNTHESIS SUPPORT
// ============================================================

function isWebSpeechTTSAvailable() {

    return (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !==
            "undefined"
    );
}


// ============================================================
// SPEECH RECOGNITION SUPPORT
// ============================================================

function getSpeechRecognitionConstructor() {

    if (
        typeof window ===
        "undefined"
    ) {

        return null;
    }

    return (
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        null
    );
}


// ============================================================
// LOAD AVAILABLE WEB VOICES
// ============================================================

function loadVoices() {

    if (
        !isWebSpeechTTSAvailable()
    ) {

        voices = [];

        return;
    }

    try {

        voices =
            speechSynthesis.getVoices()
                || [];

        console.log(
            "Shri Web voices loaded:",
            voices.length
        );

    } catch (error) {

        voices = [];

        console.warn(
            "Unable to load Web voices:",
            error
        );
    }
}


// ============================================================
// INITIALIZE WEB VOICE LIST
// ============================================================

function initializeVoiceList() {

    if (
        !isWebSpeechTTSAvailable()
    ) {

        return;
    }

    try {

        speechSynthesis.onvoiceschanged =
            loadVoices;

        loadVoices();

    } catch (error) {

        console.warn(
            "Voice list initialization failed:",
            error
        );
    }
}


// ============================================================
// CLEAN TEXT FOR SPEECH
// ============================================================

function cleanSpeechText(
    text
) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";
    }

    let cleaned =
        String(text);


    // --------------------------------------------------------
    // Remove HTML
    // --------------------------------------------------------

    cleaned =
        cleaned.replace(
            /<[^>]*>/g,
            " "
        );


    // --------------------------------------------------------
    // Remove code fences
    // --------------------------------------------------------

    cleaned =
        cleaned.replace(
            /```[\s\S]*?```/g,
            " "
        );


    // --------------------------------------------------------
    // Remove markdown emphasis
    // --------------------------------------------------------

    cleaned =
        cleaned.replace(
            /[*_~`]/g,
            ""
        );


    // --------------------------------------------------------
    // Remove emoji / pictographic characters
    // --------------------------------------------------------

    try {

        cleaned =
            cleaned.replace(
                /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
                ""
            );

    } catch (error) {

        // Older WebView fallback.
        cleaned =
            cleaned.replace(
                /[\u{1F300}-\u{1FAFF}]/gu,
                ""
            );
    }


    // --------------------------------------------------------
    // Normalize whitespace
    // --------------------------------------------------------

    cleaned =
        cleaned.replace(
            /\s+/g,
            " "
        );


    // --------------------------------------------------------
    // Remove excessive punctuation
    // --------------------------------------------------------

    cleaned =
        cleaned.replace(
            /([!?.,])\1{2,}/g,
            "$1"
        );


    return cleaned.trim();
}


// ============================================================
// CHECK WHETHER VOICE IS ENABLED
// ============================================================

function isVoiceEnabled() {

    try {

        if (
            typeof SHRI_CONFIG !==
            "undefined" &&
            SHRI_CONFIG &&
            SHRI_CONFIG.voice &&
            SHRI_CONFIG.voice.enabled ===
                false
        ) {

            return false;
        }

    } catch (error) {

        console.warn(
            "Voice config check failed:",
            error
        );
    }

    return true;
}


// ============================================================
// ANDROID TTS AVAILABILITY
// ============================================================

function isAndroidTTSAvailable() {

    try {

        return (
            typeof window !==
                "undefined" &&
            typeof window.AndroidTTS !==
                "undefined" &&
            typeof window.AndroidTTS.speak ===
                "function"
        );

    } catch (error) {

        return false;
    }
}


// ============================================================
// ANDROID TTS READY CHECK
// ============================================================

function isAndroidTTSReady() {

    if (
        !isAndroidTTSAvailable()
    ) {

        return false;
    }

    try {

        if (
            typeof window.AndroidTTS
                .isReady ===
            "function"
        ) {

            return (
                window.AndroidTTS
                    .isReady() === true
            );
        }

        // Older bridge versions may not
        // expose isReady().
        return true;

    } catch (error) {

        console.warn(
            "Android TTS readiness check failed:",
            error
        );

        return false;
    }
}


// ============================================================
// NATIVE ANDROID TTS
// ============================================================

function speakNative(
    text
) {

    const cleaned =
        cleanSpeechText(text);

    if (!cleaned) {
        return false;
    }

    if (
        !isAndroidTTSAvailable()
    ) {

        return false;
    }

    try {

        if (
            !isAndroidTTSReady()
        ) {

            console.warn(
                "Android TTS is not ready."
            );

            return false;
        }


        window.AndroidTTS.speak(
            cleaned
        );


        console.log(
            "Shri speaking with Android Native TTS"
        );


        return true;

    } catch (error) {

        console.error(
            "Android Native TTS error:",
            error
        );

        return false;
    }
}


// ============================================================
// FIND BEST WEB VOICE
// ============================================================

function findPreferredVoice(
    language
) {

    if (
        !voices ||
        voices.length === 0
    ) {

        return null;
    }


    const normalizedLanguage =
        String(
            language ||
            "en-IN"
        ).toLowerCase();


    // --------------------------------------------------------
    // Exact language match
    // --------------------------------------------------------

    let voice =
        voices.find(
            item => {

                const lang =
                    String(
                        item.lang ||
                        ""
                    ).toLowerCase();

                return (
                    lang ===
                    normalizedLanguage
                );
            }
        );


    if (voice) {
        return voice;
    }


    // --------------------------------------------------------
    // Indian English
    // --------------------------------------------------------

    voice =
        voices.find(
            item => {

                const lang =
                    String(
                        item.lang ||
                        ""
                    ).toLowerCase();

                return (
                    lang.includes("en-in")
                );
            }
        );


    if (voice) {
        return voice;
    }


    // --------------------------------------------------------
    // Hindi
    // --------------------------------------------------------

    voice =
        voices.find(
            item => {

                const lang =
                    String(
                        item.lang ||
                        ""
                    ).toLowerCase();

                return (
                    lang.startsWith("hi")
                );
            }
        );


    if (voice) {
        return voice;
    }


    // --------------------------------------------------------
    // English
    // --------------------------------------------------------

    voice =
        voices.find(
            item => {

                const lang =
                    String(
                        item.lang ||
                        ""
                    ).toLowerCase();

                return (
                    lang.startsWith("en")
                );
            }
        );


    return voice || null;
}


// ============================================================
// WEB TTS FALLBACK
// ============================================================

function speakWeb(
    text
) {

    const cleaned =
        cleanSpeechText(text);

    if (!cleaned) {
        return false;
    }


    if (
        !isWebSpeechTTSAvailable()
    ) {

        console.error(
            "Web Speech Synthesis is not supported."
        );

        return false;
    }


    const config =
        getVoiceConfig();


    try {

        speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                cleaned
            );


        utterance.rate =
            config.rate;

        utterance.pitch =
            config.pitch;

        utterance.volume =
            config.volume;

        utterance.lang =
            config.language;


        const preferredVoice =
            findPreferredVoice(
                config.language
            );


        if (preferredVoice) {

            utterance.voice =
                preferredVoice;
        }


        utterance.onstart =
            function () {

                console.log(
                    "Shri Web TTS started"
                );
            };


        utterance.onend =
            function () {

                console.log(
                    "Shri Web TTS finished"
                );
            };


        utterance.onerror =
            function (event) {

                console.error(
                    "Shri Web TTS error:",
                    event?.error ||
                    "unknown"
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


// ============================================================
// MAIN SPEAK FUNCTION
// ============================================================

function speak(
    text
) {

    if (!isVoiceEnabled()) {

        console.log(
            "Shri voice disabled."
        );

        return false;
    }


    const cleaned =
        cleanSpeechText(text);


    if (!cleaned) {
        return false;
    }


    // --------------------------------------------------------
    // Prevent accidental duplicate speech
    // --------------------------------------------------------

    const now =
        Date.now();


    if (
        cleaned === lastSpokenText &&
        now - lastSpeechTime < 500
    ) {

        console.log(
            "Duplicate speech ignored."
        );

        return false;
    }


    lastSpokenText =
        cleaned;

    lastSpeechTime =
        now;


    // --------------------------------------------------------
    // Android Native TTS FIRST
    // --------------------------------------------------------

    if (
        speakNative(cleaned)
    ) {

        return true;
    }


    // --------------------------------------------------------
    // Browser TTS FALLBACK
    // --------------------------------------------------------

    return speakWeb(
        cleaned
    );
}


// ============================================================
// STOP ALL SPEECH
// ============================================================

function stopSpeaking() {

    try {

        if (
            typeof window !==
                "undefined" &&
            window.AndroidTTS &&
            typeof window.AndroidTTS.stop ===
                "function"
        ) {

            window.AndroidTTS.stop();
        }

    } catch (error) {

        console.warn(
            "Android TTS stop failed:",
            error
        );
    }


    try {

        if (
            isWebSpeechTTSAvailable()
        ) {

            speechSynthesis.cancel();
        }

    } catch (error) {

        console.warn(
            "Web TTS stop failed:",
            error
        );
    }


    lastSpokenText = "";

    lastSpeechTime = 0;
}


// ============================================================
// EXTRACT USER MESSAGE
// ============================================================

function removeShriWakeWord(
    text
) {

    if (!text) {
        return "";
    }


    let message =
        String(text)
            .trim();


    // --------------------------------------------------------
    // Optional greetings + Shri
    // --------------------------------------------------------

    message =
        message.replace(
            /^(hey|hi|hello|ok|okay)?\s*(shri|sri|shree|siri)\s*[,:\-]?\s*/i,
            ""
        );


    return message.trim();
}


// ============================================================
// HANDLE RECOGNIZED SPEECH
// ============================================================

async function handleVoiceResult(
    transcript
) {

    const originalText =
        String(
            transcript ||
            ""
        ).trim();


    if (!originalText) {

        setVoiceStatus(
            "I didn't hear anything."
        );

        return;
    }


    console.log(
        "Shri heard:",
        originalText
    );


    // --------------------------------------------------------
    // Show original user speech
    // --------------------------------------------------------

    try {

        if (
            typeof addUserMessage ===
            "function"
        ) {

            addUserMessage(
                originalText
            );
        }

    } catch (error) {

        console.warn(
            "Unable to add user voice message:",
            error
        );
    }


    // --------------------------------------------------------
    // Remove optional wake word
    // --------------------------------------------------------

    const message =
        removeShriWakeWord(
            originalText
        );


    // --------------------------------------------------------
    // User only said "Shri"
    // --------------------------------------------------------

    if (!message) {

        const userName =
    typeof getCurrentUserName === "function"
        ? getCurrentUserName()
        : null;

const reply =
    userName
        ? `Yes ${userName}, I'm listening.`
        : "Yes, I'm listening. What should I call you?";


        try {

            if (
                typeof addAIMessage ===
                "function"
            ) {

                addAIMessage(
                    reply
                );
            }

        } catch (error) {

            console.warn(
                "Unable to add AI message:",
                error
            );
        }


        speak(reply);

        return;
    }


    // --------------------------------------------------------
    // AI processing
    // --------------------------------------------------------

    let reply = null;


    try {

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
                "Sorry, my AI brain is not connected yet.";
        }

    } catch (error) {

        console.error(
            "Voice AI processing error:",
            error
        );

        reply =
            "Sorry, something went wrong while processing that.";
    }


    // --------------------------------------------------------
    // AI response
    // --------------------------------------------------------

    if (
        reply !== null &&
        reply !== undefined &&
        String(reply).trim()
    ) {

        const response =
            String(reply).trim();


        try {

            if (
                typeof addAIMessage ===
                "function"
            ) {

                addAIMessage(
                    response
                );
            }

        } catch (error) {

            console.warn(
                "Unable to add AI response:",
                error
            );
        }


        speak(response);


    } else {

        const fallback =
            "I'm still learning that. Try asking me something else.";


        try {

            if (
                typeof addAIMessage ===
                "function"
            ) {

                addAIMessage(
                    fallback
                );
            }

        } catch (error) {

            console.warn(
                "Unable to add fallback response:",
                error
            );
        }


        speak(
            fallback
        );
    }
}


// ============================================================
// INITIALIZE SPEECH RECOGNITION
// ============================================================

function initVoiceRecognition() {

    if (recognition) {

        return true;
    }


    const SpeechRecognition =
        getSpeechRecognitionConstructor();


    if (!SpeechRecognition) {

        recognitionSupported =
            false;


        console.error(
            "Speech Recognition is not supported by this WebView."
        );


        setVoiceStatus(
            "Voice recognition not supported"
        );


        return false;
    }


    recognitionSupported =
        true;


    try {

        recognition =
            new SpeechRecognition();

    } catch (error) {

        console.error(
            "Unable to create SpeechRecognition:",
            error
        );

        recognition =
            null;

        return false;
    }


    const config =
        getVoiceConfig();


    // --------------------------------------------------------
    // Recognition configuration
    // --------------------------------------------------------

    recognition.lang =
        config.language;


    recognition.continuous =
        false;


    recognition.interimResults =
        config.interimResults;


    recognition.maxAlternatives =
        config.maxAlternatives;


    // ========================================================
    // ON START
    // ========================================================

    recognition.onstart =
        function () {

            isListening =
                true;

            isRecognitionStarting =
                false;


            setMicListeningState(
                true
            );


            setVoiceStatus(
                "🎙️ Listening..."
            );


            console.log(
                "Shri voice recognition started."
            );
        };


    // ========================================================
    // ON RESULT
    // ========================================================

    recognition.onresult =
        async function (event) {

            const requestId =
                ++recognitionRequestId;


            try {

                if (
                    !event ||
                    !event.results ||
                    !event.results.length
                ) {

                    return;
                }


                const result =
                    event.results[
                        event.results.length - 1
                    ];


                if (
                    !result ||
                    !result[0]
                ) {

                    return;
                }


                const transcript =
                    String(
                        result[0].transcript ||
                        ""
                    ).trim();


                if (!transcript) {

                    return;
                }


                console.log(
                    "Voice transcript:",
                    transcript
                );


                await handleVoiceResult(
                    transcript
                );


                // Ignore stale async result.
                if (
                    requestId !==
                    recognitionRequestId
                ) {

                    return;
                }

            } catch (error) {

                console.error(
                    "Voice result handling failed:",
                    error
                );


                setVoiceStatus(
                    "Voice processing error"
                );
            }
        };


    // ========================================================
    // ON ERROR
    // ========================================================

    recognition.onerror =
        function (event) {

            isListening =
                false;

            isRecognitionStarting =
                false;


            setMicListeningState(
                false
            );


            const errorCode =
                event?.error ||
                "unknown";


            console.error(
                "Shri voice recognition error:",
                errorCode
            );


            switch (
                errorCode
            ) {

                case "not-allowed":
                case "service-not-allowed":

                    setVoiceStatus(
                        "Microphone permission required"
                    );

                    break;


                case "audio-capture":

                    setVoiceStatus(
                        "Microphone unavailable"
                    );

                    break;


                case "no-speech":

                    setVoiceStatus(
                        "No speech detected"
                    );

                    break;


                case "network":

                    setVoiceStatus(
                        "Voice service unavailable"
                    );

                    break;


                case "aborted":

                    setVoiceStatus(
                        "Ready to Listen..."
                    );

                    break;


                default:

                    setVoiceStatus(
                        "Voice error"
                    );
            }
        };


    // ========================================================
    // ON END
    // ========================================================

    recognition.onend =
        function () {

            isListening =
                false;

            isRecognitionStarting =
                false;


            setMicListeningState(
                false
            );


            setVoiceStatus(
                "Ready to Listen..."
            );


            console.log(
                "Shri voice recognition ended."
            );
        };


    return true;
}


// ============================================================
// START LISTENING
// ============================================================

function startListening() {

    if (
        isRecognitionStarting
    ) {

        console.log(
            "Recognition is already starting."
        );

        return false;
    }


    if (
        isListening
    ) {

        stopListening();

        return false;
    }


    if (
        !recognition
    ) {

        const initialized =
            initVoiceRecognition();


        if (!initialized) {

            return false;
        }
    }


    try {

        // Stop browser TTS before listening.
        stopSpeaking();


        isRecognitionStarting =
            true;


        setVoiceStatus(
            "Starting microphone..."
        );


        recognition.start();


        return true;

    } catch (error) {

        isRecognitionStarting =
            false;

        isListening =
            false;


        console.error(
            "Could not start voice recognition:",
            error
        );


        setMicListeningState(
            false
        );


        setVoiceStatus(
            "Ready to Listen..."
        );


        return false;
    }
}


// ============================================================
// STOP LISTENING
// ============================================================

function stopListening() {

    if (
        !recognition
    ) {

        isListening =
            false;

        isRecognitionStarting =
            false;

        setMicListeningState(
            false
        );

        return;
    }


    try {

        recognition.stop();

    } catch (error) {

        console.warn(
            "Recognition stop failed:",
            error
        );

        isListening =
            false;

        isRecognitionStarting =
            false;

        setMicListeningState(
            false
        );

        setVoiceStatus(
            "Ready to Listen..."
        );
    }
}


// ============================================================
// DESTROY / RESET VOICE SYSTEM
// ============================================================

function destroyVoiceSystem() {

    try {

        if (recognition) {

            recognition.onstart = null;
            recognition.onresult = null;
            recognition.onerror = null;
            recognition.onend = null;


            try {
                recognition.stop();
            } catch (_) {
                // Ignore.
            }
        }

    } catch (error) {

        console.warn(
            "Recognition cleanup failed:",
            error
        );
    }


    recognition =
        null;

    isListening =
        false;

    isRecognitionStarting =
        false;


    stopSpeaking();


    setMicListeningState(
        false
    );
}


// ============================================================
// VOICE SYSTEM STATUS
// ============================================================

function getVoiceSystemStatus() {

    return {

        recognitionSupported:
            recognitionSupported,

        ttsSupported:
            isWebSpeechTTSAvailable(),

        androidTTS:
            isAndroidTTSAvailable(),

        androidTTSReady:
            isAndroidTTSReady(),

        listening:
            isListening,

        voices:
            voices.length
    };
}


// ============================================================
// INITIALIZATION
// ============================================================

initializeVoiceList();


recognitionSupported =
    !!getSpeechRecognitionConstructor();


speechSupported =
    isWebSpeechTTSAvailable();


console.log(
    "=========================================="
);

console.log(
    "Shri AI OS V1.5 Voice Engine initialized."
);

console.log(
    "Recognition:",
    recognitionSupported
);

console.log(
    "Web TTS:",
    speechSupported
);

console.log(
    "Android TTS:",
    isAndroidTTSAvailable()
);

console.log(
    "=========================================="
);