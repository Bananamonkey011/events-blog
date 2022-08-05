import React from "react";
import MyEventItem from "./MyEventItem";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';


const MyEvents = ({ showTitle, userID }) => {
	const [MyEvents, setMyEvents] = useState([]);
	// const userID = "62e2b8403fd0fc21fd2d2108"
	const [loading, setLoading] = useState(true);
	// let userid;

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/getMyEvents?id=" + userID)
			.then((response) => {
				// userid = response.data._id;
				setMyEvents(response.data.events);
				setLoading(false);
			});
	});
	return (
		<div className="my-events">
			{showTitle && <h1 className="my-events-title">My Events</h1>}
			{loading && <Spinner animation="border" />}
			{/* {console.log(MyEvents)} */}
			{MyEvents?.map((event) => {
				return <MyEventItem key={event._id} uid={userID} event={event} updateEvents={setMyEvents}/>;
			})}
		</div>
	);
};

export default MyEvents;
