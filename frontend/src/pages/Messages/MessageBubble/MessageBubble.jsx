import React, { useState } from "react";
import axios from "axios";
import getDateStringFromTimestamp from "../../../utils/getDateStringFromTimestamp.js";
import { useSelector } from "react-redux";
import "./MessageBubble.css";

const MessageBubble = ({ message, setMessages }) => {
	const userId = useSelector((state) => state.auth.value.userId);
	const userLanguage = useSelector((state) => state.auth.value.language);
	const accessToken = useSelector((state) => state.auth.value.accessToken);

	const [isTranslated, setIsTranslated] = useState(false);

	const handleTranslate = async () => {
		if (
			!isTranslated &&
			(!message.translation || message.translation.targetLanguage !== userLanguage)
		) {
			try {
				const response = await axios.post(
					`${import.meta.env.VITE_API_URL}/messages/${message.id}/translate`,
					{
						targetLanguage: userLanguage,
					},
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
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
				<button className="toggle-translate" onClick={handleTranslate}>
					{isTranslated ? "Show original" : "Translate"}
				</button>
			)}
			<p className="message-text">
				{isTranslated ? message.translation.translatedText : message.text}
			</p>
			<p className="message-timestamp">
				{getDateStringFromTimestamp(message.createdAt)}
			</p>
		</div>
	);
};

export default MessageBubble;
