import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
	const navigate = useNavigate();
	const auth = useSelector((state) => state.auth.value);

	const [user, setUser] = useState({});
	const [currentLanguage, setCurrentLanguage] = useState(user.language);
	const [currentName, setCurrentName] = useState(user.name);
	const [currentProfilePicture, setCurrentProfilePicture] = useState(
		user.profilePicture
	);
	const [currentEmail, setCurrentEmail] = useState(user.email);
	const [isEditingName, setIsEditingName] = useState(false);

	const fetchUser = async () => {
		try {
			const response = await axios.get(`http://localhost:3000/api/users/me`, {
				headers: {
					Authorization: `Bearer ${auth.accessToken}`,
				},
			});
			if (response.status !== 200) return;
			setUser(response.data.user);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	useEffect(() => {
		setCurrentLanguage(user.language);
		setCurrentName(user.name);
		setCurrentProfilePicture(user.profilePicture);
		setCurrentEmail(user.email);
	}, [user]);

	const handleChangeLanguage = (e) => {
		const newLanguage = e.target.value;
		setCurrentLanguage(newLanguage);
	};
	const handleNameKeyDown = (e) => {
		if (e.key === "Enter") {
			setIsEditingName(false);
		}
	};
	const handleUploadProfilePicture = async (e) => {
		const file = e.target.files[0];
		setCurrentProfilePicture(URL.createObjectURL(file));
	};
	const handleSave = async () => {
		navigate("/messages");
	};

	return (
		<div className="profile-page">
			<img
				className="profile-picture"
				src={currentProfilePicture || "/images/default-profile-picture.jpg"}
				alt="profile picture"
			/>
			<input
				type="file"
				className="file-input"
				accept="image/*"
				onChange={handleUploadProfilePicture}
			/>
			{isEditingName ? (
				<input
					type="text"
					value={currentName}
					onChange={(e) => setCurrentName(e.target.value)}
					onKeyDown={handleNameKeyDown}
					className="name-input"
					placeholder="Name"
				/>
			) : (
				<h2 onClick={() => setIsEditingName(true)}>{currentName}</h2>
			)}
			<p>{currentEmail}</p>
			<div className="language-div">
				<label htmlFor="language">Preferred language</label>
				<select
					name="language"
					value={currentLanguage}
					onChange={handleChangeLanguage}
				>
					<option value="en">English</option>
					<option value="fr">French</option>
					<option value="it">Italian</option>
					<option value="ro">Romanian</option>
				</select>
			</div>
			<button className="save-button" onClick={handleSave}>
				Save
			</button>
		</div>
	);
};

export default Profile;
