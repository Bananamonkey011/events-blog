import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const AllPosts = ({ userID }) => {
	const [posts, setPosts] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [pg, setPg] = useState(1);
	let notloaded = true;
	let pgs = 999999999;

	useEffect(() => {
		refreshFunction();
	}, []);

	const refreshFunction = () => {
		if (notloaded) {
			console.log("refreshing...");
			axios
				.get(process.env.REACT_APP_SERVER_URL + "/getEvents/0/5")
				.then((response) => {
					setPosts(response.data.events);
					notloaded = false;
				});
		}
	};
	const fetchNext = () => {
		console.log("Fetching next...");
		// setNum([...nums, ...nums.splice(-5).map(n=>n+5)]);
		axios
			.get(
				process.env.REACT_APP_SERVER_URL + "/getEvents/" + pg + "/" + 5
			)
			.then((response) => {
				setPosts([...posts, ...response.data.events]);
				console.log(posts.length);
				pgs = response.data.pages;
				console.log(pg + "/" + pgs);
				setHasMore(pg < pgs);
			});
		setPg(pg + 1);
	};

	return (
		<div id="AllPostsScroller" className="Posts">
			<InfiniteScroll
				dataLength={posts.length + 1}
				next={fetchNext}
				scrollThreshold={"5px"}
				hasMore={hasMore}
				children={posts}
				scrollableTarget="AllPostsScroller"
				loader={
					<p className="infomsg">
						Loading
						{[...Array(3)].map((e, i) => (
							<Spinner
								key={i}
								as="span"
								animation="grow"
								size="sm"
								style={{
									width: ".2rem",
									height: ".2rem",
									margin: ".2rem",
									animationDelay: i * 100 + "ms",
								}}
							/>
						))}
					</p>
				}
				endMessage={<p className="infomsg">No more Events!</p>}
				pullDownToRefresh
				refreshFunction={refreshFunction}
			>
				{posts.map((post) => {
					return <Post key={post._id} post={post} userID={userID} />;
				}, [])}
			</InfiniteScroll>

			{/* {nums.map((val, i)=>{
					return <h1 key={i} style={{marginBottom:'20vh'}}>this is post number {val}</h1>;
				})} */}
		</div>
	);
};

export default AllPosts;
