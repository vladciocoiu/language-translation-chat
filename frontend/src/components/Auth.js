import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		value: {
			isLoggedIn: false,
		},
	},
	reducers: {
		changeUser: {
			reducer(state, action) {
				state.value.email = action.payload.email;
				state.value.userId = action.payload.userId;
				state.value.language = action.payload.language;
			},
		},
		setAccessToken: {
			reducer(state, action) {
				state.value.accessToken = action.payload;
			},
		},
		setLoggedIn: {
			reducer(state, action) {
				state.value.isLoggedIn = action.payload;
			},
		},
	},
});

export const { changeUser, setLoggedIn, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
