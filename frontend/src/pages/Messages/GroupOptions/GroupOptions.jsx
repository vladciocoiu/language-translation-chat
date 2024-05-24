import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../../components/CurrentConversation";
import "./GroupOptions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const GroupOptions = ({ setIsOpen }) => {
	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);
	const dispatch = useDispatch();
	const members = [
		{ id: 1, name: "User1", email: "user1@abc.com" },
		{ id: 2, name: "User2", email: "user2@abc.com" },
		{ id: 3, name: "User3", email: "user3@abc.com" },
		{ id: 4, name: "User4", email: "user4@abc.com" },
		{ id: 5, name: "User5", email: "user5@abc.com" },
		{ id: 6, name: "User6", email: "user6@abc.com" },
		{ id: 7, name: "User7", email: "user7@abc.com" },
		{ id: 8, name: "User8", email: "user8@abc.com" },
		{ id: 9, name: "User9", email: "user9@abc.com" },
		{ id: 10, name: "User10", email: "user10@abc.com" },
	];
	const [addMemberEmail, setAddMemberEmail] = useState("");

	const handleCloseGroupOptions = (e) => {
		e.stopPropagation();
		setIsOpen(false);
	};
	const handleLeaveGroup = () => {
		dispatch(change(null));
	};
	const handleDeleteGroup = () => {
		dispatch(change(null));
	};
	const handleAddMember = (e) => {
		e.preventDefault();
		console.log("Adding member");
	};
	const handleRemoveMember = (memberId) => {
		console.log("Removing member with id", memberId);
	};

	useEffect(() => {
		if (
			!currentConversation ||
			!currentConversation.isGroup ||
			!currentConversation.id
		) {
			setIsOpen(false);
		}
	}, [currentConversation]);

	return (
		<div className="group-options-overlay" onClick={handleCloseGroupOptions}>
			<div className="group-options" onClick={(e) => e.stopPropagation()}>
				<h2>{currentConversation?.name}</h2>
				<ul className="members-list">
					{members.map((member) => (
						<li className="group-member" key={member.id}>
							<img
								className="member-profile-picture"
								src={member.profilePicture || "/images/default-profile-picture.jpg"}
								alt="profile picture"
							/>
							<div className="member-info">
								<p className="member-name">{member.name}</p>
								<p className="member-email">{member.email}</p>
							</div>
							<button
								className="remove-member-button"
								onClick={() => handleRemoveMember(member.id)}
							>
								<FontAwesomeIcon icon={faTimes} />
							</button>
						</li>
					))}
				</ul>
				<form className="add-member-form" onSubmit={handleAddMember}>
					<input
						type="text"
						value={addMemberEmail}
						onChange={(e) => setAddMemberEmail(e.target.value)}
						placeholder="Add member by email"
					/>
					<button type="submit">
						<FontAwesomeIcon icon={faPlus} />
					</button>
				</form>
				<button className="leave-group" onClick={handleLeaveGroup}>
					Leave group
				</button>
				<button className="delete-group" onClick={handleDeleteGroup}>
					Delete group
				</button>
			</div>
		</div>
	);
};

export default GroupOptions;
