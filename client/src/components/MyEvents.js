import React from "react";
import MyEventItem from "./MyEventItem";

const MyEvents = ({showTitle}) => {

	return (
		<div className="my-events">
                {showTitle && <h1 className="my-events-title">My Events</h1>}
				<MyEventItem />
				<MyEventItem />
				<MyEventItem />
		</div>
	);
};

export default MyEvents;
