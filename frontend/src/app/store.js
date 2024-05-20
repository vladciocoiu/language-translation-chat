import { configureStore } from "@reduxjs/toolkit";
import CurrentConversationReducer from "../components/CurrentConversation";
import OpenConversationReducer from "../components/OpenConversation";
import Auth from "../components/Auth";

export default configureStore({
	reducer: {
		currentConversation: CurrentConversationReducer,
		openConversation: OpenConversationReducer,
		auth: Auth,
	},
});
