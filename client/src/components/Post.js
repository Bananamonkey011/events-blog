import React from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { BsClipboardCheck } from "react-icons/bs";
import { useState } from "react";
import axios from "axios";

// Img Src
// Location
// Date
// Title
// Description
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

const Post = ({ post }) => {
	const [showDescription, setShowDescription] = useState(false);
	const MouseOver = () => {
		setShowDescription(true);
	};
	const MouseOut = () => {
		setShowDescription(false);
	};

	const handleRSVP = () => {
		axios.put(process.env.REACT_APP_SERVER_URL + "/addAttendee", {
			user_id: "62e2b8403fd0fc21fd2d2108",
			event_id: post._id,
		}).then(response => {
			console.log(response);
		});

		axios.put(process.env.REACT_APP_SERVER_URL + "/addMyEvent", {
			user_id: "62e2b8403fd0fc21fd2d2108",
			event_id: post._id,
		}).then(response => {
			console.log(response);
		});
		console.log(post._id)
	}

	return (
		<Card
			className="post-container"
			onMouseOver={MouseOver}
			onMouseOut={MouseOut}
			imgsrc={post.picture}
		>
			<Card.Img className="post-img" variant="top" src={post.picture} />

			<ListGroup horizontal className="post-details">
				<li className="post-location">{post.location}</li>
				<li className="post-date">
					{getFormatedDateTime(post.datetime)}
				</li>
			</ListGroup>

			<Card.Body className="post-body">
				<Card.Title className="post-title">{post.title}</Card.Title>
				<Collapse in={showDescription}>
					<Card.Text className="post-description">
						{post.description}
					</Card.Text>
				</Collapse>
			</Card.Body>
			<div className="post-timestamp">
				<p>{new Date(post.modified).toLocaleString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	})}</p>
				{post.modified !== post.created && <p>(updated)</p>}
			</div>

			<Button size="lg" onClick={handleRSVP}>
				RSVP <BsClipboardCheck />
			</Button>
		</Card>
	);
};

export default Post;
