import "./scss/styles.js";
import { useState, useEffect } from "react";
import Axios from "axios";
import Button from "react-bootstrap/Button";

import AllPosts from "./components/PostedEvents/AllPosts";
import MyEvents from "./components/MyEvents/MyEvents";
import MyEventsSideBar from "./components/MyEvents/MyEventsSideBar";
import CreateEventsSideBar from "./components/CreateEvent/CreateEventSidebar";
import CreateEvent from "./components/CreateEvent/CreateEvent";

function App() {
	const [showMyEvents, setShowMyEvents] = useState(false);

	const handleCloseMyEvents = () => setShowMyEvents(false);
	const handleShowMyEvents = () => setShowMyEvents(true);

  const [showCreateEvent, setShowCreateEvent] = useState(false);

	const handleCloseCreateEvent = () => setShowCreateEvent(false);
	const handleShowCreateEvent = () => setShowCreateEvent(true);

	return (
		<div className="App">
			<h1>Event Blog</h1>

			<Button
				variant="primary"
				className="d-lg-none"
				onClick={handleShowMyEvents}
        size="sm"

        
			>
				View My Events
			</Button>

			<MyEventsSideBar show={showMyEvents} onHide={handleCloseMyEvents} />

			<Button
				variant="primary"
				className="d-lg-none"
				onClick={handleShowCreateEvent}
        size="sm"
			>
				Create Event
			</Button>
			<CreateEventsSideBar show={showCreateEvent} onHide={handleCloseCreateEvent} />

      

			<div className="body">
				<div className="MyEvents MyEventsSideBar">
					<MyEvents showTitle/>
				</div>

				<AllPosts />

				<div className="CreateEvent CreateEventSideBar">
        			<CreateEvent showTitle/>
				</div>
			</div>
		</div>
	);
}

export default App;
