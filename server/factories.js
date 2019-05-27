const uuidv4 = require('uuid/v4');

const getTime = (date) =>
	`${date.getHours()}:${date
		.getMinutes()
		.toString()
		.slice(-2)}`;

const createUser = ({ name = '', socketId = null } = {}) => ({
	id: uuidv4(),
	name,
	socketId,
});

const createMessage = ({ message = '', sender = '' } = {}) => ({
	id: uuidv4(),
	time: getTime(new Date()),
	message,
	sender,
});

const createChatNameFromUsers = (users, excludeUser = '') =>
	users.filter((u) => u != excludeUser).join(' & ') || 'Empty Users';

const createChat = ({ messages = [], name = 'Commuinty', users = [], isCommunity = false } = {}) => ({
	id: uuidv4(),
	name: isCommunity ? 'Commuinty' : createChatNameFromUsers(users),
	messages,
	users,
	typingUsers: [],
	isCommunity,
});

module.exports = { createUser, createMessage, createChat, createChatNameFromUsers };
