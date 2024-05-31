import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { change } from "../../../components/CurrentConversation";
import "./SearchSection.css";

const SearchSection = ({ isOpen }) => {
	const [results, setResults] = useState([]);
	const [query, setQuery] = useState("");
	const auth = useSelector((state) => state.auth.value);
	const dispatch = useDispatch();

	const startConversation = (user) => {
		const fakeConversation = {
			recipient: user,
			isGroup: 0,
		};
		dispatch(change(fakeConversation));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.get(
				`http://localhost:3000/api/users?query=${query}`,
				{
					headers: {
						Authorization: `Bearer ${auth.accessToken}`,
					},
				}
			);
			if (response.status !== 200) {
				console.error(new Error("Failed to search users"));
			} else {
				setResults(response.data.users);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className={"search-section " + (isOpen ? " open " : " closed ")}>
			<form onSubmit={handleSubmit}>
				<input
					className="search-input"
					type="text"
					placeholder="Search for a user..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</form>
			<ul className="user-list">
				{results.map((result) => (
					<li className="search-user" key={result.id}>
						<img
							className="user-profile-picture"
							src={
								result.profilePicture
									? `http://localhost:3000/${result.profilePicture}`
									: "/images/default-profile-picture.jpg"
							}
							alt="profile picture"
						/>
						<p className="user-name">{result.name}</p>
						<p className="user-email">{result.email}</p>
						<button
							className="start-conversation-button"
							onClick={() => startConversation(result)}
						>
							<FontAwesomeIcon icon={faMessage} />
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default SearchSection;
