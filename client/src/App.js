import "./scss/styles.js";
import { Routes, Route, Link } from "react-router-dom";

import MainPage from "./components/MainPage";
import SignIn from "./components/SignIn.js";
import SignUp from "./components/SignUp.js";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="sign-up" element={<SignUp />} />
				<Route path="auth" element={<SignIn />} />
			</Routes>
		</div>
	);
}

export default App;
