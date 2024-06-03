import axios from "axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";

// custom hook for sending requests using access tokens and automatically replacing expired ones
export default function useAxiosPrivate() {
	const refresh = useRefreshToken();
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

	useEffect(() => {
		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;

				if (error?.response?.status === 403 && !prevRequest?.sent) {
					prevRequest.sent = true;

					const newAccessToken = await refresh();

					prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

					return axiosPrivate(prevRequest);
				}

				return Promise.reject(error);
			}
		);

		return () => {
			axiosPrivate.interceptors.response.eject(responseIntercept);
		};
	}, [auth, refresh]);

	return axiosPrivate;
}
