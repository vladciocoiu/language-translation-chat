import React from "react";
import { changeCoords, changeContact } from "../../../components/OpenContact";
import { useDispatch } from "react-redux";

const ImageComponent = ({ image, contact, setCardIsOpen }) => {
	const dispatch = useDispatch();

	const updateOpenContact = (e) => {
		e.stopPropagation();
		dispatch(changeCoords({ left: e.clientX, top: e.clientY }));
		dispatch(changeContact(contact));
		setCardIsOpen(true);
	};

	return (
		<img
			className="profile-picture"
			src={image}
			alt="profile picture"
			onClick={updateOpenContact}
		/>
	);
};

export default ImageComponent;
