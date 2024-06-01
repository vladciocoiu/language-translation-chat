import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { Comment } from "react-loader-spinner";
import axios from "axios";
import { change } from "../../../components/CurrentConversation";
import "./SearchSection.css";
import defaultPicUrls from "../../../utils/defaultPicUrls";

const SearchSection = ({ isOpen }) => {
	const [results, setResults] = useState([]);
	const [query, setQuery] = useState("");
	const [state, setState] = useState("loaded");
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
		setState("loading");
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/users?query=${query}`,
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
				setState("loaded");
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
			{state === "loading" && (
				<Comment
					visible={true}
					height="80"
					width="80"
					ariaLabel="comment-loading"
					wrapperStyle={{}}
					wrapperClass="comment-wrapper"
					color="#fff"
					backgroundColor="#000"
				/>
			)}
			{state === "loaded" && (
				<ul className="user-list">
					{results.map((result) => (
						<li className="search-user" key={result.id}>
							<img
								className="user-profile-picture"
								src={
									result.profilePicture
										? `${import.meta.env.VITE_BACKEND_URL}/${result.profilePicture}`
										: defaultPicUrls.profile
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
			)}
		</div>
	);
};

export default SearchSection;
