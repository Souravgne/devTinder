const jwt = require("jsonwebtoken");
const user = require("../models/user");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  // read the cookies from req
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res
        .status(401)
        .json({ msg: "Please login to access this resource" });
    }

    const verify = await jwt.verify(token, "Sourav@123");
    const user = await User.findById(verify._id);
    if (!user) {
      throw new Error("User Not Found!");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Please authenticate." });
  }
};

module.exports = {
  userAuth,
};
