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
				state.value.email = action.payload;
			},
		},
		setLoggedIn: {
			reducer(state, action) {
				state.value.isLoggedIn = action.payload;
			},
		},
	},
});

export const { changeUser, setLoggedIn } = authSlice.actions;

export default authSlice.reducer;
