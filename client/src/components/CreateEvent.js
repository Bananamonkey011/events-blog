import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { FaPaperPlane } from "react-icons/fa";

const getDateString = (CurDateTime) => {
	const month =
		CurDateTime.getMonth() < 10
			? "0" + CurDateTime.getMonth()
			: CurDateTime.getMonth();
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

const CreateEvent = ({showTitle}) => {
	const DefaultDateTime = new Date(Date.now() + 1000 * 3600 * 24);
	const DefaultDateTimeStr = getDateString(DefaultDateTime);
	// console.log(DefaultDateTimeStr);

	const [formData, setFormData] = useState({
		title: "",
		location: "",
		date: DefaultDateTimeStr,
		description: "",
		picture: 1,
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(formData);
	};
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div className="create-event">
            {showTitle && <h1 className="create-event-title">Create Event</h1>}
			<Form className="create-event-form">
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
					/>
				</Form.Group>
				<Form.Group className="create-event-form-group">
					<label className="create-event-form-label" htmlFor="location">
						Event Location:
					</label>
					<input
						className="create-event-form-entry"
						required
						name="location"
						onChange={handleChange}
						type="text"
						placeholder="Enter Event Location..."
					/>
				</Form.Group>

				<Form.Group className="create-event-form-group">
					<label className="create-event-form-label" htmlFor="date">
						Event Date:
					</label>
					<input
						className="create-event-form-entry"
						required
						name="date"
						onChange={handleChange}
						type="datetime-local"
						defaultValue={DefaultDateTimeStr}
					/>
				</Form.Group>

				<Form.Group className="create-event-form-group">
					<label className="create-event-form-label" htmlFor="description">
						Description:
					</label>
					<textarea
						className="create-event-form-entry"
						name="description"
						onChange={handleChange}
						placeholder="Enter Description..."
						rows="4"
					/>
				</Form.Group>

				<Form.Group className="create-event-form-group">
					<label className="create-event-form-label" htmlFor="picture">
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

				<Button
					type="button"
					className="btn btn-primary"
					onClick={handleSubmit}
				>
					Submit <FaPaperPlane/>
				</Button>
			</Form>
		</div>
	);
};

export default CreateEvent;
