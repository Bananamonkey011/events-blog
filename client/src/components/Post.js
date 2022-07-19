import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { BsClipboardCheck } from "react-icons/bs";
import { useState } from "react";

// Img Src
// Location
// Date
// Title
// Description

const Post = () => {
    const [showDescription, setShowDescription] = useState(false);
    const MouseOver = () => {
        setShowDescription(true);

    }
    const MouseOut = () => {
        setShowDescription(false);
    }

	return (
		<Card className="post-container" onMouseOver={MouseOver} onMouseOut={MouseOut}>
			<Card.Img
				variant="top"
				src="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/irving-redesign/Events_Page_Header_2903ed9c-40c1-4f6c-9a69-70bb8415295b.jpg"
			/>

			<ListGroup horizontal className="post-details">
				<ListGroup.Item className="post-location">
					1 Allen Ct. Plainsboro, NJ 08536
				</ListGroup.Item>
				<ListGroup.Item className="post-date">
					April 16th 2023 8:00PM
				</ListGroup.Item>
			</ListGroup>

			<Card.Body>
				<Card.Title className="post-title">
					Manan's 20th Birthday Party
				</Card.Title>
				<Collapse in={showDescription} >
					<Card.Text className="post-description">
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Quibusdam voluptate adipisci maiores magni officia amet
						labore odit commodi nostrum nihil ut ducimus dolore
						quisquam, molestiae in, quos ipsam reprehenderit
						pariatur!
					</Card.Text>
				</Collapse>
			</Card.Body>

			<Button size="lg">
				RSVP <BsClipboardCheck />
			</Button>
		</Card>
	);
};

export default Post;
