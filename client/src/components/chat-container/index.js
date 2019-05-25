import React, { Component } from 'react';
import SideBar from '../sidebar';
import { events } from '../../events';
import ChatRoomContainer from './chat-room-container';

class ChatContainer extends Component {
	state = {
		chats: [],
		activeChat: null,
	};

	componentDidMount() {
		const { socket } = this.props;
		socket.emit(events.COMMUNITY_CHAT, this.resetChat);
	}

	resetChat = (chat) => this.addChat(chat, true);

	addChat = (chat, reset) => {
		const { socket } = this.props;
		const { chats } = this.state;
		const newChat = reset ? [chat] : [...chats, chat];
		this.setState(() => ({ chats: newChat }));
		const messageEvent = `${events.MESSAGE_RECEIVED}-${chat.id}`;
		const typngEvent = `${events.TYPING}-${chat.id}`;
		socket.on(messageEvent, this.addMessageToChat(chat.id));
		socket.on(typngEvent);
	};

	addMessageToChat = (chatId) => {
		return (message) => {
			const { chats } = this.state;
			let newChats = chats.map((chat) => {
				if (chatId === chat.id) {
					chat.messages.push(message);
				}
				return chat;
			});
			this.setState(() => ({ chats: newChats }));
		};
	};

	updateTypingInChat = (chatId) => {};

	setActiveChat = (activeChat) => {
		this.setState(() => ({ activeChat }));
	};

	render() {
		const { user, logout } = this.props;
		const { chats, activeChat } = this.state;
		return (
			<div className='container'>
				<SideBar logout={logout} chats={chats} user={user} activeChat={activeChat} setActiveChat={this.setActiveChat} />
				<ChatRoomContainer activeChat={activeChat} {...this.props} />
			</div>
		);
	}
}

export default ChatContainer;
