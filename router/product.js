const User = require("../model/User");
const Product = require("../model/Product");
const { verifyAndAuthToken, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// AddPRODUCT
router.post("/addProduct", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const addProduct = await newProduct.save(newProduct);
    res.status(201).json(addProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PRODUCT UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updateProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    res.json({
      messege: `${deletedProduct.title} has been deleted`,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);

    res.status(200).json(getProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET ALL PRODUCT
router.get("/", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategories = req.query.categories;
  try {
    let products;

    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryCategories) {
      products = await Product.find({
        categories: {
          $in: [queryCategories],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
