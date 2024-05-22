import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import MessageBubble from "../MessageBubble/MessageBubble.jsx";
import "./ChatSection.css";

const ChatSection = ({ setRefreshConversations }) => {
	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);
	const auth = useSelector((state) => state.auth.value);

	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState("");
	const scrollableRef = useRef();

	async function getMessages() {
		const url = currentConversation.id
			? `http://localhost:3000/api/conversations/${currentConversation.id}/messages?offset=0&limit=1000`
			: `http://localhost:3000/api/users/${currentConversation.recipient.id}/messages?offset=0&limit=1000`;
		try {
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${auth.accessToken}`,
				},
			});
			if (response.status !== 200) {
				console.error(new Error("Failed to get messages"));

				return [];
			} else {
				setMessages(response.data.messages);
			}
			return response.data.messages;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	useEffect(() => {
		if (
			currentConversation &&
			(currentConversation.id || currentConversation.recipient)
		)
			getMessages();
	}, [currentConversation]);

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

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText) return;

		if (!currentConversation) return;

		if (!currentConversation.id) return handleCreateConversation(e);

		try {
			const response = await axios.post(
				`http://localhost:3000/api/conversations/${currentConversation.id}/messages`,
				{
					text: messageText,
				},
				{
					headers: {
						Authorization: `Bearer ${auth.accessToken}`,
					},
				}
			);
			if (response.status !== 200) return;

			const responseMessage = response.data.message;
			setMessages([...messages, responseMessage]);
		} catch (error) {
			console.error(error);
			return;
		}

		setMessageText("");
	};

	const handleCreateConversation = async (e) => {
		e.preventDefault();
		if (!messageText) return;

		if (
			!currentConversation ||
			!currentConversation.recipient ||
			!currentConversation.recipient.id
		)
			return;
		try {
			const response = await axios.post(
				`http://localhost:3000/api/users/${currentConversation.recipient.id}/messages`,
				{
					text: messageText,
				},
				{
					headers: {
						Authorization: `Bearer ${auth.accessToken}`,
					},
				}
			);
			if (response.status !== 200) return;

			const responseMessage = response.data.message;
			setMessages([...messages, responseMessage]);
			setRefreshConversations(true);
		} catch (error) {
			console.error(error);
			return;
		}

		setMessageText("");
	};

	return (
		<div className="chat-section">
			<div className="chat-section-header">
				<p className="contact-name">
					{currentConversation?.name || currentConversation?.recipient?.name}
				</p>
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
