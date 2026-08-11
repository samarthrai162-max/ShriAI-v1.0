// ==========================================
// Shri AI OS - Voice System v3
// WebView + Chrome Compatible
// ==========================================

let recognition = null;
let isListening = false;
let voices = [];
let speechReady = false;
let speechQueue = [];


// ==========================================
// SPEECH SYNTHESIS SUPPORT
// ==========================================

function speechSupported() {

    return (
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window
    );

}


// ==========================================
// LOAD VOICES
// ==========================================

function loadVoices() {

    if (!speechSupported()) {

        console.error(
            "Shri: Speech Synthesis not supported."
        );

        return false;
    }

    voices =
        window.speechSynthesis
            .getVoices();

    console.log(
        "Shri voices loaded:",
        voices.length
    );

    if (voices.length > 0) {

        speechReady = true;

        // Process queued speech
        if (speechQueue.length > 0) {

            const queue =
                [...speechQueue];

            speechQueue = [];

            queue.forEach(function(text) {

                speak(text);

            });

        }

    }

    return true;
}


// ==========================================
// INITIALIZE VOICE ENGINE
// ==========================================

function initializeSpeech() {

    if (!speechSupported()) {
        return;
    }

    try {

        window.speechSynthesis.cancel();

    } catch (error) {

        console.error(
            "Speech initialization error:",
            error
        );

    }

    loadVoices();

    // Android WebView / Chrome
    window.speechSynthesis.onvoiceschanged =
        function() {

            console.log(
                "Shri: voiceschanged event"
            );

            loadVoices();

        };

    // WebView sometimes returns voices
    // only after a short delay
    setTimeout(function() {

        loadVoices();

    }, 300);

    setTimeout(function() {

        loadVoices();

    }, 1000);

    setTimeout(function() {

        loadVoices();

    }, 2000);

}


// ==========================================
// START SPEECH ENGINE
// ==========================================

if (speechSupported()) {

    initializeSpeech();

}


// ==========================================
// CLEAN TEXT
// ==========================================

function cleanSpeechText(text) {

    if (!text) {
        return "";
    }

    let cleaned =
        String(text);

    // Remove emojis
    try {

        cleaned =
            cleaned.replace(
                /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
                ""
            );

    } catch (error) {

        // Older WebView fallback
        cleaned =
            cleaned.replace(
                /[\u{1F300}-\u{1FAFF}]/gu,
                ""
            );

    }

    // Remove excessive symbols
    cleaned =
        cleaned.replace(
            /[*#_`~]+/g,
            " "
        );

    // Remove extra spaces
    cleaned =
        cleaned.replace(
            /\s+/g,
            " "
        );

    return cleaned.trim();

}


// ==========================================
// FIND BEST VOICE
// ==========================================

function getBestVoice() {

    if (!voices || voices.length === 0) {

        return null;

    }

    console.log(
        "Available Shri voices:",
        voices.map(function(voice) {

            return (
                voice.name +
                " [" +
                voice.lang +
                "]"
            );

        })
    );


    // Hindi voices first
    let voice =
        voices.find(function(v) {

            return /hi-IN/i.test(
                v.lang
            );

        });

    if (voice) {
        return voice;
    }


    // English India
    voice =
        voices.find(function(v) {

            return /en-IN/i.test(
                v.lang
            );

        });

    if (voice) {
        return voice;
    }


    // Google voices
    voice =
        voices.find(function(v) {

            return /Google/i.test(
                v.name
            );

        });

    if (voice) {
        return voice;
    }


    // Any English voice
    voice =
        voices.find(function(v) {

            return /^en/i.test(
                v.lang
            );

        });

    if (voice) {
        return voice;
    }


    // Last available voice
    return voices[0];

}


// ==========================================
// SPEAK
// ==========================================

function speak(text) {

    if (!text) {
        return;
    }


    // Voice disabled in config
    if (
        typeof SHRI_CONFIG !== "undefined" &&
        SHRI_CONFIG.voice &&
        SHRI_CONFIG.voice.enabled === false
    ) {

        console.log(
            "Shri voice disabled in config."
        );

        return;
    }


    if (!speechSupported()) {

        console.error(
            "Shri: Speech synthesis unavailable."
        );

        return;

    }


    const spokenText =
        cleanSpeechText(text);


    if (!spokenText) {
        return;
    }


    // If voices are not ready yet,
    // queue the message.
    if (
        !speechReady ||
        voices.length === 0
    ) {

        console.log(
            "Shri: Voice engine not ready. Queuing speech."
        );

        speechQueue.push(
            spokenText
        );

        initializeSpeech();

        return;
    }


    try {

        const synth =
            window.speechSynthesis;


        // Stop previous speech
        synth.cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                spokenText
            );


        // ==================================
        // VOICE SETTINGS
        // ==================================

        let rate = 1;
        let pitch = 1;
        let volume = 1;

        if (
            typeof SHRI_CONFIG !== "undefined" &&
            SHRI_CONFIG.voice
        ) {

            rate =
                SHRI_CONFIG.voice.rate ?? 1;

            pitch =
                SHRI_CONFIG.voice.pitch ?? 1;

            volume =
                SHRI_CONFIG.voice.volume ?? 1;

        }


        utterance.rate =
            Math.max(
                0.5,
                Math.min(
                    2,
                    Number(rate)
                )
            );

        utterance.pitch =
            Math.max(
                0,
                Math.min(
                    2,
                    Number(pitch)
                )
            );

        utterance.volume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(volume)
                )
            );


        // ==================================
        // SELECT VOICE
        // ==================================

        const selectedVoice =
            getBestVoice();


        if (selectedVoice) {

            utterance.voice =
                selectedVoice;

            utterance.lang =
                selectedVoice.lang;

        } else {

            // Important for Android WebView
            utterance.lang =
                "en-IN";

        }


        // ==================================
        // EVENTS
        // ==================================

        utterance.onstart =
            function() {

                console.log(
                    "Shri started speaking."
                );

                if (
                    typeof setStatus ===
                    "function"
                ) {

                    setStatus(
                        "🔊 Shri is speaking..."
                    );

                }

            };


        utterance.onend =
            function() {

                console.log(
                    "Shri finished speaking."
                );

                if (
                    typeof setStatus ===
                    "function"
                ) {

                    setStatus(
                        "Ready to Listen..."
                    );

                }

            };


        utterance.onerror =
            function(event) {

                console.error(
                    "Shri speech error:",
                    event.error
                );

                if (
                    typeof setStatus ===
                    "function"
                ) {

                    setStatus(
                        "Voice error: " +
                        (
                            event.error ||
                            "unknown"
                        )
                    );

                }

            };


        // ==================================
        // ANDROID WEBVIEW SPEECH FIX
        // ==================================

        setTimeout(
            function() {

                try {

                    synth.speak(
                        utterance
                    );

                    console.log(
                        "Shri speech requested:",
                        spokenText
                    );

                } catch (error) {

                    console.error(
                        "Shri speech failed:",
                        error
                    );

                }

            },
            100
        );


    } catch (error) {

        console.error(
            "Shri speak() error:",
            error
        );

    }

}


