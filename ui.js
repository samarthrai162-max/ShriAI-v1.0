// ==========================================
// SHRI AI OS - UI SYSTEM
// ==========================================

function scrollChatToBottom() {

    const chat =
        document.getElementById("response");

    if (!chat) return;

    requestAnimationFrame(() => {

        chat.scrollTop =
            chat.scrollHeight;

    });

}


// ==========================================
// ADD USER MESSAGE
// ==========================================

function addUserMessage(text) {

    const response =
        document.getElementById("response");

    if (!response) return;


    response.innerHTML += `
        <div class="user-message">
            👤 <b>Samarth</b><br>
            ${text}
        </div>
    `;


    scrollChatToBottom();

}


// ==========================================
// ADD AI MESSAGE
// ==========================================

function addAIMessage(text) {

    const response =
        document.getElementById("response");

    if (!response) return;


    response.innerHTML += `
        <div class="ai-message">
            <b>Shri</b><br>
            ${text}
        </div>
    `;


    scrollChatToBottom();

}


console.log("UI.js loaded successfully.");