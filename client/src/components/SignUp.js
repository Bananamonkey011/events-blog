import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const SignUp = () => {
	const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
	
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
		username: "",
		profileImg: "",
		events: [],
	});

	const [validEmail, setValidEmail] = useState(true);
	const [passwordMatch, setpasswordMatch] = useState(true);
	const [takenEmail, setTakenEmail] = useState(false);
	const [takenUsername, setTakenUserName] = useState(false);

	const handleChange = async (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (emailRegex.test(formData.email) && formData.password === formData.confirmPassword) {
			setpasswordMatch(true);
			console.log(formData);
			axios
				.post(
					process.env.REACT_APP_SERVER_URL + "/registerUser",
					formData,
					(err, response) => {
						if (err) {
							console.log("beep");
						} else {
							console.log(response);
						}
					}
				)
				.then(() => {
					setFormData({
						email: "",
						password: "",
						username: "",
						profileImg: "",
						events: [],
					});
					setpasswordMatch(true);
					setTakenEmail(false);
					setTakenUserName(false)
					e.target.reset();
				})
				.catch((error) => {
					console.log(error.request.status);
					// alert(error.response.data.error);
					setTakenEmail(error.response.status === 400);
					setTakenUserName(error.response.status === 401);
				});
		} else {
			setpasswordMatch(formData.password === formData.confirmPassword);
			setValidEmail(emailRegex.test(formData.email));
		}
	};

	return (
		<div className="SignUp">
			<div className="signup-form-container">
				<form className="signup-form" onSubmit={handleSubmit}>
					<div className="form-group signup-group">
						<label htmlFor="email">Email: </label>
						<input
							id="email"
							type="text"
							placeholder="Enter Email"
							onChange={handleChange}
							required
						/>
						{!validEmail && <p className="errmsg">Invalid Email</p>}
						{takenEmail && <p className="errmsg">Email taken</p>}
					</div>

					<div className="form-group signup-group">
						<label htmlFor="username">Username: </label>
						<input
							id="username"
							type="text"
							placeholder="Enter Username"
							onChange={handleChange}
							required
						/>
						{takenUsername && <p className="errmsg">Username taken</p>}
					</div>
					<div className="form-group signup-group">
						<label htmlFor="password">Password: </label>
						<input
							id="password"
							type="password"
							placeholder="Enter Password"
							onChange={handleChange}
							required
						/>
					</div>
					<div className="form-group signup-group">
						<label htmlFor="confirmPassword">
							Confirm password:{" "}
						</label>
						<input
							id="confirmPassword"
							type="password"
							placeholder="Confirm password"
							onChange={handleChange}
							required
						/>
						{!passwordMatch && <p className="errmsg">Passwords Do Not Match</p>}
					</div>

					<button type="submit" className="btn btn-sign-up">
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
