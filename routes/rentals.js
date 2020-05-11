const { Rental, validate } = require("../models/renatl");
const validateObject = require("../middleware/validateObjectId");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);
/*find elementbyid in given collection*/
async function getElement(collection, id) {
  try {
    return await collection.findById(id);
  } catch (err) {
    console.log(err.message);
  }
}

/*post a rental*/
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send("bad request", error.details[0].message);
  const customer = await getElement(Customer, req.body.customerId);
  if (!customer)
    return res
      .status(404)
      .send("the customer with the requested id was not found");
  const movie = await getElement(Movie, req.body.movieId);
  if (!movie)
    return res
      .status(404)
      .send("the movie with the requested id was not found");
  if (movie.numberInStock === 0)
    return res.status(400).send("requested movie not in stock");
  let rental = new Rental({
    customer: {
      _id: customer._id,
      isGold: customer.isGold,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  //in case something went wrong and we want both tasks to runs or don't run
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();
    //   rental = await rental.save();
    //   movie.numberInStock--;
    //   movie.save();
    res.send(rental);
  } catch (err) {
    res.status(500).send("something went wrong...");
  }
});

async function getRentalsById(id) {
  try {
    return await Rental.findById(id);
  } catch (err) {
    console.log("error", err.message);
  }
}

/*get all rentals*/
router.get("/", async (req, res) => {
  try {
    const rental = await Rental.find();
    res.send(rental);
  } catch (err) {
    res.send(err.message);
  }
});

/*get rentals by id*/
router.get("/:id", validateObject, async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send("bad request", error.details[0].message);
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("the requested rental was not found");
  res.send(rental);
});

module.exports = router;
