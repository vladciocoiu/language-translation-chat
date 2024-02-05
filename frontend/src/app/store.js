import { configureStore } from "@reduxjs/toolkit";
import CurrentContactReducer from "../components/CurrentContact";
import Auth from "../components/Auth";

export default configureStore({
	reducer: {
		currentContact: CurrentContactReducer,
		auth: Auth,
	},
});
