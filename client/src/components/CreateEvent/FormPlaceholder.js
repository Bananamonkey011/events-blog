import React from "react";
import Placeholder from "react-bootstrap/Placeholder";

const FormPlaceholder = ({show}) => {
	return (
		<>
			{show && <Placeholder animation="glow">
				{[...Array(3)].map((e, i) => (
					<div style={{ margin: "10px" }}>
						<Placeholder
							xs={4}
							style={{
								borderRadius: "0.25vw 2.5vw / 0.25vw 2.5vw",
                                backgroundColor: '#FFFFFF70'
							}}
						/>
						<Placeholder
							style={{
								height: "2rem",
								borderRadius: "0.25vw 2.5vw / 0.25vw 2.5vw",
								width: "90%",
								margin: "5px",
                                backgroundColor: '#FFFFFF70'
							}}
						/>
					</div>
				))}
				<div style={{ margin: "10px" }}>
					<Placeholder
						xs={4}
						style={{
							borderRadius: "0.25vw 2.5vw / 0.25vw 2.5vw",
                            backgroundColor: '#FFFFFF70'
						}}
					/>
					<Placeholder
						style={{
							height: "8rem",
							borderRadius: "0.25vw 2.5vw / 0.25vw 2.5vw",
							width: "90%",
							margin: "5px",
                            backgroundColor: '#FFFFFF70'
						}}
					/>
				</div>
				<div style={{ margin: "10px" }}>
					<Placeholder
						xs={4}
						style={{
							borderRadius: "0.25vw 2.5vw / 0.25vw 2.5vw",
                            backgroundColor: '#FFFFFF70'
						}}
					/>
					<Placeholder
						style={{
							height: "2rem",
							borderRadius: "0.25vw 2.5vw / 0.25vw 2.5vw",
							width: "90%",
							margin: "5px",
                            backgroundColor: '#FFFFFF70'
						}}
					/>
				</div>

				<Placeholder.Button variant="primary" xs={6} />
			</Placeholder>}
		</>
	);
};

export default FormPlaceholder;
