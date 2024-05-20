import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes as close } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import "./ContactCard.css";

const ContactCard = ({ setCardIsOpen }) => {
	const divRef = useRef();
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	const openContact = useSelector((state) => state.openContact.value);

	useEffect(() => {
		if (divRef.current) {
			const windowHeight = window.innerHeight;
			const cardHeight = divRef.current.clientHeight;

			const leftCoord = openContact.coords.left + 20;
			const topCoord =
				openContact.coords.top + 20 + cardHeight > windowHeight
					? openContact.coords.top - cardHeight
					: openContact.coords.top + 20;

			setCoords({ top: topCoord, left: leftCoord });
		}
	}, [openContact]);

	return (
		<div className="contact-card" style={coords} ref={divRef}>
			<FontAwesomeIcon
				className="close-button"
				icon={close}
				onClick={() => setCardIsOpen(false)}
			/>
			<img
				className="profile-picture"
				src={
					openContact.contact.profilePicture || "/images/default-profile-picture.jpg"
				}
				alt="profile picture"
			/>
			<h2>{openContact.contact.name}</h2>
			<p>{openContact.contact.email}</p>
		</div>
	);
};

export default ContactCard;
