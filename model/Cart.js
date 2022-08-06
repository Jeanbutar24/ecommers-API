const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      require: true,
    },
    products: [
      {
        productID: {
          type: String,
          require: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
