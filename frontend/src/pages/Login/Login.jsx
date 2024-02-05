import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { changeUser, setLoggedIn } from "../../components/Auth";
import "./Login.css";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const auth = useSelector((state) => state.auth.value);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleEmailChange = (e) => {
		if (error) setError("");
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		if (error) setError("");
		setPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// there should be a login request here but there is no backend yet so it will be mocked

		const mockUser = {
			email: "test@email",
			password: "testpassword",
		};

		if (email === mockUser.email && password === mockUser.password) {
			dispatch(changeUser(email));
			dispatch(setLoggedIn(true));
			navigate("/messages");
		} else {
			setError("Invalid credentials");
		}
	};

	if (auth.isLoggedIn) navigate("/messages");

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
		</div>
	);
};

export default Login;
