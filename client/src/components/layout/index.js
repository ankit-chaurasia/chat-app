import React, { Component } from 'react';
import io from '../../utils/socket-io-client';
import { socketURL } from '../../configs/socket-config';
import { USER_CONNECTED, LOGOUT } from '../../events';
import LoginForm from '../login-form';
import ChatContainer from '../chat-container';

class Layout extends Component {
	state = {
		socket: null,
		user: null,
	};

	componentWillMount() {
		this.initSocket();
	}

	initSocket = () => {
		const socket = io(socketURL);
		socket.on('connect', () => {
			console.log('Connected');
		});
		this.setState(() => ({ socket }));
	};

	setUser = (user) => {
		const { socket } = this.state;
		socket.emit(USER_CONNECTED, user);
		this.setState(() => ({ user }));
	};

	logout = () => {
		const { socket } = this.state;
		socket.emit(LOGOUT);
		this.setState(() => ({ user: null }));
	};

	render() {
		const { socket, user } = this.state;
		return (
			<div className='container'>
				{user ? (
					<ChatContainer socket={socket} user={user} logout={this.logout} />
				) : (
					<LoginForm socket={socket} setUser={this.setUser} />
				)}
			</div>
		);
	}
}

export default Layout;
