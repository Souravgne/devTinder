const validator = require("validator");

const validateEditProfileData = (req) => {
  console.log(req.body);
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditFields.includes(field);
  });
  return isEditAllowed;
};
const validateResetPassword = (req) => {
  console.log(req.body);
  const allowedEditFields = ["oldPassword", "newPassword"];

  const isEditAllowed = Object.keys(req.body).every((field) => {
    return allowedEditFields.includes(field);
  });
  return isEditAllowed;
};
module.exports = {
  validateEditProfileData,
  validateResetPassword,
};
