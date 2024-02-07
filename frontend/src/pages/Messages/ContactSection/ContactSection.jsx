import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ContactSection.css";
import { change } from "../../../components/CurrentContact";
import ImageComponent from "./ImageComponent";

const ContactSection = ({ isOpen, setCardIsOpen }) => {
	const currentContact = useSelector((state) => state.currentContact.value);
	const dispatch = useDispatch();

	const mockContacts = [
		{ id: 1, name: "John Doe", email: "john.doe@gmail.com", profilePicture: "" },
		{ id: 2, name: "Jane Doe", email: "jane.doe@gmail.com", profilePicture: "" },
		{
			id: 3,
			name: "John Smith",
			email: "john.smith@gmail.com",
			profilePicture: "",
		},
		{
			id: 4,
			name: "Jane Smith",
			email: "jane.smith@gmail.com",
			profilePicture: "",
		},
		{ id: 5, name: "John Doe", email: "john.doe@gmail.com", profilePicture: "" },
		{
			id: 6,
			name: "John Doe 2",
			email: "john.doe2@gmail.com",
			profilePicture: "",
		},
		{
			id: 7,
			name: "Jane Doe 2",
			email: "jane.doe2@gmail.com",
			profilePicture: "",
		},
		{
			id: 8,
			name: "John Smith 2",
			email: "john.smith2@gmail.com",
			profilePicture: "",
		},
		{
			id: 9,
			name: "Jane Smith 2",
			email: "jane.smith2@gmail.com",
			profilePicture: "",
		},
		{
			id: 10,
			name: "John Doe 2",
			email: "john.doe2@gmail.com",
			profilePicture: "",
		},
		{
			id: 11,
			name: "John Doe 3",
			email: "john.doe3@gmail.com",
			profilePicture: "",
		},
		{
			id: 12,
			name: "Jane Doe 3",
			email: "jane.doe3@gmail.com",
			profilePicture: "",
		},
		{
			id: 13,
			name: "John Smith 3",
			email: "john.smith3@gmail.com",
			profilePicture: "",
		},
		{
			id: 14,
			name: "Jane Smith 3",
			email: "jane.smith3@gmail.com",
			profilePicture: "",
		},
		{
			id: 15,
			name: "John Doe 3",
			email: "john.doe3@gmail.com",
			profilePicture: "",
		},
	];
	const [contacts, setContacts] = useState(mockContacts);

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
							image={
								contact.profilePicture || "public/images/default-profile-picture.jpg"
							}
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
