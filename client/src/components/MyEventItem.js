import React from "react";
import { useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Collapse from "react-bootstrap/Collapse";
import Fade from "react-bootstrap/Fade";
import Button from "react-bootstrap/Button";
import {BsClipboardX} from "react-icons/bs";

const MyEventItem = () => {
	const [showDescription, setShowDescription] = useState(false);
	const MouseOver = () => {
		setShowDescription(true);
	};
	const MouseOut = () => {
		setShowDescription(false);
	};
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
					src="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/irving-redesign/Events_Page_Header_2903ed9c-40c1-4f6c-9a69-70bb8415295b.jpg"
				/>

				<Card.ImgOverlay className="my-event-item-thumbnail-container">
					<Card.Header className="my-event-item-title">
						This is the Event Title{" "}
					</Card.Header>
					<div className="my-event-item-details">
						<div className="my-event-item-location">online</div>
						<div className="my-event-item-date">8:00 PM</div>
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
								Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Quibusdam voluptate adipisci
								maiores magni officia amet labore odit commodi
								nostrum nihil ut ducimus dolore quisquam,
								molestiae in, quos ipsam reprehenderit pariatur!
							</Card.Text>
						</Card.Body>
					<Button>Un RSVP <BsClipboardX/></Button>
					</Card>
				</Collapse>
			{/* </Fade> */}
		</div>
	);
};

export default MyEventItem;
