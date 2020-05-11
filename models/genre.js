const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const genreSchema = mongoose.Schema({
  genre: {
    type: String,
    require: true
  }
});

const Genres = new mongoose.model("Genre", genreSchema);
const validationGenre = genre => {
  const schema = Joi.object({
    genre: Joi.string().required()
  });

  return schema.validate(genre);
};

module.exports.Genre = Genres;
module.exports.genreSchema = genreSchema;
module.exports.validate = validationGenre;
