import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";

// custom hook for sending requests using access tokens and automatically replacing expired ones
export default function useAxiosPrivate() {
	const auth = useSelector((state) => state.auth.value);

	const axiosPrivate = axios.create();

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
				}

				return config;
			},
			(error) => Promise.reject(error)
		);

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept);
		};
	}, [auth, refresh]);

	return axiosPrivate;
}
