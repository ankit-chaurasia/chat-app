import React, { Component } from 'react';
import { events } from '../../events';
import Messages from '../messages';
import MessageInput from '../messages/message-input';
import ChatHeading from './chat-heading';

class ChatRoomContainer extends Component {
	state = {};

	sendMessage = (chatId, message) => {
		const { socket } = this.props;
		socket.emit(events.MESSAGE_SENT, { chatId, message });
	};

	sendTyping = (chatId, isTyping) => {
		const { socket } = this.props;
		socket.emit(events.TYPING, { chatId, isTyping });
	};

	render() {
		const { user, activeChat } = this.props;
		return (
			<div className='chat-room-container'>
				{activeChat ? (
					<div className='chat-room'>
						<ChatHeading name={activeChat.name} />
						<Messages messages={activeChat.messages} user={user} typingUsers={activeChat.typingUsers} />
						<MessageInput
							sendMessage={(message) => this.sendMessage(activeChat.id, message)}
							sendTyping={(isTyping) => this.sendTyping(activeChat.id, isTyping)}
						/>
					</div>
				) : (
					<div className='chat-room choose'>Choose a chat!</div>
				)}
			</div>
		);
	}
}

export default ChatRoomContainer;
