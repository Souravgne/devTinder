const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth"); // ✅ Auth middleware
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const SAFE_DATA = ["firstName", "lastName", "age", "gender"];
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);

    res.json({
      message: "Request fetched successfully!",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send({
      message: "Bad Request",
      error,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);

    if (connectionRequest.length == 0) {
      return res.status(404).json({
        message: "No connection found!",
      });
    }
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });
    res.json({
      message: `${connectionRequest.length} connections found!`,
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: "Bad Request",
      error,
    });
  }
});

userRouter.get("/feed", userAuth, async function (req, res) {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({
      message: "feed fetched successfully",
      users,
    });
  } catch (error) {
    res.status(400).send({
      message: "Bad Request",
      error,
    });
  }
});
module.exports = userRouter;
