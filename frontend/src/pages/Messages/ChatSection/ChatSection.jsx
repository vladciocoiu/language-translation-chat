import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../../components/CurrentContact";
import MessageBubble from "../MessageBubble/MessageBubble.jsx";
import "./ChatSection.css";

const ChatSection = () => {
	const currentContact = useSelector((state) => state.currentContact.value);
	const dispatch = useDispatch();

	const [messages, setMessages] = React.useState([
		{
			id: 1,
			timestamp: "2021-01-01T00:00:00.000Z",
			senderId: 1,
			receiverId: 0,
			text: `Hi, my name is ${currentContact?.name}!`,
		},
		{
			id: 2,
			timestamp: "2023-02-01T00:00:00.000Z",
			senderId: 0,
			receiverId: 1,
			text: "Hello, how are you?",
		},
	]);

	return (
		<div className="chat-section">
			<div className="chat-section-header">
				<p className="contact-name">{currentContact?.name}</p>
				<p className="contact-email">{currentContact?.email}</p>
			</div>
			<div className="message-list">
				{messages.map((message, index) => (
					<MessageBubble key={index} message={message} />
				))}
			</div>
		</div>
	);
};

export default ChatSection;
