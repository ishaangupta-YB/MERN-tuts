const socket = io('http://localhost:8080');

function joinRoom() {
    const room = document.getElementById('roomInput').value;
    const username = document.getElementById('usernameInput').value;

    if (room && username) {
        socket.emit('join-room', room, username);
    } else {
        alert('Please enter a room name and username');
    }
}

socket.on('room-not-found', () => {
    document.getElementById('roomForm').style.display = 'block';
    document.getElementById('chat').style.display = 'none';
    alert('Room Does not exists');
})

socket.on('user-joined', (username) => {
    displayMessage(`${username} has joined the room`, 'system');
});

socket.on('user-left', (username) => {
    displayMessage(`${username} has left the room`, 'system');
});

socket.on('user-list', (userList) => {
    document.getElementById('userList').innerHTML = '';
    userList.forEach(username => {
        const listItem = document.createElement('li');
        listItem.textContent = username;
        document.getElementById('userList').appendChild(listItem);
    });
});

socket.on('message', (message, username) => {
    displayMessage(`${username}: ${message}`, username === getUsername() ? 'my-message' : 'other-message');
});

socket.on('room-not-found', (room) => {
    displayMessage(`Room '${room}' not found.`, 'system');
});

function sendMessage() {
    const message = document.getElementById('messageInput').value;
    if (message) {
        socket.emit('send-message', message);
        displayMessage(`You: ${message}`, 'my-message');
        document.getElementById('messageInput').value = '';
    }
}

function displayMessage(message, messageClass) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message', messageClass);
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getUsername() {
    return document.getElementById('usernameInput').value;
}

function createRoom() {
    const room = document.getElementById('roomInput').value;
    const username = document.getElementById('usernameInput').value;

    if (room && username) {
        document.getElementById('roomForm').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
        socket.emit('create-room', room, username);
    } else {
        alert('Please enter a room name and username');
    }
}
