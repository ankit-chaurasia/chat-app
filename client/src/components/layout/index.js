import React, { Component } from 'react';
import io from '../../utils/socket-io-client';
import { socketURL } from '../../configs/socket-config';
import { events } from '../../events';
import LoginForm from '../login-form';

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
		socket.emit(events.USER_CONNECTED, user);
		this.setState(() => ({ user }));
	};

	logout = () => {
		const { socket } = this.state;
		socket.emit(events.LOGOUT);
		this.setState(() => ({ user: null }));
	};

	render() {
		const { socket } = this.state;
		return (
			<div className='container'>
				<LoginForm socket={socket} setUser={this.setUser} />
			</div>
		);
	}
}

export default Layout;
