const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { writeFileSync } = require("fs");
const ics = require("ics");
const bcrypt = require("bcrypt");

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json({ limit: "10gb" }));
app.use(bodyParser.urlencoded({ limit: "10gb", extended: true }));

const Events = require("./models/Events");
const Users = require("./models/Users");
const { events } = require("./models/Events");
const { resolve } = require("dns/promises");

mongoose.connect(
	"mongodb+srv://user123:Password123@cluster0.mdmj9e5.mongodb.net/event-blog?retryWrites=true&w=majority"
);

/**
 * @brief test event
 */
app.get("/", (req, res) => {
	res.send("This is a test");
});

/**
 * @brief gets all events from database
 */
app.get("/getEvents", (req, res) => {
	Events.find({}, (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

/**
 * @brief gets all events for a specific user
 * @query ObjectId associated with user
 */
app.get("/getMyEvents?:id", (req, res) => {
	// console.log(req.query.id);
	Users.findById(req.query.id)
		.populate("events")
		.select("events")
		.exec((err, result) => {
			res.set("Access-Control-Allow-Origin", "*");
			if (err) {
				res.json(err);
			} else {
				res.json(result);
			}
		});
});

/**
 * doesn't work
 */
app.get("/sign-in?:email?:password", (req, res) => {
	console.log(req.query.email, req.query.password);
	// User.findOne({email: req.query.email, password: req.query.password}).populate("events")
	// .exec((err, result) => {
	//     res.set("Access-Control-Allow-Origin", "*");
	//     if (err) {
	//         res.json(err);
	//     } else {
	//         res.json(result);
	//     }
	// });
});

/**
 * @brief returns the .ics file for a given event
 * @query the ObjectId of the event
 */
app.get("/download-ics-event?:eid", (req, res) => {
	console.log(req.query.eid);
	Events.findById(req.query.eid, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			const date = new Date(data.datetime.toISOString()).toLocaleString(
				"si-LK",
				{
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}
			);
			const time = new Date(data.datetime.toISOString()).toLocaleString(
				"si-LK",
				{
					hour: "numeric",
					minute: "numeric",
				}
			);
			// console.log((date+" " + time).split(/[-T:._ ]+/).slice(0, 5).map(str => Number(str)));
			// console.log(data.datetime.toISOString().split(/[-T:._ ]+/).slice(0, 5).map(str => Number(str)));
			const calEvent = {
				start: (date + " " + time)
					.split(/[-T:._ ]+/)
					.slice(0, 5)
					.map((str) => Number(str)),
				duration: { hours: 3 },
				title: data.title,
				description: data.description,
				location: data.location,
			};

			ics.createEvent(calEvent, (error, value) => {
				if (error) {
					console.log(error);
					return;
				}
				// console.log(value);
				writeFileSync(`${__dirname}/public/event.ics`, value);
			});
		}
	})
		.clone()
		.then(res.sendFile(`${__dirname}/public/event.ics`));
});

/**
 * @brief Create a new event
 * @body event details
 */
app.post("/createEvent", async (req, res) => {
	const item = req.body;
	const newItem = new Events(item);
	await newItem.save();

	res.json(item);
});

/**
 * @brief Register a new User
 * @body New User Details: email, username, password
 */
app.post("/registerUser", async (req, res) => {
	const user = req.body;
	const orgPw = req.body.password

	const takenEmail = await Users.findOne({ email: user.email.toLowerCase() });
	const takenUsername = await Users.findOne({ username: user.username });

	if (takenEmail) {
		res.status(400).json({ error: "Email already taken" });
	} else if (takenUsername) {
		res.status(401).json({ error: "Username already taken" });
	} else {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		console.log(user.password);
		// console.log(bcrypt.compareSync(orgPw, user.password));
		// console.log(bcrypt.compareSync("pass", "$2b$10$2GjXXg0uYM.KpJ7ReGYNceJIdaxBjZLLKvL1xlXizahYBAEiQRUKi"));
		// console.log(bcrypt.compareSync("Pass", "$2b$10$2GjXXg0uYM.KpJ7ReGYNceJIdaxBjZLLKvL1xlXizahYBAEiQRUKi"));
		// console.log(bcrypt.compareSync("Passw", "$2b$10$2GjXXg0uYM.KpJ7ReGYNceJIdaxBjZLLKvL1xlXizahYBAEiQRUKi"));
		
		const newUser = new Users({
			email: user.email.toLowerCase(),
			username: user.username,
			password: user.password,
			profileImg: user.profileImg,
		});
		await newUser.save();
		res.json(user);
	}
});

/**
 * @brief RSVP for an event
 * @body the ObjectIds associated with the event being RSVP'd to and the user RSVP'ing
 */
app.put("/RSVP", (req, res) => {
	let modified = 0;
	// console.log(Users.exists({_id: req.body.user_id, events: req.body.event_id}));
	Users.updateOne(
		{ _id: req.body.user_id },
		{ $addToSet: { events: req.body.event_id } },
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
				modified += result.modifiedCount;
			}
		}
	)
		.clone()
		.then((data) => {
			console.log(data);
			modified += data.modifiedCount;
		})
		.then(() => {
			return Events.findOneAndUpdate(
				{ _id: req.body.event_id },
				{ $addToSet: { attendees: req.body.user_id } },
				(err, result) => {
					if (err) {
						console.log(err);
					}
				}
			).clone();
		})
		.then(() => {
			console.log(modified);
			res.json({ modifiedCount: modified });
		})
		.catch(function (err) {
			console.log(err);
		});
});

/**
 * @brief cancel RSVP for an event
 * @body the ObjectIds associated with the event being un-RSVP'd from and the user un-RSVP'ing
 */
app.put("/unRSVP", (req, res) => {
	console.log("unrsvp");
	// console.log(req.body.event_id);
	// console.log(req.body.user_id);
	Users.updateOne(
		{ _id: req.body.user_id },
		{ $pull: { events: req.body.event_id } },
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
			}
		}
	)
		.clone()

		.then(() => {
			Events.updateOne(
				{ _id: req.body.event_id },
				{ $pull: { attendees: req.body.user_id } },
				(err, result) => {
					if (err) {
						console.log(err);
					} else {
						console.log(result);
					}
				}
			);
		})
		.then((data) => {
			console.log(data);
			res.send(data);
		})
		.catch(function (err) {
			console.log(err);
		});
});

app.listen(process.env.PORT || 3001, () => {
	console.log("Server running at http://localhost:3001");
});
