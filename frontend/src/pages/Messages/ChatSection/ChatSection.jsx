import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { change } from "../../../components/CurrentContact";
import MessageBubble from "../MessageBubble/MessageBubble.jsx";
import "./ChatSection.css";

const ChatSection = () => {
	const currentContact = useSelector((state) => state.currentContact.value);
	const dispatch = useDispatch();

	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState("");
	const scrollableRef = useRef();

	useEffect(() => {
		setMessages([
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
	}, [currentContact]);

	const scrollToBottom = () => {
		if (scrollableRef.current) {
			scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleMessageChange = (e) => {
		setMessageText(e.target.value);
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!messageText) return;

		const newMessage = {
			id: messages.length + 1,
			timestamp: new Date().toISOString(),
			senderId: 0,
			receiverId: 1,
			text: messageText,
		};
		setMessages([...messages, newMessage]); // here there should be a request to the server
		setMessageText("");
	};

	return (
		<div className="chat-section">
			<div className="chat-section-header">
				<p className="contact-name">{currentContact?.name}</p>
				<p className="contact-email">{currentContact?.email}</p>
			</div>
			<div className="message-list" ref={scrollableRef}>
				{messages.map((message, index) => (
					<MessageBubble key={index} message={message} />
				))}
			</div>
			<form className="message-input" onSubmit={handleSendMessage}>
				<input
					type="text"
					placeholder="Type a message..."
					value={messageText}
					onChange={handleMessageChange}
				/>
				<button type="submit">
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</form>
		</div>
	);
};

export default ChatSection;
