const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const { writeFileSync } = require("fs");
const ics = require("ics");

app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json({ limit: "10gb" }));
app.use(bodyParser.urlencoded({ limit: "10gb", extended: true }));

const Events = require("./models/Events");
const Users = require("./models/Users");
const { events } = require("./models/Events");

mongoose.connect(
	"mongodb+srv://user123:Password123@cluster0.mdmj9e5.mongodb.net/event-blog?retryWrites=true&w=majority"
);

app.get("/", (req, res) => {
	res.send("This is a test");
});
app.get("/getEvents", (req, res) => {
	Events.find({}, (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

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
	}).clone().then(res.sendFile(`${__dirname}/public/event.ics`));
	// const date = new Date(data.datetime.toISOString()).toLocaleString(
	// 	"si-LK",
	// 	{
	// 		year: "numeric",
	// 		month: "2-digit",
	// 		day: "2-digit",
	// 	}
	// );
	// const time = new Date(data.datetime.toISOString()).toLocaleString(
	// 	"si-LK",
	// 	{
	// 		hour: "numeric",
	// 		minute: "numeric",
	// 	}
	// );
	// // console.log((date+" " + time).split(/[-T:._ ]+/).slice(0, 5).map(str => Number(str)));
	// // console.log(data.datetime.toISOString().split(/[-T:._ ]+/).slice(0, 5).map(str => Number(str)));
	// const calEvent = {
	// 	start: (date + " " + time)
	// 		.split(/[-T:._ ]+/)
	// 		.slice(0, 5)
	// 		.map((str) => Number(str)),
	// 	duration: { hours: 3 },
	// 	title: data.title,
	// 	description: data.description,
	// 	location: data.location,
	// };

	// ics.createEvent(calEvent, (error, value) => {
	// 	if (error) {
	// 		console.log(error);
	// 		return;
	// 	}
	// 	// console.log(value);
	// 	writeFileSync(`${__dirname}/public/event.ics`, value);
	// });
	// // modified += data.modifiedCount;
});

app.post("/createEvent", async (req, res) => {
	const item = req.body;
	// const newItem = new Events(item);
	// await newItem.save();

	res.json(item);
});

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
