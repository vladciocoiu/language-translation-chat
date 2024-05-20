import { createSlice } from "@reduxjs/toolkit";

export const currentConversationSlice = createSlice({
	name: "currentConversation",
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

export const { change } = currentConversationSlice.actions;

export default currentConversationSlice.reducer;
