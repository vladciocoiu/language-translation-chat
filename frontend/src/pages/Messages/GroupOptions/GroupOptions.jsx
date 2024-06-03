import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { change } from "../../../components/CurrentConversation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./GroupOptions.css";
import defaultPicUrls from "../../../utils/defaultPicUrls";

const GroupOptions = ({ setIsOpen, setRefreshConversations }) => {
	const currentConversation = useSelector(
		(state) => state.currentConversation.value
	);
	const auth = useSelector((state) => state.auth.value);
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();

	const [addMemberEmail, setAddMemberEmail] = useState("");
	const [addMemberError, setAddMemberError] = useState(false);

	const handleCloseGroupOptions = (e) => {
		e.stopPropagation();
		setIsOpen(false);
	};
	const handleLeaveGroup = async () => {
		if (!currentConversation?.id) return;
		try {
			const response = await axiosPrivate.delete(
				`${import.meta.env.VITE_API_URL}/conversations/${
					currentConversation.id
				}/users/${auth.userId}`
			);
			if (response.status !== 200) return;
			dispatch(change(null));
			setRefreshConversations(true);
		} catch (error) {
			console.error(error);
		}
	};
	const handleDeleteGroup = async () => {
		if (!currentConversation?.id) return;
		try {
			const response = await axiosPrivate.delete(
				`${import.meta.env.VITE_API_URL}/conversations/${currentConversation.id}`
			);
			if (response.status !== 200) return;
			dispatch(change(null));
			setRefreshConversations(true);
		} catch (error) {
			console.error(error);
		}
		dispatch(change(null));
	};
	const handleAddMember = async (e) => {
		e.preventDefault();
		if (!currentConversation?.id) return;
		if (addMemberEmail === "") {
			setAddMemberError(true);
			return;
		}
		try {
			const response = await axiosPrivate.post(
				`${import.meta.env.VITE_API_URL}/conversations/${
					currentConversation.id
				}/users`,
				{ email: addMemberEmail }
			);
			if (response.status !== 200) {
				setAddMemberError(true);
			} else {
				dispatch(
					change({
						...currentConversation,
						members: [...currentConversation.members, response.data.user],
					})
				);
				setAddMemberEmail("");
			}
		} catch (error) {
			console.error(error);
			setAddMemberError(true);
		}
	};
	const handleRemoveMember = async (memberId) => {
		if (!currentConversation?.id) return;
		try {
			const response = await axiosPrivate.delete(
				`${import.meta.env.VITE_API_URL}/conversations/${
					currentConversation.id
				}/users/${memberId}`
			);
			if (response.status !== 200) return;
			dispatch(
				change({
					...currentConversation,
					members: currentConversation.members.filter(
						(member) => member.id !== memberId
					),
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	const handleChangeEmail = (e) => {
		setAddMemberEmail(e.target.value);
		if (addMemberEmail) setAddMemberError(false);
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
					{currentConversation?.members.map((member) => (
						<li className="group-member" key={member.id}>
							<img
								className="member-profile-picture"
								src={
									member.profilePicture
										? `${import.meta.env.VITE_BACKEND_URL}/${member.profilePicture}`
										: defaultPicUrls.profile
								}
								alt="profile picture"
							/>
							<div className="member-info">
								<p className="member-name">{member.name}</p>
								<p className="member-email">{member.email}</p>
							</div>
							{member.id !== auth.userId && (
								<button
									className="remove-member-button"
									onClick={() => handleRemoveMember(member.id)}
								>
									<FontAwesomeIcon icon={faTimes} />
								</button>
							)}
						</li>
					))}
				</ul>
				<form className="add-member-form" onSubmit={handleAddMember}>
					<input
						type="text"
						value={addMemberEmail}
						onChange={handleChangeEmail}
						placeholder="Add member by email"
						className={addMemberError ? "add-member-error" : ""}
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
