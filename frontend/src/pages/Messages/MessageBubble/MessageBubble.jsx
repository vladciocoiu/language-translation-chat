import React from "react";
import getDateStringFromTimestamp from "../../../utils/getDateStringFromTimestamp.js";
import { useSelector } from "react-redux";
import "./MessageBubble.css";

const MessageBubble = ({ message }) => {
	const userId = useSelector((state) => state.auth.value.userId);

	return (
		<div
			className={
				"message-bubble" + (message.sender.id === userId ? " sent" : " received")
			}
		>
			<p className="message-text">{message.text}</p>
			<p className="message-timestamp">
				{getDateStringFromTimestamp(message.createdAt)}
			</p>
		</div>
	);
};

export default MessageBubble;
