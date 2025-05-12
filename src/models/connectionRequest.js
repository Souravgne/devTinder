const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status type`,
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You can not send request to yourself");
  }
  next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
const ConnectionRequestModel = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
