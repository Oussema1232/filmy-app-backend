const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
//  Joi.objectId=require('joi-objectid')(Joi)

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        isGold: {
          type: Boolean,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        phone: String,
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: String,
        dailyRentalRate: { type: Number, required: true },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
  })
);

/*validation*/
function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(), //customerId:Joi.objectId().required()
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
