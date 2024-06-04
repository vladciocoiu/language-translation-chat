import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { changeUser, setAccessToken, setLoggedIn } from "../../components/Auth";
import "./Profile.css";
import defaultPicUrls from "../../utils/defaultPicUrls";

const Profile = () => {
	const navigate = useNavigate();
	const auth = useSelector((state) => state.auth.value);
	const dispatch = useDispatch();
	const axiosPrivate = useAxiosPrivate();

	const [user, setUser] = useState({});
	const [currentLanguage, setCurrentLanguage] = useState(user.language);
	const [currentName, setCurrentName] = useState(user.name);
	const [currentProfilePicture, setCurrentProfilePicture] = useState(
		user.profilePicture
	);
	const [displayImage, setDisplayImage] = useState(null);
	const [currentEmail, setCurrentEmail] = useState(user.email);
	const [isEditingName, setIsEditingName] = useState(false);

	const fetchUser = async () => {
		try {
			const response = await axiosPrivate.get(
				`${import.meta.env.VITE_API_URL}/users/me`
			);
			if (response.status !== 200) return;
			setUser(response.data.user);
		} catch (error) {
			console.error(error);
		}
	};

	const editUser = async () => {
		if (!user?.id) return false;

		const formData = new FormData();
		if (currentProfilePicture)
			formData.append("profilePicture", currentProfilePicture);
		const json = {};
		if (currentLanguage && currentLanguage !== user.language)
			json.language = currentLanguage;
		if (currentName && currentName !== user.name) json.name = currentName;
		formData.append("json", JSON.stringify(json));

		if (!json.language && !json.name && !currentProfilePicture) return true;

		try {
			const response = await axiosPrivate.put(
				`${import.meta.env.VITE_API_URL}/users/${user.id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (response.status !== 200) return false;
			setUser(response.data.user);
			dispatch(
				changeUser({
					email: response.data.user.email,
					userId: response.data.user.id,
					language: response.data.user.language,
				})
			);
		} catch (error) {
			console.error(error);
			return false;
		}
		return true;
	};

	useEffect(() => {
		fetchUser();
	}, []);

	useEffect(() => {
		if (!currentProfilePicture) return;
		setDisplayImage(URL.createObjectURL(currentProfilePicture));
	}, [currentProfilePicture]);

	useEffect(() => {
		setCurrentLanguage(user.language);
		setCurrentName(user.name);
		setCurrentEmail(user.email);

		setDisplayImage(
			user?.profilePicture
				? `${import.meta.env.VITE_BACKEND_URL}/${user.profilePicture}`
				: defaultPicUrls.profile
		);
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
		setCurrentProfilePicture(file);
	};
	const handleSave = async () => {
		const success = await editUser();
		if (success) navigate("/messages");
	};
	const handleChangeName = (e) => {
		if (e.target.value.length > 30) return;
		setCurrentName(e.target.value);
	};

	const handleLogout = async () => {
		try {
			await axiosPrivate.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
			dispatch(changeUser({}));
			dispatch(setLoggedIn(false));
			dispatch(setAccessToken(null));
			navigate("/");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="profile-page">
			<img
				className="profile-picture"
				src={displayImage || defaultPicUrls.profile}
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
					onChange={handleChangeName}
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
			<button className="logout-button" onClick={handleLogout}>
				Logout
			</button>
		</div>
	);
};

export default Profile;
