const authoriz = require("../middleware/authoriz");
const auth = require("../middleware/auth");
const validateObject = require("../middleware/validateObjectId");
const { Movie, validation } = require("../models/movie");
const { Genre } = require("../models/genre");
const winston = require("winston");
const express = require("express");
const route = express.Router();

/*find genre*/
async function findGenre(id) {
  try {
    return await Genre.findById(id);
  } catch (err) {
    winston.error(err.message);
  }
}

/*create a movie*/
route.post("/", auth, async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await findGenre(req.body.genreId);

  if (!genre)
    return res.status(404).send("the genre with the requested id is not found");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      genre: genre.genre,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  const result = await movie.save();
  res.send(result);
});

route.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

route.get("/:id", validateObject, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res
      .status(404)
      .send("the given Id does nor correspond to any movie");
  res.send(movie);
});

route.put("/:id", [auth, validateObject], async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        genre: genre.genre,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

route.delete("/:id", [auth, validateObject, authoriz], async (req, res) => {
  // const genre = await getGenresById(req.params.id);
  const movie = await Movie.findOneAndDelete({ _id: req.params.id });
  if (!movie)
    return res
      .status(404)
      .send("the given Id does nor correspond to any movie");

  res.send(movie);
});

module.exports = route;
