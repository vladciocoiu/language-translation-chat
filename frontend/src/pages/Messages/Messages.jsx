import React, { useState } from "react";
import ChatSection from "./ChatSection/ChatSection.jsx";
import ContactSection from "./ContactSection/ContactSection.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Messages.css";

const Messages = () => {
	const [isContactSectionOpen, setIsContactSectionOpen] = useState(true);

	return (
		<div className="messages-page">
			<ContactSection isOpen={isContactSectionOpen} />
			<ChatSection />
			<button
				className={
					"contact-section-toggle icon-button" +
					(isContactSectionOpen ? " open" : " closed")
				}
				onClick={() =>
					setIsContactSectionOpen((isContactSectionOpen) => !isContactSectionOpen)
				}
			>
				<FontAwesomeIcon icon={isContactSectionOpen ? faArrowLeft : faUser} />
			</button>
		</div>
	);
};

export default Messages;
