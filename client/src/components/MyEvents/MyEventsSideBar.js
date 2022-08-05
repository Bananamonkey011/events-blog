import React from "react";
import Offcanvas from "react-bootstrap//Offcanvas";
import MyEvents from "./MyEvents";

const MyEventsSideBar = ({...props}) => {
	return (
		<Offcanvas
			className="MyEventsSideBar"
			show={props.show}
			onHide={props.onHide}
			responsive="lg"
		>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>My Events</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<MyEvents userID={props.userID} />
			</Offcanvas.Body>
		</Offcanvas>
	);
};

export default MyEventsSideBar;
