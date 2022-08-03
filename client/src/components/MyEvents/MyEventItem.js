import React from "react";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Collapse from "react-bootstrap/Collapse";
import Fade from "react-bootstrap/Fade";
import Button from "react-bootstrap/Button";
import {BsClipboardX} from "react-icons/bs";
import axios from "axios";

const getFormatedDateTime = (ISO) => {
	const date = new Date(ISO).toLocaleString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
	const day = new Date(ISO).toLocaleString("en-US", {
		weekday: "short",
	});
	const time = new Date(ISO).toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	return (<>{date} <br/> {day+", "+time}</>);
}

const MyEventItem = ({uid, event, updateEvents}) => {
	const [showDescription, setShowDescription] = useState(false);
	const MouseOver = () => {
		setShowDescription(true);
	};
	const MouseOut = () => {
		setShowDescription(false);
	};

	const handleUnRSVP = async () => {
		await axios.put(process.env.REACT_APP_SERVER_URL+"/unRSVP", {user_id: uid, event_id: event._id}).then(()=>{window.location.reload()});
		
	}
	
	return (
		<div
			className="my-event-item"
			onMouseOver={MouseOver}
			onMouseOut={MouseOut}
		>
			<Card
				className="my-event-item-thumbnail"
				onMouseOver={MouseOver}
				onMouseOut={MouseOut}
			>
				<Card.Img
					className="my-event-item-img"
					src={event.picture}
				/>

				<Card.ImgOverlay className="my-event-item-thumbnail-container">
					<Card.Header className="my-event-item-title">
						{event.title}
					</Card.Header>
					<div className="my-event-item-details">
						<div className="my-event-item-location">{event.location}</div>
						<div className="my-event-item-date">{getFormatedDateTime(event.datetime)}</div>
					</div>
				</Card.ImgOverlay>
			</Card>

			{/* <Fade> */}
				<Collapse
					in={showDescription}
					className="my-event-item-description"
					timeout={500}
				>
					<Card>
						<Card.Body>
							<Card.Text>
								{event.description}
							</Card.Text>
						</Card.Body>
					<Button onClick={handleUnRSVP}>Un RSVP <BsClipboardX/></Button>
					</Card>
				</Collapse>
			{/* </Fade> */}
		</div>
	);
};

export default MyEventItem;
