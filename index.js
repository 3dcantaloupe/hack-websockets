import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer, {
    // cors = Cross Origin Resource Sharing
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5501", "http://127.0.0.1:5501"]
    }
})


io.on('connection', socket => {

    // Upon connection - only to user 
    socket.emit('message', `Welcome to ACM's Chatroom`)

    // Upon connection - to all other user connected to the server
    socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`)

//-------- Activity 1 --------
    // When a message event is activated, the message should be broadcasted to all connected users
    // You can format how the message is written however you'd like, we used the formatting [User ID]: [Message]

    // Hint: If your stuck use slide 24 for reference
    socket.on('message', (data) => {
       io.emit('message', `${socket.id.substring(0, 5)}: ${data}`)
    })
    
    
//----------------------------

//-------- Activity 3 --------
    // When user disconnects - to all others 
    socket.on('disconnect', () => {
        // Hint: Refer to how we emit the connection message
        socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} disconnected`)
    })

    // Listen for activity event
    socket.on('typing', (name) => {
        // Hint: Pay attention to the parameter
        socket.broadcast.emit('typing', name)
    })
//----------------------------
})

httpServer.listen(3500, () => console.log('listening on port 3500'))