import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./ContactSection.css";
import { change } from "../../../components/CurrentContact";
import ImageComponent from "./ImageComponent";

const ContactSection = ({ isOpen, setCardIsOpen }) => {
	const currentContact = useSelector((state) => state.currentContact.value);
	const dispatch = useDispatch();
	const auth = useSelector((state) => state.auth.value);

	const [contacts, setContacts] = useState([]);

	async function getContacts() {
		try {
			const response = await axios.get("http://localhost:3000/api/users?query=", {
				headers: {
					Authorization: `Bearer ${auth.accessToken}`,
				},
			});
			if (response.status !== 200) {
				console.error(new Error("Failed to get contacts"));

				return [];
			} else {
				setContacts(response.data.users);
			}
			return response.data.users;
		} catch (error) {
			console.error(error);
			return [];
		}
	}

	useEffect(() => {
		getContacts();
	}, []);

	useEffect(() => {
		dispatch(change(contacts[0]));
	}, []);

	return (
		<div className={"contact-section " + (isOpen ? "open" : "closed")}>
			<div className="contacts-heading-div">
				<h1>Contacts</h1>
			</div>
			<ul className="contact-list">
				{contacts.map((contact, index) => (
					<li
						key={index}
						className={
							"contact" + (currentContact?.id === contact.id ? " active" : "")
						}
						onClick={() => dispatch(change(contact))}
					>
						<ImageComponent
							image={contact.profilePicture || "/images/default-profile-picture.jpg"}
							contact={contact}
							setCardIsOpen={setCardIsOpen}
						/>
						<p className="contact-name">{contact.name}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContactSection;
