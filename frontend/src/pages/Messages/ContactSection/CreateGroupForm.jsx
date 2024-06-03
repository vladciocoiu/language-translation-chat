import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { change } from "../../../components/CurrentConversation";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const CreateGroupForm = ({ setIsCreatingGroup, setRefreshConversations }) => {
	const accessToken = useSelector((state) => state.auth.value.accessToken);
	const axiosPrivate = useAxiosPrivate();

	const dispatch = useDispatch();
	const [name, setName] = useState("");

	const handleCreateGroup = async (e) => {
		e.preventDefault();
		if (name === "") return;
		try {
			const response = await axiosPrivate.post(
				`${import.meta.env.VITE_API_URL}/conversations`,
				{ name }
			);
			if (response.status !== 200) {
				console.error(new Error("Failed to create group"));
			} else {
				dispatch(change(response.data.conversation));
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsCreatingGroup(false);
			setRefreshConversations(true);
		}
	};

	const handleCloseForm = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsCreatingGroup(false);
	};

	return (
		<div className="create-group-overlay" onClick={handleCloseForm}>
			<div className="create-group-form">
				<form onSubmit={handleCreateGroup} onClick={(e) => e.stopPropagation()}>
					<input
						type="text"
						placeholder="Group name"
						onChange={(e) => setName(e.target.value)}
						value={name}
					/>
					<button type="submit">Create</button>
				</form>
			</div>
		</div>
	);
};

export default CreateGroupForm;
