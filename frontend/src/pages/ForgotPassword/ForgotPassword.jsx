import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [email, setEmail] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		setError("");

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/forgot-password`,
				{
					email,
				}
			);

			if (response.status === 200) {
				setMessage("Please check your email");
			} else {
				setError("Failed to send email");
			}
		} catch (error) {
			console.error(error);
			setError("Failed to send email");
		}
	};

	return (
		<div className="forgot-password">
			{message && <div className="message">{message}</div>}
			{error && <div className="error">{error}</div>}
			<h1>Forgot Password</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default ForgotPassword;
