const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, emailId, password, age, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    emailId: emailId,
    password: hashedPassword,
    age: age,
    gender: gender,
  });
  try {
    user.save();
    res.status(201).send("user signed up succesfully");
  } catch (err) {
    res.status(401).send("Something went wrong");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email or Password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ _id: user._id }, "Sourav@123");
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.send("Login Successful");
  } catch (err) {
    res.status(500).send("Error: " + err.message); // Optional: return 500 status code
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) {
      res.clearCookie("token");
      res.send("Logged out successfully");
    } else {
      res.send("User is Already logged out");
    }
  } catch (err) {
    res.send("Error :" + err);
  }
});
module.exports = authRouter;
