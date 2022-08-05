import React from "react";
import { useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { FaPaperPlane } from "react-icons/fa";

const getDateString = (CurDateTime) => {
	const month =
		CurDateTime.getMonth() < 10
			? "0" + (CurDateTime.getMonth() + 1)
			: CurDateTime.getMonth() + 1;
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

const CreateEvent = ({ showTitle, userID }) => {
	const DefaultDateTime = new Date(Date.now() + 1000 * 3600 * 24);
	const DefaultDateTimeStr = getDateString(DefaultDateTime);
	const [fileUploading, setFileUploading] = useState(false);
	// console.log(DefaultDateTimeStr);

	const [formData, setFormData] = useState({
		title: "",
		location: "",
		datetime: DefaultDateTimeStr,
		description: "",
		picture: "",
		createdBy: userID,
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!fileUploading) {
			const dateinISO = new Date(formData.datetime).toISOString();
			formData.datetime = dateinISO;
			formData.created = new Date().toISOString();
			formData.modified = new Date().toISOString();
			console.log(formData);

			var fd = new FormData();
			if (formData.picture !== "") {
				fd.append("picture", formData.picture, formData.picture.name);
			} else {
				fd.append("picture", new Blob(), "emptyimg");
			}
			var statebody = Object.assign({}, formData, { picture: null });
			fd.append("state", JSON.stringify(statebody));

			await axios
				.post(process.env.REACT_APP_SERVER_URL + "/createEvent", fd)
				.then((error, response) => {
					if (error) {
						console.log(error);
					} else {
						console.log(response);
					}
				})
				.then(window.location.reload());

			setFormData({
				title: "",
				location: "",
				datetime: DefaultDateTimeStr,
				description: "",
				picture: "",
			});
			event.target.reset();
		}
	};

	const handleChange = async (e) => {
		if (e.target.name === "picture") {
			setFileUploading(true);
			if (e.target.files && e.target.files[0]) {
				await encodeImageFileAsURL(e.target);
			}
			setFileUploading(false);
		} else {
			setFormData({
				...formData,
				[e.target.name]: e.target.value,
			});
		}
		// console.log(formData);
	};

	const encodeImageFileAsURL = async (element) => {
		var imageFile = element.files[0];
		console.log("originalFile instanceof Blob", imageFile instanceof Blob); // true
		console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

		const options = {
			maxSizeMB: 0.2,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
		};
		try {
			const compressedFile = await imageCompression(imageFile, options);
			console.log(
				"compressedFile instanceof Blob",
				compressedFile instanceof Blob
			); // true
			console.log(
				`compressedFile size ${compressedFile.size / 1024 / 1024} MB`
			); // smaller than maxSizeMB

			// var reader = new FileReader();
			// reader.onloadend = function () {
			// console.log("RESULT", reader.result);
			setFormData({
				...formData,
				picture: compressedFile,
			});
			// };
			// reader.readAsDataURL(compressedFile);
		} catch (error) {
			console.log(error);
		}
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
				{fileUploading && (
					<p className="infomsg">
						File upload in progress
						{[...Array(3)].map((e, i) => <Spinner
							as="span"
							animation="grow"
							size="sm"
							style={{width: '.2rem', height: '.2rem', margin: '.2rem', animationDelay: i*100+"ms"}}
						/>)}
					</p>
				)}
				<Button
					type="submit"
					className="btn btn-primary"
					disabled={fileUploading}
				>
					Submit <FaPaperPlane />
				</Button>
			</Form>
		</div>
	);
};

export default CreateEvent;
