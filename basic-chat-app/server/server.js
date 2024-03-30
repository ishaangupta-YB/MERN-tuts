const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
})

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const users = {};
const rooms = {};

io.on('connection', (socket) => {
    const roomExists = (roomName) => {
        return rooms.hasOwnProperty(roomName);
    };

    socket.on('join-room', (room, username) => {
        if (!roomExists(room)) {
            socket.emit('room-not-found', room);
            return;
        }
        socket.join(room);
        rooms[room] = true;
        users[socket.id] = { username, room };
        socket.broadcast.to(room).emit('user-joined', username);
        io.to(room).emit('user-list', getUsersInRoom(room));
    });

    socket.on('create-room', (room, username) => {
        if (!roomExists(room)) {
            rooms[room] = true;
            socket.join(room);
            users[socket.id] = { username, room };
            socket.broadcast.to(room).emit('user-joined', username);
            io.to(room).emit('user-list', getUsersInRoom(room));
        } else {
            socket.emit('room-already-exists', room);
        }
    })

    socket.on('update-username', (newUsername) => {
        const user = users[socket.id];
        if (user) {
            const { room, username } = user;
            user.username = newUsername;
            socket.broadcast.to(room).emit('user-updated', username, newUsername);
            io.to(room).emit('user-list', getUsersInRoom(room));
        }
    });

    socket.on('send-message', (message) => {
        const user = users[socket.id];
        if (user) {
            const { room, username } = user;
            io.to(room).emit('message', message, username);
        }
    });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            const { room, username } = user;
            socket.broadcast.to(room).emit('user-left', username);
            delete users[socket.id];
            io.to(room).emit('user-list', getUsersInRoom(room));
        }
    });
});

function getUsersInRoom(room) {
    return Object.values(users).filter(user => user.room === room).map(user => user.username);
}
