import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/userModel.js";

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

const findOrCreateOAuthUser = async (profile, provider) => {
	const providerIdField = provider === "google" ? "googleId" : "githubId";
	const email = profile.emails?.[0]?.value;

	let user = await User.findOne({ [providerIdField]: profile.id });
	if (user) return user;

	if (email) {
		user = await User.findOne({ email });
		if (user) {
			user[providerIdField] = profile.id;
			await user.save();
			return user;
		}
	}

	const suffix = "_" + provider[0] + Date.now().toString(36);
	const baseUsername = (profile.username || email?.split("@")[0] || profile.displayName?.replace(/\s/g, "") || "user");
	const username = baseUsername.toLowerCase() + suffix;

	user = await User.create({
		name: profile.displayName || username,
		username,
		email: email || `${username}@oauth.placeholder`,
		[providerIdField]: profile.id,
		profilePic: profile.photos?.[0]?.value || "",
	});

	return user;
};

// Always register Google strategy - will fail at runtime if credentials are invalid
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
			callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/users/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await findOrCreateOAuthUser(profile, "google");
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		}
	)
);
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
	console.log("✅ Google OAuth strategy registered");
} else {
	console.log("⚠️  Google OAuth not configured - set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env");
}

// Always register GitHub strategy - will fail at runtime if credentials are invalid
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID || "dummy_client_id",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy_client_secret",
			callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/users/auth/github/callback",
			scope: ["user:email"],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const user = await findOrCreateOAuthUser(profile, "github");
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		}
	)
);
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
	console.log("✅ GitHub OAuth strategy registered");
} else {
	console.log("⚠️  GitHub OAuth not configured - set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env");
}

export default passport;
