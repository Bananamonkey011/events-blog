import "./scss/styles.js";
import AllPosts from "./components/AllPosts.js";
import MyEvents from "./components/MyEvents.js";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import MyEventsSideBar from "./components/MyEventsSideBar.js";
import CreateEventsSideBar from "./components/CreateEventSidebar.js";
import CreateEvent from "./components/CreateEvent.js";

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
        <CreateEvent showTitle/>
			</div>
		</div>
	);
}

export default App;
