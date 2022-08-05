import React from "react";
import Offcanvas from "react-bootstrap//Offcanvas";
import CreateEvent from "./CreateEvent";

const CreateEventSidebar = ({ ...props }) => {
	return (
		<Offcanvas
			className="MyEventsSideBar"
			show={props.show}
			onHide={props.onHide}
			responsive="lg"
			placement="end"
		>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Create Event</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<CreateEvent showTitle={!props.show} userID={props.userID}/>
			</Offcanvas.Body>
		</Offcanvas>
	);
};

export default CreateEventSidebar;
