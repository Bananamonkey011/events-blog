import "../scss/styles.js";
import { useState, useEffect } from "react";
import axios from "axios";

import AllPosts from "./PostedEvents/AllPosts";
import MyEvents from "./MyEvents/MyEvents";
import MyEventsSideBar from "./MyEvents/MyEventsSideBar";
import CreateEventsSideBar from "./CreateEvent/CreateEventSidebar";
import CreateEvent from "./CreateEvent/CreateEvent";

function MainPage() {
	const userID = window.sessionStorage.getItem("user");
	const [user, setUser] = useState(false);
	useEffect(()=>{
		axios.get(process.env.REACT_APP_SERVER_URL + "/getUser?id=" + userID).then(response => {
			// console.log(response.data);
			setUser(response.data);
		})

	},[userID]);

	const [showMyEvents, setShowMyEvents] = useState(false);

	const handleCloseMyEvents = () => setShowMyEvents(false);
	const handleShowMyEvents = () => setShowMyEvents(true);

	const [showCreateEvent, setShowCreateEvent] = useState(false);

	const handleCloseCreateEvent = () => setShowCreateEvent(false);
	const handleShowCreateEvent = () => setShowCreateEvent(true);

	return (
		<div className="App">
			<h1 className="dashboard-header">Eventbook</h1>
			<h4 className="dashboard-header">Account: {user.username}</h4>

			<button
				className="btn btn-reverse btn-sidebar"
				onClick={handleShowMyEvents}
			>
				View My Events
			</button>
			<button className="btn btn-sidebar" onClick={handleShowCreateEvent}>
				Create Event
			</button>
			<MyEventsSideBar
				userID={userID}
				show={showMyEvents}
				onHide={handleCloseMyEvents}
			/>

			<CreateEventsSideBar
				userID={userID}
				show={showCreateEvent}
				onHide={handleCloseCreateEvent}
			/>

			<div className="body">
				<div className="MyEvents MyEventsSideBar">
					<MyEvents userID={userID} showTitle />
				</div>

				<AllPosts userID={userID} />

				<div className="CreateEvent CreateEventSideBar">
					<CreateEvent userID={userID} showTitle />
				</div>
			</div>
		</div>
	);
}

export default MainPage;
