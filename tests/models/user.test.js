
  
 

const { User } = require("../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("generateAuthToken", () => {
  it("should retuen valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    }; //jwt converts the id to a string so to make the verify method valid we shall convert this id we create with mongoose to a string
    user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("secretkey")); //u have to add a config file for testing environnement, u can put the private key since u will use it only on testing
    expect(decoded).toMatchObject(payload); //u have to set _id to a valid object id we can't set it to a number
  });
});

