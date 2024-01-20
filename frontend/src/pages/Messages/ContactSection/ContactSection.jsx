import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ContactSection.css";
import { change } from "../../../components/CurrentContact";

const ContactSection = ({ isOpen }) => {
	const currentContact = useSelector((state) => state.currentContact.value);
	const dispatch = useDispatch();

	const mockContacts = [
		{ id: 1, name: "John Doe", email: "john.doe@gmail.com" },
		{ id: 2, name: "Jane Doe", email: "jane.doe@gmail.com" },
		{ id: 3, name: "John Smith", email: "john.smith@gmail.com" },
		{ id: 4, name: "Jane Smith", email: "jane.smith@gmail.com" },
		{ id: 5, name: "John Doe", email: "john.doe@gmail.com" },
		{ id: 6, name: "John Doe 2", email: "john.doe2@gmail.com" },
		{ id: 7, name: "Jane Doe 2", email: "jane.doe2@gmail.com" },
		{ id: 8, name: "John Smith 2", email: "john.smith2@gmail.com" },
		{ id: 9, name: "Jane Smith 2", email: "jane.smith2@gmail.com" },
		{ id: 10, name: "John Doe 2", email: "john.doe2@gmail.com" },
	];
	const [contacts, setContacts] = useState(mockContacts);

	return (
		<div className={"contact-section " + (isOpen ? "open" : "closed")}>
			<h1>Contacts</h1>
			<ul className="contact-list">
				{contacts.map((contact, index) => (
					<li
						key={index}
						className={
							"contact" + (currentContact?.id === contact.id ? " active" : "")
						}
						onClick={() => dispatch(change(contact))}
					>
						<p className="contact-name">{contact.name}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContactSection;
