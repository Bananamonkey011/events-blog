import React from "react";
// import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import axios from "axios";
// import bcrypt from 'bcryptjs';

const saltRounds = 10;
const myPlaintextPassword = "Password123";
const someOtherPlaintextPassword = "not_bacon";

const Signin = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const handleChange = (e) => {
		// console.log(formData);
		setFormData({
			email: e.target.value,
			password: e.target.value,
		});
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("submit");
		formData.email = encodeURIComponent(formData.email);
		formData.password = encodeURIComponent(formData.password);
		console.log(formData);
		// axios.get(process.env.REACT_APP_SERVER_URL + "/signin", { params: formData})
		// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
		//     // Store hash in your password DB.
		// });
	};
	return (
		<div className="SignIn">
			<h1 className="signin-title">Sign-in</h1>
			<div className="signin-form-container">
				<form className="signin-form" onSubmit={handleSubmit}>
					<div className="form-group signin-group">
						<label htmlFor="email">Email: </label>
						<input
							id="email"
							type="text"
							placeholder="Enter Email"
							onChange={handleChange}
							// value={formData.email}
						/>
					</div>

					<div className="form-group signin-group">
						<label htmlFor="password">Password: </label>
						<input
							id="password"
							type="password"
							placeholder="Enter Password"
							onChange={handleChange}
							// value={formData.password}
						/>
					</div>

					<button type="submit" className="btn btn-sign-in">
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
};

export default Signin;
