const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const schemaUser = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: Boolean
});

schemaUser.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id,name:this.name,email:this.email, isAdmin: this.isAdmin },
    config.get("secretkey")
  );
  return token;
};
const User = mongoose.model("User", schemaUser);
/*validation request*/
const validateUser = user => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  });
  return schema.validate(user);
};

module.exports.User = User;
module.exports.validate = validateUser;
module.exports.schemaUser = schemaUser;
