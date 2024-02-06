import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Home.css";

const Home = () => {
	const auth = useSelector((state) => state.auth.value);

	return (
		<main className="home-main">
			<h1>PolyChat</h1>
			<p>Break barriers effortlessly with our automatic translation chat.</p>
			<p>Experience seamless communication across languages today!</p>
			<img
				className="flags-img"
				src="images/countryflags.jpg"
				alt="country flags"
			/>
			{!auth.isLoggedIn && (
				<ul>
					<li>
						<button className="login-button">
							<Link to="/login">Login</Link>
						</button>
					</li>
					<li>
						<button className="sign-up-button">
							<Link to="/register">Sign Up</Link>
						</button>
					</li>
				</ul>
			)}
		</main>
	);
};

export default Home;
