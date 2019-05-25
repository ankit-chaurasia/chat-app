const uuidv4 = require('uuid/v4');

const getTime = (date) => `${date.getHours()}:${date.getMinutes().slice(-2)}`;

const createUser = ({ name = '' } = {}) => ({
	id: uuidv4(),
	name,
});

const createMessage = ({ message = '', sender = '' } = {}) => ({
	id: uuidv4(),
	time: getTime(Date.now()),
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
