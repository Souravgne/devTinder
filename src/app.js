const express = require("express");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
