import axios from "axios";

export const RegisterRequest = async (email, displayName, password) => {
	try {
		const response = await axios.post("http://localhost:3000/api/auth/register", {
			email,
			name: displayName,
			password,
		});

		if (response.status !== 200) {
			const message =
				typeof response.data?.error === "string"
					? response.data.error
					: "Failed to register user";
			throw new Error(message);
		}

		return response.data;
	} catch (error) {
		const message =
			typeof error.response?.data?.error === "string"
				? error.response.data.error
				: "Failed to register user";
		throw new Error(message);
	}
};
