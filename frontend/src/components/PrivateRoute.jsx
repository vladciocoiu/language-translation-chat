import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useRefreshToken from "../hooks/useRefreshToken";

const PrivateRoute = ({ children }) => {
	const auth = useSelector((state) => state.auth.value);
	const refresh = useRefreshToken();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const refreshAccessToken = async () => {
			if (!auth.isLoggedIn) {
				try {
					await refresh();
				} catch (err) {
					console.log(err);
				}
			}
			setLoading(false);
		};

		refreshAccessToken();
	}, []);

	if (loading) return <></>;

	return auth.isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
