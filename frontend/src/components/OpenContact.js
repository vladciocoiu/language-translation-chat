import { createSlice } from "@reduxjs/toolkit";

export const openContactSlice = createSlice({
	name: "openContact",
	initialState: {
		value: {
			contact: {},
			coords: {},
		},
	},
	reducers: {
		changeContact: {
			reducer(state, action) {
				state.value.contact = action.payload;
			},
		},
		changeCoords: {
			reducer(state, action) {
				state.value.coords = action.payload;
			},
		},
	},
});

export const { changeContact, changeCoords } = openContactSlice.actions;

export default openContactSlice.reducer;
