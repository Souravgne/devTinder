const express = require("express");
const connectDb = require("./config/db");
const User = require("./models/user");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    user.save();
    res.status(201).send("user signed up succesfully");
  } catch (err) {
    res.status(401).send("Something went wrong");
  }
});

connectDb()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen("7777", () => {
      console.log("server is running on port 7777");
    });
  })
  .catch((err) => {
    console.log(err);
  });
