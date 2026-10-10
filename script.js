"use strict";

/* =========================================
   SHRI AI OS — MAIN CONTROLLER V3
   ========================================= */

let shriIsProcessing = false;
let shriChatInitialized = false;


/* ---------- BASIC HELPERS ---------- */

function getElement(id) {
    return document.getElementById(id);
}

function setStatus(message) {
    const status = getElement("status");

    if (status) {
        status.textContent = String(message);
    }
}

function updateShriStatus(message) {
    setStatus(message);
}

function showUserMessage(message) {
    if (typeof addUserMessage === "function") {
        addUserMessage(message);
    }
}

function showAIMessage(message) {
    if (typeof addAIMessage === "function") {
        addAIMessage(message);
    }
}


/* ---------- AI MESSAGE PROCESSING ---------- */

async function processUserMessage(message) {
    if (!message || !String(message).trim()) {
        return null;
    }

    message = String(message).trim();

    console.log("User:", message);

    try {
        if (typeof saveContext === "function") {
            saveContext("lastMessage", message);
        }
    } catch (error) {
        console.warn("Context save failed:", error);
    }

    // First preference: existing local brain
    try {
        if (typeof handleBrain === "function") {
            const reply = handleBrain(message);

            if (
                reply !== null &&
                reply !== undefined &&
                String(reply).trim()
            ) {
                console.log("Shri:", reply);
                return String(reply);
            }
        }
    } catch (error) {
        console.error("Local brain error:", error);
    }

    // Second preference: Gemini fallback
    try {
        if (
            typeof SHRI_CONFIG !== "undefined" &&
            SHRI_CONFIG.gemini &&
            SHRI_CONFIG.gemini.enabled &&
            SHRI_CONFIG.gemini.apiKey
        ) {
            return await askGemini(message);
        }
    } catch (error) {
        console.error("AI fallback error:", error);
    }

    return "I'm still learning that. Try asking me something else.";
}


/* ---------- GEMINI FALLBACK ---------- */

async function askGemini(message) {
    try {
        const config = SHRI_CONFIG.gemini;

        const url =
            `https://generativelanguage.googleapis.com/v1beta/models/` +
            `${config.model}:generateContent?key=${config.apiKey}`;

        const userName =
            typeof getCurrentUserName === "function"
                ? getCurrentUserName()
                : null;

        const identity = userName
            ? `a friendly Hinglish personal assistant for ${userName}`
            : "a friendly Hinglish personal assistant";

        const response = await fetch(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text:
                                    `You are Shri AI, ${identity}. ` +
                                    `Be helpful, respectful and concise.\n\n` +
                                    `User: ${message}`
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        return reply || "I couldn't generate a response.";

    } catch (error) {
        console.error("Gemini error:", error);

        return "I couldn't connect to my AI brain right now.";
    }
}


/* ---------- SEND CHAT MESSAGE ---------- */

async function sendChatMessage(message) {
    if (shriIsProcessing) {
        return;
    }

    message = String(message || "").trim();

    if (!message) {
        return;
    }

    shriIsProcessing = true;

    const input = getElement("messageInput");
    const sendButton = getElement("sendMessage");

    if (input) {
        input.value = "";
        input.style.height = "auto";
    }

    if (sendButton) {
        sendButton.disabled = true;
    }

    showUserMessage(message);

    setStatus("Thinking...");

    if (typeof showThinkingIndicator === "function") {
        showThinkingIndicator();
    }

    try {
        const reply = await processUserMessage(message);

        if (typeof removeThinkingIndicator === "function") {
            removeThinkingIndicator();
        }

        if (reply !== null && reply !== undefined && String(reply).trim()) {
            showAIMessage(String(reply));
        } else {
            showAIMessage("I couldn't generate a response.");
        }

        setStatus("Ready to Listen...");

    } catch (error) {
        console.error("Chat processing error:", error);

        if (typeof removeThinkingIndicator === "function") {
            removeThinkingIndicator();
        }

        showAIMessage("Something went wrong. Please try again.");

        setStatus("Something went wrong");

    } finally {
        shriIsProcessing = false;

        if (sendButton) {
            sendButton.disabled = false;
        }

        if (input) {
            input.focus();
        }
    }
}


/* ---------- CHAT FORM ---------- */

function setupChatForm() {
    const form = getElement("chatForm");
    const input = getElement("messageInput");

    if (!form || !input) {
        console.warn("Chat form or input not found.");
        return;
    }

    if (form.dataset.shriConnected === "true") {
        return;
    }

    form.dataset.shriConnected = "true";

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        sendChatMessage(input.value);
    });

    input.addEventListener("keydown", function (event) {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.isComposing
        ) {
            event.preventDefault();

            if (typeof form.requestSubmit === "function") {
                form.requestSubmit();
            } else {
                sendChatMessage(input.value);
            }
        }
    });

    input.addEventListener("input", function () {
        input.style.height = "auto";

        input.style.height =
            Math.min(input.scrollHeight, 160) + "px";
    });
}


