import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import ChatSection from "./ChatSection/ChatSection.jsx";
import ContactSection from "./ContactSection/ContactSection.jsx";
import SearchSection from "./SearchSection/SearchSection.jsx";
import ConversationCard from "./ConversationCard/ConversationCard.jsx";
import GroupOptions from "./GroupOptions/GroupOptions.jsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faMagnifyingGlass,
	faXmark,
	faMessage,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./Messages.css";

const Messages = () => {
	const navigate = useNavigate();
	const [isContactSectionOpen, setIsContactSectionOpen] = useState(true);
	const [isSearchSectionOpen, setIsSearchSectionOpen] = useState(false);
	const [cardIsOpen, setCardIsOpen] = useState(false);
	const [refreshConversations, setRefreshConversations] = useState(false);
	const [isGroupOptionsOpen, setIsGroupOptionsOpen] = useState(false);

	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);

	const toggleContactSection = () => {
		if (cardIsOpen) setCardIsOpen(false);
		if (!isContactSectionOpen) setIsSearchSectionOpen(false);
		setIsContactSectionOpen((open) => !open);
	};

	const toggleSearchSection = () => {
		if (cardIsOpen) setCardIsOpen(false);
		if (!isSearchSectionOpen) setIsContactSectionOpen(false);
		setIsSearchSectionOpen((open) => !open);
	};

	return (
		<div className="messages-page">
			<SearchSection isOpen={isSearchSectionOpen} />
			<ContactSection
				isOpen={isContactSectionOpen}
				setCardIsOpen={setCardIsOpen}
				refreshConversations={refreshConversations}
				setRefreshConversations={setRefreshConversations}
			/>

			<ChatSection setRefreshConversations={setRefreshConversations} />
			{cardIsOpen ? <ConversationCard setCardIsOpen={setCardIsOpen} /> : ""}
			<button
				className={
					"contact-section-toggle icon-button" +
					(isSearchSectionOpen || isContactSectionOpen ? " open" : " closed")
				}
				onClick={toggleContactSection}
			>
				<FontAwesomeIcon icon={isContactSectionOpen ? faXmark : faMessage} />
			</button>
			<button
				className={
					"search-section-toggle icon-button" +
					(isSearchSectionOpen || isContactSectionOpen ? " open" : " closed")
				}
				onClick={toggleSearchSection}
			>
				<FontAwesomeIcon icon={isSearchSectionOpen ? faXmark : faMagnifyingGlass} />
			</button>
			{currentConversation && currentConversation.isGroup ? (
				<button
					className="group-options-toggle icon-button"
					onClick={() => setIsGroupOptionsOpen(true)}
				>
					<FontAwesomeIcon icon={faUsers} />
				</button>
			) : (
				""
			)}
			<Link to={"/profile"} className="profile-link icon-button">
				<FontAwesomeIcon icon={faUser} />
			</Link>
			{isGroupOptionsOpen ? (
				<GroupOptions
					setIsOpen={setIsGroupOptionsOpen}
					setRefreshConversations={setRefreshConversations}
				/>
			) : (
				""
			)}
		</div>
	);
};

export default Messages;
