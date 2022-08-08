import React from "react";
import Card from "react-bootstrap/Card";
import Collapse from "react-bootstrap/Collapse";
import { BsClipboardCheck } from "react-icons/bs";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";
import axios from "axios";

/**
 * @brief Nicely formatted React component of Date given ISO 8601 date
 * @param {String} ISO ISO format of date
 * @returns {React.Component} Date formatted visually
 */
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
	return (
		<>
			{date} <br /> {day + ", " + time}
		</>
	);
};
const arrayBufferToBase64 = (buffer) => {
	var binary = "";
	var bytes = [].slice.call(new Uint8Array(buffer));
	bytes.forEach((b) => (binary += String.fromCharCode(b)));
	// console.log(window.btoa(binary));
	if (window.btoa(binary).length > 0) {
		return window.btoa(binary);
	} else {
		return "";
	}
};
const Post = ({ post, userID }) => {
	const [showDescription, setShowDescription] = useState(false);
	const [editing, setEditing] = useState(false);

	const MouseOver = () => {
		setShowDescription(true);
	};
	const MouseOut = () => {
		setShowDescription(false);
	};

	const handleDelete = async (event) => {
		const body = {
			_id: post._id,
			user_id: userID,
		};
		await axios
			.delete(process.env.REACT_APP_SERVER_URL + "/deleteEvent", {
				data: body,
			})
			.then(window.location.reload());
	};

	const handleEdit = async (event) => {
		// console.log(event);
		setEditing(!editing);
	};

	const handleRSVP = async () => {
		await axios
			.put(process.env.REACT_APP_SERVER_URL + "/RSVP", {
				user_id: userID,
				event_id: post._id,
			})
			.then((response) => {
				if (response.data.modifiedCount > 0) {
					// window.location.reload();
					console.log("reload");
				}
			})
			.then(() => {
				console.log("reload");
				window.location.href =
					process.env.REACT_APP_SERVER_URL +
					"/download-ics-event?eid=" +
					post._id;
			});
	};

	return (
		<Card
			className="post-container"
			onMouseOver={MouseOver}
			onMouseOut={MouseOut}
			imgsrc={post.picture}
		>
			{true && 
				<>
					<Card.Img
						className="post-img"
						variant="top"
						src={
							arrayBufferToBase64(post.picture.data.data) === ""
								? ""
								: "data:image/jpeg;base64," +
								  arrayBufferToBase64(post.picture.data.data)
						}
					/>

					<div className="post-details">
						<li className="post-location">{post.location}</li>
						<li className="post-date">
							{getFormatedDateTime(post.datetime)}
						</li>
					</div>

					<Card.Body className="post-body">
						<Card.Title className="post-title">
							{post.title}
						</Card.Title>
						<Collapse in={showDescription}>
							<Card.Text className="post-description">
								{post.description}
							</Card.Text>
						</Collapse>
					</Card.Body>
					<div className="post-timestamp">
						<p>
							{new Date(post.modified).toLocaleString("en-US", {
								day: "2-digit",
								month: "short",
								year: "numeric",
								hour: "numeric",
								minute: "numeric",
								hour12: true,
							})}
						</p>
						{post.modified !== post.created && <p>(updated)</p>}
					</div>
				</>
			}

			<div className="post-btn-container">
				<button className="btn" onClick={handleRSVP}>
					RSVP <BsClipboardCheck />
				</button>
				{/* {post.createdBy === userID && (
					<button className="btn btn-edit" onClick={handleEdit}>
						<AiOutlineEdit />
					</button>
				)} */}
				{post.createdBy === userID && (
					<button className="btn btn-delete" onClick={handleDelete}>
						<AiOutlineDelete />
					</button>
				)}
			</div>
		</Card>
	);
};

export default Post;
