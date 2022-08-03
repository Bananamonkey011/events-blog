import React from "react";
import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { FaPaperPlane } from "react-icons/fa";

import { writeFile } from 'fs-web';
const ics = require("ics");

const getDateString = (CurDateTime) => {
	const month =
		CurDateTime.getMonth() < 10
			? "0" + (CurDateTime.getMonth()+1)
			: (CurDateTime.getMonth()+1);
	const date =
		CurDateTime.getDate() < 10
			? "0" + CurDateTime.getDate()
			: CurDateTime.getDate();
	const hour =
		CurDateTime.getHours() < 10
			? "0" + CurDateTime.getHours()
			: CurDateTime.getHours();
	const min =
		CurDateTime.getMinutes() < 10
			? "0" + CurDateTime.getMinutes()
			: CurDateTime.getMinutes();
	return (
		CurDateTime.getFullYear() +
		"-" +
		month +
		"-" +
		date +
		"T" +
		hour +
		":" +
		min
	);
};

const CreateEvent = ({ showTitle }) => {
	const DefaultDateTime = new Date(Date.now() + 1000 * 3600 * 24);
	const DefaultDateTimeStr = getDateString(DefaultDateTime);
	// console.log(DefaultDateTimeStr);

	const [formData, setFormData] = useState({
		title: "",
		location: "",
		datetime: DefaultDateTimeStr,
		description: "",
		picture: "",
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		const dateinISO = new Date(formData.datetime).toISOString();
		formData.datetime = dateinISO;
		formData.created = new Date().toISOString();
		formData.modified = new Date().toISOString();
		console.log(formData);
		axios
			.post(process.env.REACT_APP_SERVER_URL + "/createEvent", formData).then((error, response) => {console.log(response);});
			
		setFormData({
			title: "",
			location: "",
			datetime: DefaultDateTimeStr,
			description: "",
			picture: "",
		});
		event.target.reset();
	};
	const handleChange = (e) => {
		if (e.target.name === "picture") {
			if (e.target.files && e.target.files[0]) {
				encodeImageFileAsURL(e.target);
			}
		} else {
			setFormData({
				...formData,
				[e.target.name]: e.target.value,
			});
		}
		// console.log(formData);
	};

	const encodeImageFileAsURL = (element) => {
		var file = element.files[0];
		var reader = new FileReader();
		reader.onloadend = function () {
			// console.log("RESULT", reader.result);
			setFormData({
				...formData,
				picture: reader.result,
			});
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="create-event">
			{showTitle && <h1 className="create-event-title">Create Event</h1>}
			<Form className="create-event-form" onSubmit={handleSubmit}>
				<Form.Group className="create-event-form-group">
					<label className="create-event-form-label" htmlFor="title">
						Event Title:
					</label>
					<input
						className="create-event-form-entry"
						name="title"
						required
						onChange={handleChange}
						type="text"
						placeholder="Enter Event Title..."
						value={formData.title}
					/>
				</Form.Group>

				<Form.Group className="create-event-form-group">
					<label
						className="create-event-form-label"
						htmlFor="location"
					>
						Event Location:
					</label>
					<input
						className="create-event-form-entry"
						required
						name="location"
						onChange={handleChange}
						type="text"
						placeholder="Enter Event Location..."
						value={formData.location}
					/>
				</Form.Group>

				<Form.Group className="create-event-form-group">
					<label
						className="create-event-form-label"
						htmlFor="datetime"
					>
						Event Date:
					</label>
					<input
						className="create-event-form-entry"
						required
						name="datetime"
						onChange={handleChange}
						type="datetime-local"
						// defaultValue={DefaultDateTimeStr}
						value={formData.datetime}
					/>
				</Form.Group>

				<Form.Group className="create-event-form-group">
					<label
						className="create-event-form-label"
						htmlFor="description"
					>
						Description:
					</label>
					<textarea
						className="create-event-form-entry"
						name="description"
						onChange={handleChange}
						placeholder="Enter Description..."
						rows="4"
						value={formData.description}
					/>
				</Form.Group>

				<Form.Group className="create-event-form-group">
					<label
						className="create-event-form-label"
						htmlFor="picture"
					>
						Event Picture:
					</label>
					<input
						className="create-event-form-entry"
						name="picture"
						onChange={handleChange}
						type="file"
						accept="image/png, image/jpeg"
					/>
				</Form.Group>

				<Button type="submit" className="btn btn-primary">
					Submit <FaPaperPlane />
				</Button>
			</Form>
		</div>
	);
};

export default CreateEvent;
