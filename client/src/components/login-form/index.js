import React, { Component } from 'react';
import { VERIFY_USER } from '../../events';

class LoginForm extends Component {
	state = {
		textInput: null,
		nickname: '',
		error: '',
	};

	setError = (error) => {
		this.setState(() => ({ error }));
	};

	setUser = ({ user, isUser }) => {
		console.log(`user: ${JSON.stringify(user)}, isUser: ${isUser}`);
		if (isUser) {
			this.setError('Username taken');
		} else {
			this.setError('');
			this.props.setUser(user);
		}
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { socket } = this.props;
		const { nickname } = this.state;
		socket.emit(VERIFY_USER, nickname, this.setUser);
	};

	handleOnChange = (e) => {
		this.setState({ nickname: e.target.value });
	};

	render() {
		let { nickname, error } = this.state;
		return (
			<div className='login'>
				<form onSubmit={this.handleSubmit} className='login-form'>
					<label htmlFor='nickname'>
						<h2>Got a nickname?</h2>
					</label>
					<input
						ref={(input) => {
							this.textInput = input;
						}}
						type='text'
						id='nickname'
						onChange={this.handleOnChange}
						value={nickname}
						placeholder='Nickname'
					/>
					<div className='error'>{error ? error : ''}</div>
				</form>
			</div>
		);
	}
}

export default LoginForm;
