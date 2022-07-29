import React from "react";
import MyEventItem from "./MyEventItem";
import { useState, useEffect } from "react";
import axios from "axios";

const MyEvents = ({ showTitle }) => {
	const [MyEvents, setMyEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	// let userid;

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/getMyEvents?id=" + "62e2b8403fd0fc21fd2d2108")
			.then((response) => {
				// userid = response.data._id;
				setMyEvents(response.data.events);
				setLoading(false);
			});
	}, []);
	return (
		<div className="my-events">
			{showTitle && <h1 className="my-events-title">My Events</h1>}
			{/* {console.log(MyEvents)} */}
			{MyEvents.map((event) => {
				return <MyEventItem key={event._id} event={event}/>;
			})}
		</div>
	);
};

export default MyEvents;
