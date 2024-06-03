import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Comment } from "react-loader-spinner";
import MessageBubble from "../MessageBubble/MessageBubble.jsx";
import "./ChatSection.css";

const ChatSection = ({ setRefreshConversations }) => {
	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);
	const auth = useSelector((state) => state.auth.value);
	const axiosPrivate = useAxiosPrivate();

	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState("");
	const [state, setState] = useState("not_selected");
	const scrollableRef = useRef();

	const webSocketUrl = import.meta.env.VITE_WS_URL;
	const { sendMessage, lastMessage, readyState } = useWebSocket(webSocketUrl, {
		onOpen: () => console.log("Connected"),
		onClose: () => console.log("Disconnected"),
		onError: (error) => console.log("WebSocket Error:", error),
		protocols: auth.accessToken,
		shouldReconnect: () => true,
	});

	const parseLastMessage = () => {
		const serializedData = JSON.parse(lastMessage.data);
		const buffer = new Uint8Array(serializedData.data);
		const jsonString = new TextDecoder().decode(buffer);

		const jsonData = JSON.parse(jsonString);
		return jsonData;
	};

	useEffect(() => {
		if (lastMessage !== null) {
			const parsedMessage = parseLastMessage();
			if (parsedMessage.conversationId !== currentConversation.id) return;
			setMessages((prevMessages) => [...prevMessages, parsedMessage]);
		}
	}, [lastMessage]);

	async function getMessages() {
		if (!currentConversation?.id && !currentConversation.recipient) return;
		const url =
			import.meta.env.VITE_API_URL +
			(currentConversation.id
				? `/conversations/${currentConversation.id}/messages?offset=0&limit=1000`
				: `/users/${currentConversation.recipient.id}/messages?offset=0&limit=1000`);
		try {
			const response = await axiosPrivate.get(url);
			if (response.status !== 200) {
				console.error(new Error("Failed to get messages"));

				return [];
			} else {
				setMessages(response.data.messages);
				setState("ready");
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
		) {
			setState("loading");
			getMessages();
		} else {
			setState("not_selected");
		}
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
			const response = await axiosPrivate.post(
				`${import.meta.env.VITE_API_URL}/conversations/${
					currentConversation.id
				}/messages`,
				{
					text: messageText,
				}
			);
			if (response.status !== 200) return;

			const responseMessage = response.data.message;
			sendMessage(JSON.stringify(responseMessage));

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
			const response = await axiosPrivate.post(
				`${import.meta.env.VITE_API_URL}/users/${
					currentConversation.recipient.id
				}/messages`,
				{
					text: messageText,
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
				{state === "not_selected" && (
					<div className="not-selected">
						<p>Select a conversation to start chatting!</p>
					</div>
				)}

				{state === "loading" && (
					<Comment
						visible={true}
						height="80"
						width="80"
						ariaLabel="comment-loading"
						wrapperStyle={{}}
						wrapperClass="comment-wrapper"
						color="#fff"
						backgroundColor="var(--color-primary-3)"
					/>
				)}

				{state === "ready" &&
					messages.map((message, index) => (
						<MessageBubble key={index} message={message} setMessages={setMessages} />
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
