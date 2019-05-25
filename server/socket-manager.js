const io = require('./utils/socket-io');
const { VERIFY_USER, USER_CONNECTED, LOGOUT, COMMUNITY_CHAT } = require('./events');
const { createUser, createMessage, createChat } = require('./factories');

const connectedUsers = {};

const isUser = (nickname) => connectedUsers.hasOwnProperty(nickname);

const addUser = (user) => (connectedUsers[user.name] = user);

const removeUser = (username) => delete connectedUsers[username];

let communityChat = createChat();

module.exports = (socket) => {
	console.log(`Socket id: ${socket.id}`);

	socket.on(VERIFY_USER, (nickname, callback) => {
		if (isUser(nickname)) {
			callback({ isUser: true, user: null });
		} else {
			callback({ isUser: false, user: createUser({ name: nickname }) });
		}
	});

	socket.on(USER_CONNECTED, (user) => {
		addUser(user);
		socket.user = user;
		// io.emit(USER_CONNECTED, connectedUsers);
		console.log(JSON.stringify(connectedUsers));
	});

	socket.on(LOGOUT, () => removeUser(socket.user.name));

	socket.on(COMMUNITY_CHAT, (callback) => callback(communityChat));
};
