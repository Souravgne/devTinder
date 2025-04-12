const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://sourav:w0rWkH1Tt7xDb4sh@cluster0.hznvr.mongodb.net/DevTinder"
  );
};

module.exports = connectDb;
