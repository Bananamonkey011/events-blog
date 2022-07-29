const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");

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
	Users.findById(req.query.id).populate("events").select("events").exec((err,result)=>{
        res.set("Access-Control-Allow-Origin", "*");
        if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
    });
});

app.post("/createEvent", async (req, res) => {
	const item = req.body;
	const newItem = new Events(item);
	await newItem.save();
	res.json(item);
});

app.put("/addAttendee", async (req, res) => {
	let event = await Events.findOneAndUpdate(
		{ _id: req.body.event_id, attendees: { $ne: req.body.user_id } },
		{ $push: { attendees: req.body.user_id } },
		(err, result) => {
			if (err) {
				res.json(err);
			} else {
				res.json(result);
			}
		}
	).clone().catch(function(err){ console.log(err)});
});

app.put("/addMyEvent", async (req, res) => {
		let user = await Users.findOneAndUpdate(
			{ _id: req.body.user_id, events: { $ne: req.body.event_id } },
			{ $push: { events: req.body.event_id } },
			(err, result) => {
				if (err) {
					res.json(err);
				} else {
					res.json(result);
				}
			}
		).clone().catch(function(err){ console.log(err)});
});

app.listen(3001, () => {
	console.log("Server running at http://localhost:3001");
});
