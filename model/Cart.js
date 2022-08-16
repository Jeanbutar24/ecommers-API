const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      require: true,
    },

    productID: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    size: {
      type: String,
      require: true,
    },
    color: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    img: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      reuire: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
