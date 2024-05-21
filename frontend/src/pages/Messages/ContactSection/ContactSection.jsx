import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./ContactSection.css";
import { change } from "../../../components/CurrentConversation";
import ImageComponent from "./ImageComponent";

const ContactSection = ({
	isOpen,
	setCardIsOpen,
	refreshConversations,
	setRefreshConversations,
}) => {
	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth.value);

	const [conversations, setConversations] = useState([]);

	async function getConversations() {
		try {
			const response = await axios.get(
				`http://localhost:3000/api/users/${auth.userId}/conversations`,
				{
					headers: {
						Authorization: `Bearer ${auth.accessToken}`,
					},
				}
			);
			if (response.status !== 200) {
				console.error(new Error("Failed to get conversations"));

				return [];
			} else {
				const convs = response.data.conversations.map((conversation) => {
					if (conversation.isGroup) return conversation;
					return {
						...conversation,
						recipient: conversation.members.find((user) => user.id !== auth.userId),
					};
				});
				setConversations(convs);
			}
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	useEffect(() => {
		getConversations();
		setRefreshConversations(false);
	}, [refreshConversations]);

	useEffect(() => {
		dispatch(change(conversations[0]));
	}, []);

	return (
		<div className={"contact-section " + (isOpen ? "open" : "closed")}>
			<div className="contacts-heading-div">
				<h1>Conversations</h1>
			</div>
			<ul className="contact-list">
				{conversations.map((conversation, index) => (
					<li
						key={index}
						className={
							"contact" +
							(currentConversation?.id === conversation.id ? " active" : "")
						}
						onClick={() => dispatch(change(conversation))}
					>
						<ImageComponent
							image={
								conversation.recipient?.profilePicture ||
								"/images/default-profile-picture.jpg"
							}
							conversation={conversation}
							setCardIsOpen={setCardIsOpen}
						/>
						<p className="contact-name">
							{conversation.name || conversation.recipient.name}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContactSection;
