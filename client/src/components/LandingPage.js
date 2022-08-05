import React from "react";

const LandingPage = () => {
	const handleRegister = () => {
        window.location = "/sign-up";
    };
	const handleLogin = () => {
        window.location = "/auth";
    };
	return (
		<div className="LandingPage">
			<div className="landing-heading-container">
				<h1 className="landing-heading">Eventbook</h1>
			</div>
			<div className="landing-heading-border" />
			<div className="landing-heading-container-bg">
				<div className="landing-btn-container">
					<button
						className="btn btn-reverse btn-register"
						onClick={handleRegister}
					>
						Register
					</button>
					<button className="btn btn-login" onClick={handleLogin}>
						Log-In
					</button>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
