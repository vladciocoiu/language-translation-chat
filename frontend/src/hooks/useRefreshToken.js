import axios from "axios";
import { useDispatch } from "react-redux";
import { setAccessToken, setLoggedIn, changeUser } from "../components/Auth";

// custom hook for using a refresh token in order to get a new access token
export default function useRefreshToken() {
	const dispatch = useDispatch();

	const refresh = async () => {
		axios.defaults.withCredentials = true;

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/auth/refresh`,
				{},
				{ withCredentials: true }
			);

			dispatch(setAccessToken(response.data.accessToken));
			dispatch(setLoggedIn(true));

			const userResponse = await axios.get(
				`${import.meta.env.VITE_API_URL}/users/me`,
				{
					headers: {
						Authorization: `Bearer ${response.data.accessToken}`,
					},
				}
			);
			dispatch(
				changeUser({
					userId: userResponse.data.user.id,
					email: userResponse.data.user.email,
					language: userResponse.data.user.language,
				})
			);
			return response.data.accessToken;
		} catch (err) {
			console.log(err);
		}
	};

	return refresh;
}
