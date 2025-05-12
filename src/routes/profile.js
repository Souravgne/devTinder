const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  validateEditProfileData,
  validateResetPassword,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    console.log(res);
    res.send(req.user);
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.send("profile updated successfully");
  } catch (err) {
    res.send("Error :`" + err);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validateResetPassword(req)) {
      return res.status(400).json({ message: "Invalid Edit Request" });
    }

    const { oldPassword, newPassword } = req.body;
    console.log("oldPassword:", oldPassword);
    console.log("req.user.password:", req.user.password);
    const match = await bcrypt.compare(oldPassword, req.user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = hashedPassword;

    await req.user.save(); // Important: await this

    res.json({ message: "Password has changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

module.exports = profileRouter;
