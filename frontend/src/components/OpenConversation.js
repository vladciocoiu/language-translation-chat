import { createSlice } from "@reduxjs/toolkit";

export const openConversationSlice = createSlice({
	name: "openConversation",
	initialState: {
		value: {
			Conversation: {},
			coords: {},
		},
	},
	reducers: {
		changeConversation: {
			reducer(state, action) {
				state.value.Conversation = action.payload;
			},
		},
		changeCoords: {
			reducer(state, action) {
				state.value.coords = action.payload;
			},
		},
	},
});

export const { changeConversation, changeCoords } =
	openConversationSlice.actions;

export default openConversationSlice.reducer;
