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
        filename:'chats.db',
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS MESSAGES (
            id INTEGER PRIMARY KEY AUTOINCREMENT client offset TEXT UNIQUE,
            content TEXT
        )
    `)

    io.on('connection', (socket) => {
        console.log(`A user is connected = ${socket}`)
        socket.on('chat msg', async (msg) => {
            try{
                const res = await db.run('INSERT INTO MESSAGES (content) VALUES (?)',msg)
                io.emit('chat message',msg,result.lastID)
            }catch(e) {
                console.log(e)
            }
        })
    })

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/public/index.html'))
    })


    server.listen(PORT, () => {
        console.log(`running on port - ${PORT}`)
    }) 
}

main()