/* ---------- MICROPHONE ---------- */

function setupMicrophone() {
    const mic = getElement("mic");

    if (!mic) {
        console.warn("Microphone button not found.");
        return;
    }

    if (mic.dataset.shriMicConnected === "true") {
        return;
    }

    mic.dataset.shriMicConnected = "true";

    mic.addEventListener("click", function (event) {
        event.preventDefault();

        if (typeof startListening === "function") {
            try {
                startListening();
            } catch (error) {
                console.error("Microphone start failed:", error);

                setStatus("Could not start microphone.");
            }
        } else {
            setStatus("Voice system is unavailable.");
            console.error("startListening() was not found.");
        }
    });

    console.log("Shri microphone connected.");
}


/* ---------- PROMPT BUTTONS ---------- */

function setupPromptButtons() {
    const buttons = document.querySelectorAll("[data-prompt]");

    buttons.forEach(function (button) {
        if (button.dataset.shriPromptConnected === "true") {
            return;
        }

        button.dataset.shriPromptConnected = "true";

        button.addEventListener("click", function () {
            const prompt = button.getAttribute("data-prompt");

            if (!prompt) {
                return;
            }

            const input = getElement("messageInput");

            if (input) {
                input.value = prompt;
                input.focus();
            }

            sendChatMessage(prompt);
        });
    });
}


/* ---------- MOBILE PANELS ---------- */

function closePanels() {
    const sidebar = getElement("sidebar");
    const infoPanel = getElement("infoPanel");

    const sidebarOverlay = getElement("sidebarOverlay");
    const infoOverlay = getElement("infoOverlay");

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (infoPanel) {
        infoPanel.classList.remove("open");
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("visible");
    }

    if (infoOverlay) {
        infoOverlay.classList.remove("visible");
    }
}


function setupPanelToggles() {
    const sidebar = getElement("sidebar");
    const infoPanel = getElement("infoPanel");

    // HTML mein button ka actual ID: openSidebar
    const menuButton =
        getElement("openSidebar") ||
        getElement("toggleSidebar");

    const infoButton = getElement("toggleInfo");

    const closeSidebarButton = getElement("closeSidebar");
    const closeInfoButton = getElement("closeInfo");

    const sidebarOverlay = getElement("sidebarOverlay");
    const infoOverlay = getElement("infoOverlay");


    // Prevent duplicate event listeners
    if (menuButton && menuButton.dataset.shriConnected !== "true") {
        menuButton.dataset.shriConnected = "true";

        menuButton.addEventListener("click", function (event) {
            event.preventDefault();

            if (!sidebar) {
                console.warn("Sidebar element not found.");
                return;
            }

            const isOpen = sidebar.classList.toggle("open");

            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle("visible", isOpen);
            }

            // Keep the other panel closed
            if (isOpen && infoPanel) {
                infoPanel.classList.remove("open");
            }

            if (isOpen && infoOverlay) {
                infoOverlay.classList.remove("visible");
            }
        });
    }


    if (infoButton && infoButton.dataset.shriConnected !== "true") {
        infoButton.dataset.shriConnected = "true";

        infoButton.addEventListener("click", function (event) {
            event.preventDefault();

            if (!infoPanel) {
                console.warn("Info panel element not found.");
                return;
            }

            const isOpen = infoPanel.classList.toggle("open");

            if (infoOverlay) {
                infoOverlay.classList.toggle("visible", isOpen);
            }

            // Keep the other panel closed
            if (isOpen && sidebar) {
                sidebar.classList.remove("open");
            }

            if (isOpen && sidebarOverlay) {
                sidebarOverlay.classList.remove("visible");
            }
        });
    }


    // Explicit close buttons
    if (
        closeSidebarButton &&
        closeSidebarButton.dataset.shriConnected !== "true"
    ) {
        closeSidebarButton.dataset.shriConnected = "true";

        closeSidebarButton.addEventListener("click", function (event) {
            event.preventDefault();
            closePanels();
        });
    }


    if (
        closeInfoButton &&
        closeInfoButton.dataset.shriConnected !== "true"
    ) {
        closeInfoButton.dataset.shriConnected = "true";

        closeInfoButton.addEventListener("click", function (event) {
            event.preventDefault();
            closePanels();
        });
    }


    // Clicking outside a panel closes it
    if (sidebarOverlay && sidebarOverlay.dataset.shriConnected !== "true") {
        sidebarOverlay.dataset.shriConnected = "true";

        sidebarOverlay.addEventListener("click", closePanels);
    }

    if (infoOverlay && infoOverlay.dataset.shriConnected !== "true") {
        infoOverlay.dataset.shriConnected = "true";

        infoOverlay.addEventListener("click", closePanels);
    }
}


