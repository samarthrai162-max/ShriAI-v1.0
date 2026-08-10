// ==========================================
// Shri AI OS - Hindi / Hinglish Translator
// ==========================================

function detectLanguage(message) {

    if (!message) {
        return "english";
    }

    const hindiWords = [
        "mera",
        "meri",
        "mere",
        "main",
        "mai",
        "mujhe",
        "mujhse",
        "tum",
        "tumhara",
        "tumhari",
        "tumhe",
        "aap",
        "aapka",
        "aapki",
        "hai",
        "ho",
        "haan",
        "nahi",
        "kya",
        "kaise",
        "kaun",
        "kyun",
        "kab",
        "kahan",
        "batao",
        "bata",
        "acha",
        "accha",
        "theek",
        "thik",
        "chahiye",
        "pasand",
        "naam",
        "school",
        "class",
        "game",
        "khana",
        "khel"
    ];

    const text = message.toLowerCase();

    for (const word of hindiWords) {

        const pattern =
            new RegExp("\\b" + word + "\\b", "i");

        if (pattern.test(text)) {
            return "hindi";
        }
    }

    return "english";
}


// ==========================================
// HINDI / HINGLISH → ENGLISH
// ==========================================

function translateToEnglish(message) {

    if (!message) {
        return "";
    }

    let text = message.trim();


    // ======================================
    // REMOVE WAKE WORD / AI NAME
    // ======================================

    text = text.replace(
        /^(hey\s+)?(shri|sri|shree|siri|shri\s+ai)[\s,]*/i,
        ""
    ).trim();


    // ======================================
    // QUESTIONS - PERSONAL INFORMATION
    // ======================================

    text = text

        .replace(
            /mera naam kya hai/gi,
            "what is my name"
        )

        .replace(
            /meri favourite book kya hai/gi,
            "what is my favorite book"
        )

        .replace(
            /meri favorite book kya hai/gi,
            "what is my favorite book"
        )

        .replace(
            /mera school kya hai/gi,
            "what is my school"
        )

        .replace(
            /meri hobby kya hai/gi,
            "what is my hobby"
        )

        .replace(
            /meri city kya hai/gi,
            "what is my city"
        )

        .replace(
            /meri age kya hai/gi,
            "what is my age"
        )

        .replace(
            /mera favourite game kya hai/gi,
            "what is my favorite game"
        )

        .replace(
            /mera favorite game kya hai/gi,
            "what is my favorite game"
        )

        .replace(
            /mera favourite color kya hai/gi,
            "what is my favorite color"
        )

        .replace(
            /mera favorite color kya hai/gi,
            "what is my favorite color"
        )

        .replace(
            /mera favourite subject kya hai/gi,
            "what is my favorite subject"
        )

        .replace(
            /mera favorite subject kya hai/gi,
            "what is my favorite subject"
        );


    // ======================================
    // SHRI IDENTITY
    // ======================================

    text = text

        .replace(
            /tum kaun ho/gi,
            "who are you"
        )

        .replace(
            /aap kaun ho/gi,
            "who are you"
        )

        .replace(
            /tum kya ho/gi,
            "what are you"
        )

        .replace(
            /aap kya ho/gi,
            "what are you"
        )

        .replace(
            /tumhara naam kya hai/gi,
            "what is your name"
        )

        .replace(
            /aapka naam kya hai/gi,
            "what is your name"
        )

        .replace(
            /tumhara naam/gi,
            "your name"
        );


    // ======================================
    // HOW ARE YOU
    // ======================================

    text = text

        .replace(
            /tum kaise ho/gi,
            "how are you"
        )

        .replace(
            /tum kaisi ho/gi,
            "how are you"
        )

        .replace(
            /aap kaise ho/gi,
            "how are you"
        )

        .replace(
            /aap kaisi ho/gi,
            "how are you"
        );


    // ======================================
    // TIME
    // ======================================

    text = text

        .replace(
            /mujhe time batao/gi,
            "what is the time"
        )

        .replace(
            /mujhe time bata/gi,
            "what is the time"
        )

        .replace(
            /time batao/gi,
            "what is the time"
        )

        .replace(
            /time bata/gi,
            "what is the time"
        )

        .replace(
            /abhi kitne baje hain/gi,
            "what is the time"
        )

        .replace(
            /abhi kitna time hai/gi,
            "what is the time"
        )

        .replace(
            /kitne baje hain/gi,
            "what is the time"
        )

        .replace(
            /current time batao/gi,
            "what is the current time"
        );


    // ======================================
    // DATE
    // ======================================

    text = text

        .replace(
            /aaj ki date kya hai/gi,
            "what is today's date"
        )

        .replace(
            /aaj date kya hai/gi,
            "what is today's date"
        )

        .replace(
            /aaj ki tareekh kya hai/gi,
            "what is today's date"
        )

        .replace(
            /aaj ki date batao/gi,
            "what is today's date"
        )

        .replace(
            /aaj ki tareekh batao/gi,
            "what is today's date"
        );


    // ======================================
    // CALCULATOR
    // ======================================

    text = text

        .replace(
            /kitna hai/gi,
            ""
        )

        .replace(
            /kitne hain/gi,
            ""
        )

        .replace(
            /plus/gi,
            "+"
        )

        .replace(
            /jod/gi,
            "+"
        )

        .replace(
            /jama/gi,
            "+"
        )

        .replace(
            /minus/gi,
            "-"
        )

        .replace(
            /ghata/gi,
            "-"
        )

        .replace(
            /guna/gi,
            "*"
        )

        .replace(
            /multiply/gi,
            "*"
        )

        .replace(
            /times/gi,
            "*"
        )

        .replace(
            /bhag/gi,
            "/"
        )

        .replace(
            /divide/gi,
            "/"
        );


    // ======================================
    // SAVE PERSONAL INFORMATION
    // ======================================

    text = text

        .replace(
            /mera naam (.+?) hai/gi,
            "my name is $1"
        )

        .replace(
            /mera school (.+?) hai/gi,
            "my school is $1"
        )

        .replace(
            /meri hobby (.+?) hai/gi,
            "my hobby is $1"
        )

        .replace(
            /meri city (.+?) hai/gi,
            "my city is $1"
        )

        .replace(
            /meri age (.+?) hai/gi,
            "my age is $1"
        )

        .replace(
            /mera favourite game (.+?) hai/gi,
            "my favorite game is $1"
        )

        .replace(
            /mera favorite game (.+?) hai/gi,
            "my favorite game is $1"
        )

        .replace(
            /mera favourite color (.+?) hai/gi,
            "my favorite color is $1"
        )

        .replace(
            /mera favorite color (.+?) hai/gi,
            "my favorite color is $1"
        )

        .replace(
            /mera favourite subject (.+?) hai/gi,
            "my favorite subject is $1"
        )

        .replace(
            /mera favorite subject (.+?) hai/gi,
            "my favorite subject is $1"
        )

        .replace(
            /meri favourite book (.+?) hai/gi,
            "my favorite book is $1"
        )

        .replace(
            /meri favorite book (.+?) hai/gi,
            "my favorite book is $1"
        );


    // ======================================
    // COMMON HINDI WORDS
    // ======================================

    text = text

        .replace(
            /mujhe pasand hai/gi,
            "i like"
        )

        .replace(
            /mujhe pasand/gi,
            "i like"
        )

        .replace(
            /main class/gi,
            "i am in class"
        )

        .replace(
            /mai class/gi,
            "i am in class"
        )

        .replace(
            /main/gi,
            "i"
        )

        .replace(
            /mai/gi,
            "i"
        )

        .replace(
            /mujhe/gi,
            "me"
        )

        .replace(
            /mera/gi,
            "my"
        )

        .replace(
            /meri/gi,
            "my"
        )

        .replace(
            /mere/gi,
            "my"
        )

        .replace(
            /tumhe/gi,
            "you"
        )

        .replace(
            /tumhara/gi,
            "your"
        )

        .replace(
            /tumhari/gi,
            "your"
        )

        .replace(
            /aapka/gi,
            "your"
        )

        .replace(
            /aapki/gi,
            "your"
        )

        .replace(
            /kya/gi,
            "what"
        )

        .replace(
            /kaun/gi,
            "who"
        )

        .replace(
            /kaise/gi,
            "how"
        )

        .replace(
            /kyun/gi,
            "why"
        )

        .replace(
            /kahan/gi,
            "where"
        )

        .replace(
            /kab/gi,
            "when"
        )

        .replace(
            /batao/gi,
            "tell me"
        )

        .replace(
            /bata/gi,
            "tell me"
        )

        .replace(
            /acha/gi,
            "okay"
        )

        .replace(
            /accha/gi,
            "okay"
        )

        .replace(
            /thik/gi,
            "okay"
        )

        .replace(
            /theek/gi,
            "okay"
        );


    // ======================================
    // NORMALIZATION
    // ======================================

    text = text

        .replace(
            /favourite/gi,
            "favorite"
        )

        .replace(
            /colour/gi,
            "color"
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();


    return text;
}


console.log(
    "Translator.js loaded successfully."
);