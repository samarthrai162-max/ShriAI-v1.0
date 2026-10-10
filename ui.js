// ==========================================
// SHRI AI OS - UI SYSTEM V2
// Futuristic Chat Interface
// ==========================================


// ==========================================
// GET CHAT ELEMENT
// ==========================================

function getChatContainer() {
    return document.getElementById("response");
}


// ==========================================
// REMOVE WELCOME SCREEN
// ==========================================

function removeWelcomeScreen() {
    const response = getChatContainer();

    if (!response) return;

    const welcomeCard =
        response.querySelector(".welcome-card");

    if (welcomeCard) {
        welcomeCard.remove();
    }
}


// ==========================================
// SCROLL CHAT TO BOTTOM
// ==========================================

function scrollChatToBottom() {
    const chat = getChatContainer();

    if (!chat) return;

    requestAnimationFrame(() => {
        chat.scrollTop = chat.scrollHeight;
    });
}


// ==========================================
// CREATE MESSAGE ELEMENT
// ==========================================

function createMessageElement(type, name, text) {
    const message = document.createElement("div");

    message.className =
        type === "user"
            ? "user-message"
            : "ai-message";

    const heading = document.createElement("div");
    heading.className = "message-heading";

    const nameElement = document.createElement("strong");
    nameElement.textContent = name;

    heading.appendChild(nameElement);

    const content = document.createElement("div");
    content.className = "message-content";

    // Treat the message as plain text for safety.
    content.textContent = String(text ?? "");

    message.appendChild(heading);
    message.appendChild(content);

    return message;
}


// ==========================================
// ADD USER MESSAGE
// ==========================================

function addUserMessage(text) {
    const response = getChatContainer();

    if (!response) {
        console.error("Chat container #response not found.");
        return;
    }

    removeWelcomeScreen();

    const message = createMessageElement(
        "user",
        "You",
        text
    );

    response.appendChild(message);

    scrollChatToBottom();
}


// ==========================================
// ADD AI MESSAGE
// ==========================================

function addAIMessage(text) {
    const response = getChatContainer();

    if (!response) {
        console.error("Chat container #response not found.");
        return;
    }

    removeWelcomeScreen();

    const message = createMessageElement(
        "ai",
        "Shri AI",
        text
    );

    response.appendChild(message);

    scrollChatToBottom();
}


// ==========================================
// THINKING INDICATOR
// ==========================================

function showThinkingIndicator() {
    const response = getChatContainer();

    if (!response) return;

    removeThinkingIndicator();

    const indicator = document.createElement("div");

    indicator.id = "shriThinking";
    indicator.className = "ai-message thinking-message";
    indicator.setAttribute("aria-live", "polite");

    const label = document.createElement("strong");
    label.textContent = "Shri AI";

    const text = document.createElement("span");
    text.className = "thinking-text";
    text.textContent = " Thinking";

    const dots = document.createElement("span");
    dots.className = "thinking-dots";
    dots.textContent = "...";

    text.appendChild(dots);

    indicator.appendChild(label);
    indicator.appendChild(document.createElement("br"));
    indicator.appendChild(text);

    response.appendChild(indicator);

    scrollChatToBottom();
}


// ==========================================
// REMOVE THINKING INDICATOR
// ==========================================

function removeThinkingIndicator() {
    const indicator =
        document.getElementById("shriThinking");

    if (indicator) {
        indicator.remove();
    }
}


// ==========================================
// UPDATE STATUS
// ==========================================

function updateShriStatus(message) {
    const status = document.getElementById("status");

    if (!status) return;

    status.textContent = message;
}


// ==========================================
// CLEAR CHAT DISPLAY
// ==========================================

function clearChatDisplay() {
    const response = getChatContainer();

    if (!response) return;

    response.replaceChildren();
}


// ==========================================
// INITIALIZATION
// ==========================================

console.log("Shri AI UI System V2 loaded successfully.");