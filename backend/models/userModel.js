import mongoose from "mongoose";

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			minLength: 6,
		},
		googleId: {
			type: String,
			default: "",
		},
		githubId: {
			type: String,
			default: "",
		},
		profilePic: {
			type: String,
			default: "",
		},
		followers: {
			type: [String],
			default: [],
		},
		following: {
			type: [String],
			default: [],
		},
		bio: {
			type: String,
			default: "",
		},
		isFrozen: {
			type: Boolean,
			default: false,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			default: "",
		},
		resetPasswordToken: {
			type: String,
			default: "",
		},
		resetPasswordExpires: {
			type: Date,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
