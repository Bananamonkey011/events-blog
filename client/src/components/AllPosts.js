import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import Spinner from 'react-bootstrap/Spinner';

const AllPosts = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/getEvents")
			.then((response) => {
				setPosts(response.data);
				setLoading(false);
			});
	}, []);

	return (
		<div className="Posts">
			{loading && <Spinner animation="border" />}
			{posts.map((post) => {
				return <Post key={post._id} post={post} />;
			}, [])}
		</div>
	);
};

export default AllPosts;
