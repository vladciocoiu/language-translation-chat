import React from "react";
import getDateStringFromTimestamp from "../../../utils/getDateStringFromTimestamp.js";
import "./MessageBubble.css";

const MessageBubble = ({ message }) => {
	return (
		<div
			className={
				"message-bubble" + (message.senderId === 0 ? " sent" : " received")
			}
		>
			<p className="message-text">{message.text}</p>
			<p className="message-timestamp">
				{getDateStringFromTimestamp(message.timestamp)}
			</p>
		</div>
	);
};

export default MessageBubble;
