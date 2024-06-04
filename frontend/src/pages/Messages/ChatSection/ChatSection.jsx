import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPaperPlane,
	faImage,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Comment } from "react-loader-spinner";
import MessageBubble from "../MessageBubble/MessageBubble.jsx";
import "./ChatSection.css";

const ChatSection = ({ setRefreshConversations }) => {
	const PAGE_SIZE = 20;

	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);
	const auth = useSelector((state) => state.auth.value);
	const axiosPrivate = useAxiosPrivate();

	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState("");
	const [file, setFile] = useState(null);
	const [state, setState] = useState("not_selected");
	const [scroll, setScroll] = useState(true);
	const [moreMessages, setMoreMessages] = useState(true);

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
			setScroll(true);
		}
	}, [lastMessage]);

	async function getMessages(offset) {
		if (!currentConversation?.id && !currentConversation.recipient) return;
		const url =
			import.meta.env.VITE_API_URL +
			(currentConversation.id
				? `/conversations/${currentConversation.id}/messages?offset=${offset}&limit=20`
				: `/users/${currentConversation.recipient.id}/messages?offset=${offset}&limit=20`);
		try {
			const response = await axiosPrivate.get(url);
			if (response.status !== 200) {
				console.error(new Error("Failed to get messages"));

				return [];
			} else {
				if (response.data.messages.length < PAGE_SIZE) setMoreMessages(false);

				setMessages((m) => [...response.data.messages].reverse().concat(m));
				setState("ready");
			}
			return response.data.messages;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	useEffect(() => {
		const get = async () => {
			await getMessages(0);
			setScroll(true);
		};
		if (
			currentConversation &&
			(currentConversation.id || currentConversation.recipient)
		) {
			setState("loading");

			setMessages([]);
			setMoreMessages(true);

			get();
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
		setScroll(false);
	}, [scroll]);

	const handleMessageChange = (e) => {
		if (e.target.value.length > 255) return;
		setMessageText(e.target.value);
	};

	const handleFileChange = (e) => {
		const chosenFile = e.target.files[0];
		if (chosenFile) {
			setFile(chosenFile);
		}
	};

	const handleFileDelete = (e) => {
		e.stopPropagation();
		setFile(null);
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!messageText && !file) return;

		if (!currentConversation) return;

		if (!currentConversation.id) return handleCreateConversation(e);

		const formData = new FormData();
		formData.append("image", file);

		const json = messageText ? { text: messageText } : {};
		formData.append("json", JSON.stringify(json));

		try {
			const response = await axiosPrivate.post(
				`${import.meta.env.VITE_API_URL}/conversations/${
					currentConversation.id
				}/messages`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (response.status !== 200) return;

			const responseMessage = response.data.message;
			sendMessage(JSON.stringify(responseMessage));

			setMessages([...messages, responseMessage]);
			setScroll(true);
		} catch (error) {
			console.error(error);
			return;
		}

		setMessageText("");
		setFile(null);
	};

	const handleCreateConversation = async (e) => {
		e.preventDefault();
		if (!messageText && !file) return;

		if (
			!currentConversation ||
			!currentConversation.recipient ||
			!currentConversation.recipient.id
		)
			return;

		const formData = new FormData();
		formData.append("image", file);

		const json = messageText ? { text: messageText } : {};
		formData.append("json", JSON.stringify(json));

		try {
			const response = await axiosPrivate.post(
				`${import.meta.env.VITE_API_URL}/users/${
					currentConversation.recipient.id
				}/messages`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
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

				{state === "ready" && (
					<>
						{moreMessages && (
							<button
								className="load-more"
								onClick={() => getMessages(messages.length)}
							>
								Load more messages
							</button>
						)}
						{messages.map((message, index) => (
							<MessageBubble key={index} message={message} setMessages={setMessages} />
						))}
					</>
				)}
			</div>
			<form className="message-input" onSubmit={handleSendMessage}>
				<input
					type="text"
					placeholder="Type a message..."
					value={messageText}
					onChange={handleMessageChange}
				/>
				<label className="file-upload">
					<input
						type="file"
						className="file-input"
						onChange={handleFileChange}
						accept="image/*"
					/>
					<FontAwesomeIcon icon={faImage} />
					{file && (
						<FontAwesomeIcon
							className="delete-file"
							icon={faXmark}
							onClick={handleFileDelete}
						/>
					)}
					{file && <img src={URL.createObjectURL(file)} alt="preview" />}
				</label>
				<button type="submit">
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</form>
		</div>
	);
};

export default ChatSection;
