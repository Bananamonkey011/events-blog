import "./scss/styles.js";
import AllPosts from "./components/AllPosts.js";
import MyEvents from "./components/MyEvents.js";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import MyEventItem from "./components/MyEventItem";
import MyEventsSideBar from "./components/MyEventsSideBar.js";

function App() {
	const [showMyEvents, setShowMyEvents] = useState(false);

	const handleCloseMyEvents = () => setShowMyEvents(false);
	const handleShowMyEvents = () => setShowMyEvents(true);

	return (
		<div className="App">
			<h1>Event Blog</h1>

			<Button
				variant="primary"
				className="d-lg-none"
				onClick={handleShowMyEvents}
			>
				View My Events
			</Button>

			<MyEventsSideBar
				show={showMyEvents}
				onHide={handleCloseMyEvents}
			/>

			<div className="body">
				<div className="MyEvents MyEventsSideBar">
					<MyEvents />
				</div>

				<AllPosts />
			</div>
		</div>
	);
}

export default App;
