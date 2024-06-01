import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword = () => {
	const [error, setError] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const token = new URLSearchParams(window.location.search).get("token");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/reset-password`,
				{
					password,
					token,
				}
			);

			if (response.status === 200) {
				navigate("/login");
			} else {
				setError(response.data?.error || "Failed to reset password");
			}
		} catch (error) {
			console.error(error);
			setError(error.response?.data?.error || "Failed to reset password");
		}
	};

	return (
		<div className="reset-password">
			{error && <div className="error">{error}</div>}
			<h1>Reset Password</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="password"
					placeholder="Enter your new password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">Reset</button>
			</form>
		</div>
	);
};

export default ResetPassword;
