const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


const UserSchema = new Schema({
	username: {type: String, required: 'Username is required'},
	email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {type: String, required: 'Password is required'},
	profileImg: String,
	events: [{ type: Schema.Types.ObjectId, ref: "Events" }],
});

module.exports = mongoose.model("Users", UserSchema);
