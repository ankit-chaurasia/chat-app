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

const createChat = ({ messages = [], name = 'Commuinty', users = [] } = {}) => ({
	id: uuidv4(),
	name,
	messages,
	users,
	typingUsers: [],
});

module.exports = { createUser, createMessage, createChat };
