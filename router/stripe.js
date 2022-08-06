const router = require("express").Router();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(201).json(stripeRes);
      }
    }
  );
});

module.exports = router;
