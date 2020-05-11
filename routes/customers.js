const express = require("express");
const router = express.Router();
const { Customer, Validate } = require("../models/customer");
const validateObject = require("../middleware/validateObjectId");

/*get all customers*/
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});
/*get customer by id*/
router.get("/:id", validateObject, async (req, res) => {
  const customer = await Customer.findById({ _id: req.params.id });
  if (!customer)
    res.status(404).send("the customer with the given id is not found");
  res.send(customer);
});

/*update a customer*/
router.put("/:id", validateObject, async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id },
    [
      {
        $set: {
          isGold: req.body.isGold,
          name: req.body.name,
          phone: req.body.phone,
        },
      },
    ],
    { returnNewDocument: true },
    function (err, res) {
      return res;
    }
  );

  if (!customer)
    return res.status(404).send("the customer with the given id is not found");
  res.send(customer);
});

/*delete customer*/
router.delete("/:id", validateObject, async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id });
  if (!customer)
    res.status(404).send("the customer with the given id is not found");
  res.send(customer);
});

/*create a customer*/
async function createCustomer(isgold, name, phone) {
  const customer = new Customer({
    isGold: isgold,
    name: name,
    phone: phone,
  });
  try {
    return await customer.save();
  } catch (err) {
    for (field in err.error) console.log(err.error[field].message);
  }
}

module.exports = router;
