const { app } = require('./app-server');
const io = require('socket.io')(app);

module.exports = { io };
