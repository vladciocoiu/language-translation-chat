import React from "react";
import {
	changeCoords,
	changeConversation,
} from "../../../components/OpenConversation";
import { useDispatch } from "react-redux";

const ImageComponent = ({ image, conversation, setCardIsOpen }) => {
	const dispatch = useDispatch();

	const updateOpenConversation = (e) => {
		e.stopPropagation();
		dispatch(changeCoords({ left: e.clientX, top: e.clientY }));
		dispatch(changeConversation(conversation));
		setCardIsOpen(true);
	};

	return (
		<img
			className="profile-picture"
			src={image}
			alt="profile picture"
			onClick={updateOpenConversation}
		/>
	);
};

export default ImageComponent;
