const { app } = require('./utils/app-server');
const { io } = require('./utils/socket-io');
const socketManager = require('./socket-manager');
const PORT = process.env.PORT || 5000;

io.on('connection', socketManager);

app.listen(PORT, () => {
	console.log(`Connected to PORT: ${PORT}`);
});
