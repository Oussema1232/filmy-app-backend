const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

module.exports = function () {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info("connecting to genres database.."));
};
