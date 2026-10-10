// ===============================
// Shri AI OS - App Startup
// ===============================

function startShriApp() {

    const response =
        document.getElementById("response");


    if (!response) {

        console.error(
            "Shri Error: response element not found."
        );

        return;
    }


    // Clear old/default message

    response.innerHTML = "";


    const userName =
        typeof getCurrentUserName ===
        "function"
            ? getCurrentUserName()
            : null;


    let greeting;


    if (userName) {

        greeting =
`${getGreeting()}

I'm ${AI_NAME}.

Tap the microphone and let's talk.`;

    } else {

        greeting =
`${getGreeting()}

I'm ${AI_NAME}, your personal AI assistant.

What should I call you?`;

    }


    addAIMessage(
        greeting
    );


    console.log(
        "Shri AI OS started successfully."
    );
}


// ===============================
// START APP
// ===============================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startShriApp
    );

} else {

    startShriApp();

}