import { configureStore } from "@reduxjs/toolkit";
import CurrentContactReducer from "../components/CurrentContact";
import OpenContactReducer from "../components/OpenContact";
import Auth from "../components/Auth";

export default configureStore({
	reducer: {
		currentContact: CurrentContactReducer,
		openContact: OpenContactReducer,
		auth: Auth,
	},
});
