import "./scss/styles.js";
import { useState, useEffect } from "react";
import {
	Routes,
	Route,
	useNavigate,
	Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn.js";
import SignUp from "./components/SignUp.js";

function App() {
	const [user, setUser] = useState("");
	const navigate = useNavigate();
	useEffect(() => {
		setUser(window.sessionStorage.getItem("user"));
	}, []);

	useEffect(() => {
		const path = window.location.pathname;
		if (path !== "/" && path !== "/auth" && path !== "/sign-up") {
			if (
				window.sessionStorage.getItem("user") === null ||
				window.sessionStorage.getItem("user") === ""
			) {
				navigate("/");
			} else {
				navigate("/dashboard");
			}
		}
		// return <Redirect to={"/dashboard/"+user} />;
	}, [user]);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="auth" element={<SignIn setUser={setUser} />} />
				<Route path="sign-up" element={<SignUp />} />
				<Route
					path="dashboard/"
					element={
						window.sessionStorage.getItem("user") !== "" &&
						window.sessionStorage.getItem("user") !== null ? (
							<Dashboard />
						) : (
							<Navigate replace to="/" />
						)
					}
				/>
			</Routes>
		</div>
	);
}

export default App;
