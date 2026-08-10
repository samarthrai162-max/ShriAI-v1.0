// ===============================
// Shri AI - Context System
// ===============================

let CONTEXT = {

    topic: "",
    value: ""

};


function saveContext(topic, value) {

    CONTEXT.topic = topic;
    CONTEXT.value = value;

}


function getContext() {

    return CONTEXT;

}


function clearContext() {

    CONTEXT = {

        topic: "",
        value: ""

    };

}


console.log("Context.js loaded.");