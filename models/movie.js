const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("@hapi/joi");

const Movies = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: String,
    genre: genreSchema,
    numberInStock: Number,
    dailyRentalRate: Number,
  })
);

const validationMovie = (genre) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });

  return schema.validate(genre);
};

module.exports.Movie = Movies;
module.exports.validation = validationMovie;
