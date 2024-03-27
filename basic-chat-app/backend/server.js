const express = require('express')
const path = require('path')
const { createServer } = require('http')
const { Server } = require('socket.io')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const PORT = 8080

const app = express()
const server = createServer(app)

const io = new Server(server)

const main = async () => {
    const db = await open({
        filename: 'chats.db',
        driver: sqlite3.Database
    })

    await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id  INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
        )
    `)

    io.on('connection',async (socket) => {
        console.log(`A user is connected = ${socket}`)
        socket.on("disconnect", () => {
            console.log("A user disconnected...");
        });

        socket.on('chat msg', async (msg) => {
            try {
                const result = await db.run(
                    "INSERT INTO messages (content) VALUES (?)",
                    msg
                );
                io.emit('chat msg', msg, result.lastID)
            } catch (e) {
                console.log(e)
            }
        })

        if (!socket.recovered) {
            try {
                await db.each(
                    "SELECT id, content FROM messages WHERE id > ?",
                    [socket.handshake.auth.serverOffset || 0],
                    (_err, row) => {
                        socket.emit("chat msg", row.content, row.id);
                    }
                );
            } catch (e) {
                return;
            }
        }
    });

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/public/index.html'))
    })


    server.listen(PORT, () => {
        console.log(`running on port - ${PORT}`)
    })
}

main()