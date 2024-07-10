const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("index");
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('sendLocation', (data) => {
        io.emit('receiveLocation', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, (err) => {
    if (err) {
        console.error("Server failed to start", err);
    } else {
        console.log("Server is running on PORT 3000");
    }
});
