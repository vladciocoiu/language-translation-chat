import { Route, Routes } from "react-router-dom";
import Messages from "../pages/Messages/Messages";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Verify from "../pages/Verify/Verify";
import Profile from "../pages/Profile/Profile";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import PrivateRoute from "./PrivateRoute";

const publicPagesData = [
	{
		path: "",
		element: <Home />,
		title: "Home",
	},
	{
		path: "login",
		element: <Login />,
		title: "Login",
	},
	{
		path: "register",
		element: <Register />,
		title: "Register",
	},
	{
		path: "verify",
		element: <Verify />,
		title: "Verify",
	},
	{
		path: "forgot-password",
		element: <ForgotPassword />,
		title: "Forgot Password",
	},
	{
		path: "reset",
		element: <ResetPassword />,
		title: "Reset Password",
	},
];

const privatePagesData = [
	{
		path: "messages",
		element: <Messages />,
		title: "Messages",
	},
	{
		path: "profile",
		element: <Profile />,
		title: "Profile",
	},
];

const Router = () => {
	return (
		<Routes>
			{publicPagesData.map((page, index) => (
				<Route key={index} path={page.path} element={page.element} />
			))}
			{privatePagesData.map((page, index) => (
				<Route
					key={index}
					path={page.path}
					element={<PrivateRoute>{page.element}</PrivateRoute>}
				/>
			))}
		</Routes>
	);
};

export default Router;
