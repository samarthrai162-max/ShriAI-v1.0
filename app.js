// ===============================
// Shri AI OS - App Startup
// ===============================

function startShriApp() {

    const response = document.getElementById("response");

    if (!response) {
        console.error(
            "Shri Error: response element not found."
        );
        return;
    }

    // Clear old/default message
    response.innerHTML = "";

    // Create startup greeting
    const greeting =
`${getGreeting()}

I'm ${AI_NAME}.

Tap the microphone and let's talk.`;

    addAIMessage(greeting);

    console.log(
        "Shri AI OS started successfully."
    );
}


// ===============================
// START APP
// ===============================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startShriApp
    );

} else {

    startShriApp();

}