/* ---------- NAVIGATION ---------- */

function setupNavigation() {
    const navItems = document.querySelectorAll("[data-panel]");

    const utilityWorkspace = getElement("utilityWorkspace");
    const chatWorkspace = getElement("chatWorkspace");

    const utilityTitle = getElement("utilityTitle");
    const utilityDescription = getElement("utilityDescription");

    const panelInfo = {
        history: {
            title: "Conversation History",
            description: "Chat history features will be added in a future update."
        },

        memory: {
            title: "Shri Memory",
            description: "Your saved preferences and personal memory tools will appear here."
        },

        study: {
            title: "Study Workspace",
            description: "A dedicated workspace for learning and revision is coming soon."
        },

        coding: {
            title: "Coding Workspace",
            description: "Your coding tools and project workspace are planned for a future update."
        },

        calculator: {
            title: "Smart Calculator",
            description: "Try asking Shri AI a calculation in the chat for now."
        },

        settings: {
            title: "Settings",
            description: "Assistant settings will be added here in a future update."
        }
    };


    navItems.forEach(function (item) {
        if (item.dataset.shriNavigationConnected === "true") {
            return;
        }

        item.dataset.shriNavigationConnected = "true";

        item.addEventListener("click", function () {
            const panel = item.getAttribute("data-panel");

            closePanels();

            navItems.forEach(function (nav) {
                nav.classList.toggle("active", nav === item);
            });

            if (panel === "chat") {
                if (utilityWorkspace) {
                    utilityWorkspace.hidden = true;
                }

                if (chatWorkspace) {
                    chatWorkspace.hidden = false;
                }

                return;
            }

            const info = panelInfo[panel];

            if (!info) {
                return;
            }

            if (utilityTitle) {
                utilityTitle.textContent = info.title;
            }

            if (utilityDescription) {
                utilityDescription.textContent = info.description;
            }

            if (chatWorkspace) {
                chatWorkspace.hidden = true;
            }

            if (utilityWorkspace) {
                utilityWorkspace.hidden = false;
            }
        });
    });


    const returnButton = getElement("returnToChat");

    if (
        returnButton &&
        returnButton.dataset.shriConnected !== "true"
    ) {
        returnButton.dataset.shriConnected = "true";

        returnButton.addEventListener("click", function () {
            if (utilityWorkspace) {
                utilityWorkspace.hidden = true;
            }

            if (chatWorkspace) {
                chatWorkspace.hidden = false;
            }

            navItems.forEach(function (nav) {
                nav.classList.toggle(
                    "active",
                    nav.getAttribute("data-panel") === "chat"
                );
            });
        });
    }
}


/* ---------- NEW CHAT ---------- */

function setupNewConversation() {
    const button = getElement("newChat");

    if (!button || button.dataset.shriConnected === "true") {
        return;
    }

    button.dataset.shriConnected = "true";

    button.addEventListener("click", function () {
        const response = getElement("response");

        if (response) {
            response.replaceChildren();

            const welcome = document.createElement("div");
            welcome.className = "welcome-card";

            const heading = document.createElement("h2");
            heading.textContent = "What can I help you with?";

            const description = document.createElement("p");
            description.textContent =
                "Ask a question, explore an idea, or continue building something.";

            welcome.append(heading, description);

            response.appendChild(welcome);
        }

        closePanels();
        setStatus("Ready to Listen...");

        const input = getElement("messageInput");

        if (input) {
            input.focus();
        }
    });
}


/* ---------- DATE AND TIME ---------- */

function updateDateTime() {
    const dateElement = getElement("currentDate");
    const timeElement = getElement("currentTime");

    const now = new Date();

    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }
}


/* ---------- APP START ---------- */

function startShriApp() {
    if (shriChatInitialized) {
        return;
    }

    shriChatInitialized = true;

    setupChatForm();
    setupMicrophone();
    setupPromptButtons();
    setupPanelToggles();
    setupNavigation();
    setupNewConversation();

    updateDateTime();

    window.setInterval(updateDateTime, 1000);

    const response = getElement("response");

    // Avoid duplicate greeting from app.js
    if (response && !response.textContent.trim()) {
        const userName =
            typeof getCurrentUserName === "function"
                ? getCurrentUserName()
                : null;

        const greeting =
            typeof getGreeting === "function"
                ? getGreeting()
                : "Hello!";

        const aiName =
            typeof AI_NAME !== "undefined"
                ? AI_NAME
                : "Shri AI";

        const message = userName
            ? `${greeting}\n\nI'm ${aiName}. What can I help you with?`
            : `${greeting}\n\nI'm ${aiName}, your personal AI assistant. What should I call you?`;

        showAIMessage(message);
    }

    setStatus("Ready to Listen...");

    console.log("Shri AI OS V3 initialized.");
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startShriApp);
} else {
    startShriApp();
}

console.log("Shri AI Main Controller V3 loaded.");