import { createSlice } from "@reduxjs/toolkit";

export const currentContactSlice = createSlice({
	name: "currentContact",
	initialState: {
		value: {},
	},
	reducers: {
		change: {
			reducer(state, action) {
				state.value = action.payload;
			},
		},
	},
});

export const { change } = currentContactSlice.actions;

export default currentContactSlice.reducer;
