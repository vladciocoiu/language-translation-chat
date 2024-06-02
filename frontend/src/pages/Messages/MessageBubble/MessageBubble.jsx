import React, { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import getDateStringFromTimestamp from "../../../utils/getDateStringFromTimestamp.js";
import { useSelector } from "react-redux";
import "./MessageBubble.css";
import Linkify from "./Linkify.jsx";

const MessageBubble = ({ message, setMessages }) => {
	const userId = useSelector((state) => state.auth.value.userId);
	const userLanguage = useSelector((state) => state.auth.value.language);
	const accessToken = useSelector((state) => state.auth.value.accessToken);
	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);
	const axiosPrivate = useAxiosPrivate();

	const [isTranslated, setIsTranslated] = useState(false);

	const handleTranslate = async () => {
		if (
			!isTranslated &&
			(!message.translation || message.translation.targetLanguage !== userLanguage)
		) {
			try {
				const response = await axiosPrivate.post(
					`${import.meta.env.VITE_API_URL}/messages/${message.id}/translate`,
					{
						targetLanguage: userLanguage,
					}
				);

				if (response.status !== 200) return;

				const translation = response.data;
				setMessages((messages) =>
					messages.map((m) =>
						m.id === message.id
							? {
									...m,
									translation: {
										...translation,
										targetLanguage: userLanguage,
									},
							  }
							: m
					)
				);
			} catch (error) {
				console.error(error);
			}
		}
		setIsTranslated((t) => !t);
	};

	return (
		<div
			className={
				"message-bubble" + (message.sender.id === userId ? " sent" : " received")
			}
		>
			{message.sender.id !== userId && (
				<div className="message-details">
					<button className="toggle-translate" onClick={handleTranslate}>
						{isTranslated ? "Show original" : "Translate"}
					</button>
					{currentConversation.isGroup && (
						<p className="message-sender">{message.sender.name}</p>
					)}
				</div>
			)}
			<p className="message-text">
				<Linkify
					text={isTranslated ? message.translation.translatedText : message.text}
				/>
			</p>
			<p className="message-timestamp">
				{getDateStringFromTimestamp(message.createdAt)}
			</p>
		</div>
	);
};

export default MessageBubble;
