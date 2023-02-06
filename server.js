const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const { application } = require("express");

mongoose.set("strictQuery", true);

const app = express();
const PORT = 9999;

mongoose.connect("mongodb://127.0.0.1:27017/login-app-db");
User.create({ username: `${Math.random()}`, password: `${Math.random()}` });

app.use("/", express.static(path.join(__dirname, "static")));
app.use(express.json());

// Signup

app.get("/api", (req, res) => {
	res.send("api is working!");
});
app.post("/api/register", async (req, res) => {
	const { username, password: plainTextPassword } = req.body;

	if (!username || typeof username !== "string") {
		return res.json({ status: "error", error: "Invalid username" });
	}

	if (!plainTextPassword || typeof plainTextPassword !== "string") {
		return res.json({ status: "error", error: "Invalid password" });
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: "error",
			error: "Password too small. Should be atleast 6 characters",
		});
	}

	const password = await bcrypt.hash(plainTextPassword, 5);

	try {
		const response = await User.create({
			username,
			password,
		});
		console.log("User created successfully!!", response);
	} catch (error) {
		if (error.code === 11000) {
			return res.json({
				status: "error",
				error: "Username already in use",
			});
		}

		throw error;
	}

	res.json({ status: "ok" });
});

app.listen(PORT, () => {
	console.log(`Server up at ${PORT}`);
});
