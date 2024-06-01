import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Verify.css";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Verify = () => {
	const query = useQuery();
	const token = query.get("token");
	const [status, setStatus] = useState("loading");

	const verifyEmail = async () => {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/auth/verify?token=${token}`
			);
			if (response.status !== 200) setStatus("failure");
			else setStatus("success");
		} catch (error) {
			console.log(error);
			setStatus("failure");
		}
	};

	useEffect(() => {
		verifyEmail();
	}, []);

	return (
		<div className="verify-page">
			<h1>Email Verification</h1>
			{status === "loading" && <p>Verifying...</p>}
			{status === "success" && <p>Email verified!</p>}
			{status === "success" && <Link to="/login">Login</Link>}
			{status === "failure" && <p>Failed to verify email</p>}
		</div>
	);
};

export default Verify;