// ==========================================
// INITIALIZE SPEECH ON FIRST USER ACTION
// ==========================================

function unlockSpeechEngine() {

    if (!speechSupported()) {
        return;
    }

    try {

        const synth =
            window.speechSynthesis;

        synth.cancel();

        loadVoices();

        console.log(
            "Shri speech engine unlocked."
        );

    } catch (error) {

        console.error(
            "Speech unlock error:",
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
            typeof setStatus ===
            "function"
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


    // ======================================
    // LISTENING START
    // ======================================

    recognition.onstart =
        function() {

            isListening =
                true;


            // Unlock speech engine
            unlockSpeechEngine();


            if (
                typeof setStatus ===
                "function"
            ) {

                setStatus(
                    "🎙️ Listening..."
                );

            }


            const mic =
                document.getElementById(
                    "mic"
                );


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
    // RESULT
    // ======================================

    recognition.onresult =
        async function(event) {

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


                    speak(
                        reply
                    );

                    return;

                }


                // ==================================
                // PROCESS MESSAGE
                // ==================================

                let reply =
                    null;


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


                // ==================================
                // SHOW + SPEAK
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


                    speak(
                        reply
                    );

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


                    speak(
                        fallback
                    );

                }

            } catch (error) {

                console.error(
                    "Voice result error:",
                    error
                );

            }

        };


    // ======================================
    // ERROR
    // ======================================

    recognition.onerror =
        function(event) {

            console.error(
                "Voice recognition error:",
                event.error
            );


            if (
                typeof setStatus ===
                "function"
            ) {

                if (
                    event.error ===
                    "not-allowed"
                ) {

                    setStatus(
                        "🎤 Microphone permission denied"
                    );

                } else if (
                    event.error ===
                    "no-speech"
                ) {

                    setStatus(
                        "No speech detected"
                    );

                } else if (
                    event.error ===
                    "audio-capture"
                ) {

                    setStatus(
                        "Microphone unavailable"
                    );

                } else {

                    setStatus(
                        "Voice error: " +
                        event.error
                    );

                }

            }

        };


    // ======================================
    // END
    // ======================================

    recognition.onend =
        function() {

            isListening =
                false;


            const mic =
                document.getElementById(
                    "mic"
                );


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

    // Unlock Android/WebView speech
    unlockSpeechEngine();


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
// TEST SPEECH
// ==========================================

function testShriVoice() {

    console.log(
        "Testing Shri voice..."
    );

    speak(
        "Hello Samarth. I am Shri. My voice system is working."
    );

}


// ==========================================
// GLOBAL READY
// ==========================================

console.log(
    "Shri Voice System v3 loaded successfully."
);