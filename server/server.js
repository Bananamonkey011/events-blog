const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");
const { writeFileSync } = require("fs");
const ics = require("ics");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json({ limit: "10gb" }));
app.use(bodyParser.urlencoded({ limit: "10gb", extended: true }));

const Events = require("./models/Events");
const Users = require("./models/Users");

mongoose.connect(
	"mongodb+srv://user123:Password123@cluster0.mdmj9e5.mongodb.net/event-blog?retryWrites=true&w=majority"
);

/**
 * Setting up MULTER
 */
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var dirName = path.join(process.cwd(), "./uploads/");
		if (!fs.existsSync(dirName)) {
			fs.mkdirSync(dirName);
		}
		cb(null, dirName);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});
var upload = multer({ storage: storage });

const unlinkAsync = promisify(fs.unlink);

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
 * @brief returns the .ics file for a given event
 * @query the ObjectId of the event
 */
app.get("/download-ics-event?:eid", (req, res) => {
	console.log("downlaod ics");
	res.download(`${__dirname}/uploads/` + req.query.eid + ".ics", "event.ics");
});

/**
 * @brief signs in user and returns their profile
 * @body username/email and password combination
 */
app.post("/sign-in", async (req, res) => {
	const account = await Users.findOne({
		$or: [{ email: req.body.email }, { username: req.body.email }],
	}).lean();
	if (!account) {
		res.status(404).send({ message: "Account Not Found" });
	} else if (!bcrypt.compareSync(req.body.password, account.password)) {
		res.status(400).send({ message: "Invalid Username Or Password" });
	} else {
		res.status(200).send(account);
	}
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
 * @brief Create a new event
 * @body event details
 */
app.post("/createEvent", upload.single("picture"), (req, res) => {
	console.log("createEvent");

	const item = JSON.parse(req.body.state);

	item.picture = {
		data: fs.readFileSync(
			path.join(__dirname + "/uploads/" + req.file.filename)
		),
		contentType: "image/png",
	};

	const date = new Date(new Date(item.datetime).toISOString()).toLocaleString(
		"si-LK",
		{
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}
	);
	const time = new Date(new Date(item.datetime).toISOString()).toLocaleString(
		"si-LK",
		{
			hour: "numeric",
			minute: "numeric",
		}
	);
	const calEvent = {
		start: (date + " " + time)
			.split(/[-T:._ ]+/)
			.slice(0, 5)
			.map((str) => Number(str)),
		duration: { hours: 3 },
		title: item.title,
		description: item.description,
		location: item.location,
	};

	const newItem = new Events(item);
	newItem.save().then((result, err) => {
		if (err) {
			res.json(err);
		} else {
			ics.createEvent(calEvent, (error, value) => {
				if (error) {
					console.log(error);
					return;
				}
				writeFileSync(
					`${__dirname}/uploads/` + result._id + ".ics",
					value
				);
			});
			res.json(result);
		}
	});
	unlinkAsync(req.file.path);

	// res.json(item);
});

/**
 * @brief Register a new User
 * @body New User Details: email, username, password
 */
app.post("/registerUser", async (req, res) => {
	console.log("registerUser");
	const user = req.body;
	const orgPw = req.body.password;

	const takenEmail = await Users.findOne({ email: user.email.toLowerCase() });
	const takenUsername = await Users.findOne({ username: user.username });

	if (takenEmail) {
		res.status(400).json({ error: "Email already taken" });
	} else if (takenUsername) {
		res.status(401).json({ error: "Username already taken" });
	} else {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		// console.log(user.password)
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
	console.log("rsvp");
	let modified = 0;
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

/**
 * @brief deletes event from db and removes it from creating user's rsvp list
 *
 */
app.delete("/deleteEvent", (req, res) => {
	console.log("deleteEvent");
	Users.updateMany(
		{ events: req.body._id },
		{ $pull: { events: req.body._id } },
		(err, result) => {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
			}
		}
	).clone();

	Events.deleteOne({ _id: req.body._id }, (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	}).clone();

	try {
		unlinkAsync(`${__dirname}/uploads/` + req.body._id + ".ics");
	} catch (err) {
		console.log(err);
	}
});

app.listen(process.env.PORT || 3001, () => {
	console.log("Server running at http://localhost:3001");
});
