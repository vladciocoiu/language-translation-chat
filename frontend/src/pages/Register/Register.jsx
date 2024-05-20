import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RegisterRequest } from "./RegisterRequest";
import "./Register.css";

const Register = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const auth = useSelector((state) => state.auth.value);

	const handleDisplayNameChange = (e) => {
		setDisplayName(e.target.value);
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await RegisterRequest(email, displayName, password);
			navigate("/login");
		} catch (error) {
			setError(error.message);
		}
	};

	if (auth.isLoggedIn) return <Navigate to="/messages" />;

	return (
		<div className="register-box-container">
			{error && <div className="error">{error}</div>}
			<div className="register-box">
				<h2 className="register-heading">Register</h2>
				<form className="register-form" onSubmit={handleSubmit}>
					<input
						name="displayName"
						type="text"
						value={displayName}
						placeholder="Display Name"
						onChange={handleDisplayNameChange}
					/>
					<input
						name="email"
						type="email"
						value={email}
						placeholder="Email"
						onChange={handleEmailChange}
					/>
					<input
						name="password"
						type="password"
						value={password}
						placeholder="Password"
						onChange={handlePasswordChange}
					/>
					<button className="submit-button button" type="submit">
						Register
					</button>
				</form>
			</div>
			<p className="login-link">
				Already have an account? <Link to="/login">Login</Link>
			</p>
		</div>
	);
};

export default Register;
