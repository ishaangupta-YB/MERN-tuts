const messageform = document.querySelector(".chatbox form");
const messageList = document.querySelector("#messagelist");
const userList = document.querySelector("ul#users");
const chatboxinput = document.querySelector(".chatbox input");
const socket = io("http://localhost:8080");


let users = [];
let messages = [];
let isUser = "";


socket.on("message", message => {
    messages.push(message);
    updateMessages();
});

socket.on("private", data => {
    isUser = data.name;
});

socket.on("users", function (_users) {
    users = _users;
    updateUsers();
});

messageform.addEventListener("submit", messageSubmitHandler);
