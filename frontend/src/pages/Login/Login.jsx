import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeUser, setAccessToken, setLoggedIn } from "../../components/Auth";
import { LoginRequest } from "./LoginRequest";
import "./Login.css";

const Login = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const auth = useSelector((state) => state.auth.value);
	const dispatch = useDispatch();

	const handleEmailChange = (e) => {
		if (error) setError("");
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		if (error) setError("");
		setPassword(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await LoginRequest(email, password);
			dispatch(
				changeUser({ email, userId: response.userId, language: response.language })
			);
			dispatch(setAccessToken(response.accessToken));
			dispatch(setLoggedIn(true));
			navigate("/messages");
		} catch (error) {
			setError(error.message);
		}
	};

	if (auth.isLoggedIn) return <Navigate to="/messages" />;

	return (
		<div className="login-box-container">
			{error && <div className="error">{error}</div>}
			<div className="login-box">
				<h2 className="login-heading">Login</h2>
				<form className="login-form" onSubmit={handleSubmit}>
					<input
						name="email"
						type="email"
						value={email}
						placeholder="Email"
						onChange={handleEmailChange}
						required
					/>
					<input
						name="password"
						type="password"
						value={password}
						placeholder="Password"
						onChange={handlePasswordChange}
						required
					/>
					<button className="submit-button button" type="submit">
						Login
					</button>
				</form>
			</div>
			<p className="register-link">
				Don't have an account? <Link to="/register">Register</Link>
			</p>
			<Link to="/forgot-password">Forgot password?</Link>
		</div>
	);
};

export default Login;
