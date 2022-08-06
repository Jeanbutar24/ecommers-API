const Cart = require("../model/Cart");
const {
  verifyToken,
  verifyAndAuthToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// ADD CART
router.post("/addProduct", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const addCart = await newCart.save(newCart);
    res.status(201).json(addCart);
  } catch (err) {
    res.status(400).json(err);
  }
});

// CART UPDATE
router.put("/:id", verifyAndAuthToken, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updateCart);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE CART
router.delete("/:id", verifyAndAuthToken, async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);

    res.json({
      messege: `${deletedCart.UserID} has been deleted`,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET CART
router.get("/find/:userID", verifyAndAuthToken, async (req, res) => {
  try {
    const getCart = await Cart.findOne({ userID: req.params.userID });

    res.status(200).json(getCart);
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();

    res.status(200).json(carts);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
