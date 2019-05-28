import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SideBar from '../sidebar';
import {
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
  TYPING,
  PRIVATE_MESSAGE,
  USER_CONNECTED,
  USER_DISCONNECTED,
} from '../../events';
import ChatRoomContainer from './chat-room-container';
import { values } from 'lodash';

class ChatContainer extends Component {
  static propTypes = {
    socket: PropTypes.object,
    user: PropTypes.string,
    logout: PropTypes.func,
  };

  state = {
    chats: [],
    users: [],
    activeChat: null,
  };

  componentDidMount() {
    this.initSocket();
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.off(PRIVATE_MESSAGE);
    socket.off(USER_CONNECTED);
    socket.off(USER_DISCONNECTED);
  }

  initSocket = () => {
    const { socket, user } = this.props;
    socket.emit(COMMUNITY_CHAT, this.resetChat);
    socket.on(PRIVATE_MESSAGE, this.addChat);
    socket.on('connect', () => {
      socket.emit(COMMUNITY_CHAT, this.resetChat);
    });
    socket.emit(PRIVATE_MESSAGE, { receiver: 'mike', sender: user.name });
    socket.on(USER_CONNECTED, (users) =>
      this.setState(() => ({ users: values(users) })),
    );
    socket.on(USER_DISCONNECTED, (users) =>
      this.setState(() => ({ users: values(users) })),
    );
  };

  sendOpenPrivateMessage = (receiver) => {
    const { socket, user } = this.props;
    const { activeChat } = this.state;
    socket.emit(PRIVATE_MESSAGE, { receiver, sender: user.name, activeChat });
  };

  resetChat = (chat) => this.addChat(chat, true);

  addChat = (chat, reset = false) => {
    const { socket } = this.props;
    const { chats } = this.state;
    const newChat = reset ? [chat] : [...chats, chat];
    this.setState(() => ({
      chats: newChat,
      activeChat: reset ? chat : this.state.activeChat,
    }));
    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
    const typngEvent = `${TYPING}-${chat.id}`;
    socket.on(messageEvent, this.addMessageToChat(chat.id));
    socket.on(typngEvent, this.updateTypingInChat(chat.id));
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

  updateTypingInChat = (chatId) => {
    return ({ isTyping, user }) => {
      if (user !== this.props.user.name) {
        const { chats } = this.state;
        let newChats = chats.map((chat) => {
          if (chat.id === chatId) {
            if (isTyping && !chat.typingUsers.includes(user)) {
              chat.typingUsers.push(user);
            } else if (!isTyping && chat.typingUsers.includes(user)) {
              chat.typingUsers = chat.typingUsers.filter((u) => u !== user);
            }
          }
          return chat;
        });
        this.setState(() => ({ chats: newChats }));
      }
    };
  };

  setActiveChat = (activeChat) => {
    this.setState(() => ({ activeChat }));
  };

  render() {
    const { user, logout } = this.props;
    const { chats, activeChat, users } = this.state;
    return (
      <div className="container">
        <SideBar
          logout={logout}
          chats={chats}
          user={user}
          users={users}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
          onSendOpenPrivateMessage={this.sendOpenPrivateMessage}
        />
        <ChatRoomContainer activeChat={activeChat} {...this.props} />
      </div>
    );
  }
}

export default ChatContainer;
