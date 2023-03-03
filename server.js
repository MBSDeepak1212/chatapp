const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.render('index');
});

let users = {};
let messages = [];

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('new user', (username) => {
        users[socket.id] = username;
        io.emit('update users', users);
        // console.log(`${username} connected`);
    });

    socket.on('chat message', (msg) => {
        const date = new Date();
        const timestamp = date.toLocaleString();
        messages.push({ user: users[socket.id], message: msg, time: timestamp });
        io.emit('chat message', { user: users[socket.id], message: msg, time: timestamp });
        // console.log(`${users[socket.id]}: ${msg}`);
    });

    socket.on('disconnect', () => {
        // console.log(`${users[socket.id]} disconnected`);
        delete users[socket.id];
        io.emit('update users', users);
    });
});

http.listen(3000, () => {
    // console.log('listening on *:3000');
});
