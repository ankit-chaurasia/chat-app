import React, { Component } from 'react';
import { FaChevronDown, FaBars, FaSearch } from 'react-icons/fa';
import { MdEject } from 'react-icons/md';
import SidebarOptions from './sidebar-options';
import { get, last, differenceBy } from 'lodash';

export default class SideBar extends Component {
	static type = {
		CHATS: 'chats',
		USERS: 'users',
	};

	state = {
		receiver: '',
		activeSideBar: SideBar.type.CHATS,
	};

	handleOnChange = (e) => {
		this.setState({ receiver: e.target.value });
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const { receiver } = this.state;
		console.log(`receiver: ${receiver}`);
		const { onSendOpenPrivateMessage } = this.props;
		onSendOpenPrivateMessage(receiver);
		this.setState(() => ({ receiver: '' }));
	};

	createChatNameFromUsers = (users, excludeUser = '') =>
		users.filter((u) => u !== excludeUser).join(' & ') || 'Empty Users';

	addChatForUsers = (username) => {
		this.props.onSendOpenPrivateMessage(username);
		this.setActiveSideBar(SideBar.type.CHATS);
	};

	setActiveSideBar = (newSideBar) => {
		this.setState(() => ({ activeSideBar: newSideBar }));
	};

	render() {
		const { chats, activeChat, user, setActiveChat, logout, users } = this.props;
		const { receiver, activeSideBar } = this.state;
		return (
			<div id='side-bar'>
				<div className='heading'>
					<div className='app-name'>
						Our Cool Chat <FaChevronDown />
					</div>
					<div className='menu'>
						<FaBars />
					</div>
				</div>
				<form onSubmit={this.handleSubmit} className='search'>
					<i className='search-icon'>
						<FaSearch />
					</i>
					<input placeholder='Search' type='text' value={receiver} onChange={this.handleOnChange} />
					<div className='plus' />
				</form>
				<div className='side-bar-select'>
					<div
						className={`side-bar-select__option ${activeSideBar === SideBar.type.CHATS ? 'active' : ''}`}
						onClick={() => {
							this.setActiveSideBar(SideBar.type.CHATS);
						}}
					>
						<span>Chats</span>
					</div>
					<div
						className={`side-bar-select__option ${activeSideBar === SideBar.type.USERS ? 'active' : ''}`}
						onClick={() => {
							this.setActiveSideBar(SideBar.type.USERS);
						}}
					>
						<span>Users</span>
					</div>
				</div>
				<div
					className='users'
					ref='users'
					onClick={(e) => {
						e.target === this.refs.user && setActiveChat(null);
					}}
				>
					{activeSideBar === SideBar.type.CHATS
						? chats.map((chat) =>
								chat.name ? (
									<SidebarOptions
										key={chat.id}
										name={chat.isCommunity ? chat.name : this.createChatNameFromUsers(chat.users, user.name)}
										lastMessage={get(last(chat.messages), 'message', '')}
										active={activeChat.id === chat.id}
										onClick={() => {
											this.props.setActiveChat(chat);
										}}
									/>
								) : null,
						  )
						: differenceBy(users, [user], 'name').map((otherUser) => {
								return (
									<SidebarOptions
										key={otherUser.id}
										name={otherUser.name}
										onClick={() => {
											this.addChatForUsers(otherUser.name);
										}}
									/>
								);
						  })}
				</div>
				<div className='current-user'>
					<span>{user.name}</span>
					<div onClick={logout} title='Logout' className='logout'>
						<MdEject />
					</div>
				</div>
			</div>
		);
	}
}
