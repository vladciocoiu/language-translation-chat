import React from "react";
import ChatSection from "./ChatSection/ChatSection.jsx";
import ContactSection from "./ContactSection/ContactSection.jsx";
import "./Messages.css";

const Messages = () => {
	return (
		<div className="messages-page">
			<ContactSection />
			<ChatSection />
		</div>
	);
};

export default Messages;
