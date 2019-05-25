import React from 'react';
import { FaVideo, FaUserPlus, FaEllipsisV } from 'react-icons/fa';

const ChatHeading = ({ name, numberOfUsers }) => {
	return (
		<div className='chat-header'>
			<div className='user-info'>
				<div className='user-name'>{name}</div>
				<div className='status'>
					<div className='indicator' />
					<span>{numberOfUsers ? numberOfUsers : null}</span>
				</div>
			</div>
			<div className='options'>
				<FaVideo />
				<FaUserPlus />
				<FaEllipsisV />
			</div>
		</div>
	);
};

export default ChatHeading;
