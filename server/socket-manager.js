const { io } = require('./utils/socket-io');
const {
	VERIFY_USER,
	USER_CONNECTED,
	LOGOUT,
	COMMUNITY_CHAT,
	USER_DISCONNECTED,
	MESSAGE_RECEIVED,
	MESSAGE_SENT,
	TYPING,
	PRIVATE_MESSAGE,
} = require('./events');
const { createUser, createMessage, createChat } = require('./factories');

const connectedUsers = {};
let communityChat = createChat({ isCommunity: true });

const isUser = (nickname) => connectedUsers.hasOwnProperty(nickname);

const addUser = (user) => (connectedUsers[user.name] = user);

const removeUser = (username) => delete connectedUsers[username];

const sendMessageToChat = (sender) => {
	return (chatId, message) => {
		io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }));
	};
};

const sendTypingToChat = (user) => {
	return (chatId, isTyping) => {
		io.emit(`${TYPING}-${chatId}`, { user, isTyping });
	};
};

module.exports = (socket) => {
	console.log(`Socket id: ${socket.id}`);
	let sendMsgToChatFromUser;
	let sendTypingFromUser;
	socket.on(VERIFY_USER, (nickname, callback) => {
		if (isUser(nickname)) {
			callback({ isUser: true, user: null });
		} else {
			callback({ isUser: false, user: createUser({ name: nickname, socketId: socket.id }) });
		}
	});

	socket.on(USER_CONNECTED, (user) => {
		user.socketId = socket.id;
		addUser(user);
		socket.user = user;
		sendMsgToChatFromUser = sendMessageToChat(user.name);
		sendTypingFromUser = sendTypingToChat(user.name);
		io.emit(USER_CONNECTED, connectedUsers);
		console.log(`connectedUsers: ${JSON.stringify(connectedUsers)}`);
	});

	socket.on('disconnect', () => {
		if (socket.hasOwnProperty('user')) {
			removeUser(socket.user.name);
			io.emit(USER_DISCONNECTED, connectedUsers);
			console.log(`ondisconnect: ${JSON.stringify(connectedUsers)}`);
		}
	});

	socket.on(LOGOUT, () => {
		removeUser(socket.user.name);
		io.emit(USER_DISCONNECTED, connectedUsers);
		console.log(`Logout: ${JSON.stringify(connectedUsers)}`);
	});

	socket.on(COMMUNITY_CHAT, (callback) => callback(communityChat));

	socket.on(MESSAGE_SENT, ({ chatId, message }) => {
		sendMsgToChatFromUser(chatId, message);
	});

	socket.on(TYPING, ({ chatId, isTyping }) => {
		console.log(`Typing: ${chatId}, ${isTyping}`);
		sendTypingFromUser(chatId, isTyping);
	});

	socket.on(PRIVATE_MESSAGE, ({ receiver, sender, activeChat }) => {
		console.log(`PRIVATE_MESSAGE:= receiver:${receiver}, sender:${sender}`);
		if (connectedUsers.hasOwnProperty(receiver)) {
			const receiverSocket = connectedUsers[receiver].socketId;
			if (activeChat === null || communityChat.id === activeChat.id) {
				const newChat = createChat({ name: `${receiver}&${sender}`, users: [receiver, sender] });
				socket.to(receiverSocket).emit(PRIVATE_MESSAGE, newChat);
				socket.emit(PRIVATE_MESSAGE, newChat);
			} else {
				socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
			}
		}
	});
};
