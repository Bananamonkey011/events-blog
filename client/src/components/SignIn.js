import React from "react";
import { useState } from "react";
import axios from "axios";
import {BiArrowBack} from "react-icons/bi"

const Signin = ({ setUser }) => {
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
		axios
			.post(process.env.REACT_APP_SERVER_URL + "/sign-in", formData)
			.then((response) => {
				console.log(response.data);
				setUser(response.data._id);
			})
			.catch((error) => {
				console.log(error.response.status);
			});
	};

	const returnToDashboard = () => {
		// console.log("back");
		window.location = "/";
	};

	return (
		<div className="SignIn">
			<button className="return-to-dashboard" onClick={returnToDashboard}>
				<BiArrowBack/>
			</button>
			<h1 className="signin-title">Sign-in</h1>

			<div className="signin-form-container-bg">
				<div className="signin-form-container-border">
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
		</div>
	);
};

export default Signin;
