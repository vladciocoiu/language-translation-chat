import React, { useState } from "react";
import ChatSection from "./ChatSection/ChatSection.jsx";
import ContactSection from "./ContactSection/ContactSection.jsx";
import ContactCard from "./ContactCard/ContactCard.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "./Messages.css";

const Messages = () => {
	const [isContactSectionOpen, setIsContactSectionOpen] = useState(true);
	const [cardIsOpen, setCardIsOpen] = useState(false);

	const toggleContactSection = () => {
		if (cardIsOpen) setCardIsOpen(false);
		setIsContactSectionOpen((open) => !open);
	};

	return (
		<div className="messages-page">
			<ContactSection
				isOpen={isContactSectionOpen}
				setCardIsOpen={setCardIsOpen}
			/>
			<ChatSection />
			{cardIsOpen && <ContactCard setCardIsOpen={setCardIsOpen} />}
			<button
				className={
					"contact-section-toggle icon-button" +
					(isContactSectionOpen ? " open" : " closed")
				}
				onClick={toggleContactSection}
			>
				<FontAwesomeIcon icon={isContactSectionOpen ? faArrowLeft : faUser} />
			</button>
		</div>
	);
};

export default Messages;
