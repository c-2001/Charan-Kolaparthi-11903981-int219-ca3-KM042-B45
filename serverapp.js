//jshint esversion:6
const express = require("express");
const app = express();
const port = 5000;
const http = require('http').createServer(app);

http.listen(5000, function() {
    console.log("Server started");
});

app.use(express.static(__dirname + '/public'))



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chatapp.html');
}); //req-request, res-response


//socket
const io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log("Connected socket...");
});

io.on("connection", function(socket) {
    socket.on("newuser", function(username) {
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", function(username) {
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat", function(message) {
        socket.broadcast.emit("chat", message);
    });
});