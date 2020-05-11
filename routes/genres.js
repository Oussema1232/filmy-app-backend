const authoriz = require("../middleware/authoriz");
const validateObject = require("../middleware/validateObjectId");
const express = require("express");
const auth = require("../middleware/auth");
const { Genre, validate } = require("../models/genre");
const router = express.Router();

/*create a genre*/
async function createGenres(name) {
  const genres = new Genre({
    genre: name,
  });

  const genre = await genres.save();
  return genre;
}

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort({ genre: 1 });
  res.send(genres);
});

/*get a specific movie genre*/
router.get("/:id", validateObject, async (req, res) => {
  const genre = await Genre.findById({ _id: req.params.id });
  if (!genre) return res.status(404).send("This genre does not exist");
  res.send(genre);
});

/*post new movie genre*/
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await createGenres(req.body.genre);
  res.send(genre);
});

/*update a movie genre*/
router.put("/:id", [auth, validateObject], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findOneAndUpdate(
    { _id: req.params.id },
    [
      {
        $set: {
          genre: req.body.genre,
        },
      },
    ],
    { returnNewDocument: true },
    function (err, res) {
      return res;
    }
  );
  if (!genre) return res.status(404).send("This genre does not exist");
  res.send(genre);
});

/*delete a movie genre*/
router.delete("/:id", [auth, validateObject, authoriz], async (req, res) => {
  // const genre = await getGenresById(req.params.id);
  const movieGenre = await Genre.findOneAndDelete({ _id: req.params.id });
  if (!movieGenre)
    return res
      .status(404)
      .send("the given Id does nor correspond to any movie genre");

  res.send(movieGenre);
});

module.exports = router;
