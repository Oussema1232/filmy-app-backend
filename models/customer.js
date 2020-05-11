const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const customerShema = mongoose.Schema({
  isGold: {
    type: Boolean,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: String
});

const Customer = new mongoose.model("Customer", customerShema);

const validateCustomer = customer => {
  const schema = Joi.object({
    isGold: Joi.boolean().required(),
    name: Joi.string().required(),
    phone: Joi.string().required()
  });

  return schema.validate(customer);
};

exports.Customer = Customer;
exports.Validate = validateCustomer;
