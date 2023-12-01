import React from "react";

const ChatSection = (user) => {
	return (
		<div className="chat-section">
			<h1>{user.name}</h1>
		</div>
	);
};

export default ChatSection;
