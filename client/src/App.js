import "./scss/styles.js";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Redirect } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn.js";
import SignUp from "./components/SignUp.js";

function App() {
	const [user, setUser] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (user !== "") {
			navigate("/dashboard/" + user);
		}
		// return <Redirect to={"/dashboard/"+user} />;
	}, [user]);

	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="auth" element={<SignIn setUser={setUser} />} />
				<Route path="sign-up" element={<SignUp />} />
				<Route path="dashboard/:userID" element={<Dashboard />} />
			</Routes>
		</div>
	);
}

export default App;
