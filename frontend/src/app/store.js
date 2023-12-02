import { configureStore } from "@reduxjs/toolkit";
import CurrentContactReducer from "../components/CurrentContact";

export default configureStore({
	reducer: {
		currentContact: CurrentContactReducer,
	},
});
