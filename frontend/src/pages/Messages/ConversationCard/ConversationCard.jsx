import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes as close } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import "./ConversationCard.css";

const ConversationCard = ({ setCardIsOpen }) => {
	const divRef = useRef();
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	const openConversation = useSelector((state) => state.openConversation.value);

	useEffect(() => {
		if (divRef.current) {
			const windowHeight = window.innerHeight;
			const cardHeight = divRef.current.clientHeight;

			const leftCoord = openConversation.coords.left + 20;
			const topCoord =
				openConversation.coords.top + 20 + cardHeight > windowHeight
					? openConversation.coords.top - cardHeight
					: openConversation.coords.top + 20;

			setCoords({ top: topCoord, left: leftCoord });
		}
	}, [openConversation]);

	return (
		<div className="conversation-card" style={coords} ref={divRef}>
			<FontAwesomeIcon
				className="close-button"
				icon={close}
				onClick={() => setCardIsOpen(false)}
			/>
			<img
				className="profile-picture"
				src={
					openConversation.Conversation.recipient?.profilePicture ||
					"/images/default-profile-picture.jpg"
				}
				alt="profile picture"
			/>
			<h2>
				{openConversation.Conversation.name?.length
					? openConversation.Conversation.name
					: openConversation.Conversation.recipient?.name}
			</h2>
			{openConversation.Conversation.isGroup ? (
				<p>Members: {openConversation.Conversation.members.length}</p>
			) : (
				<p>{openConversation.Conversation.recipient?.email}</p>
			)}
		</div>
	);
};

export default ConversationCard;
