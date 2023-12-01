import React, { useState } from "react";
import "./ContactsSection.css";

const ContactsSection = () => {
	const mockContacts = [
		{ name: "John Doe", email: "john.doe@gmail.com" },
		{ name: "Jane Doe", email: "jane.doe@gmail.com" },
		{ name: "John Smith", email: "john.smith@gmail.com" },
		{ name: "Jane Smith", email: "jane.smith@gmail.com" },
		{ name: "John Doe", email: "john.doe@gmail.com" },
		{ name: "John Doe 2", email: "john.doe2@gmail.com" },
		{ name: "Jane Doe 2", email: "jane.doe2@gmail.com" },
		{ name: "John Smith 2", email: "john.smith2@gmail.com" },
		{ name: "Jane Smith 2", email: "jane.smith2@gmail.com" },
		{ name: "John Doe 2", email: "john.doe2@gmail.com" },
	];
	const [contacts, setContacts] = useState(mockContacts);

	return (
		<div className="contacts-section">
			<h1>Contacts</h1>
			<ul className="contacts-list">
				{contacts.map((contact, index) => (
					<li key={index} className="contact">
						<p className="contact-name">{contact.name}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ContactsSection;
