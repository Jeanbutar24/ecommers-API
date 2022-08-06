const Order = require("../model/Order");
const {
  verifyToken,
  verifyAndAuthToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE ORDER
router.post("/addOrder", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const addOrder = await newOrder.save(newOrder);
    res.status(201).json(addOrder);
  } catch (err) {
    res.status(400).json(err);
  }
});

// ORDER UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updateOrder);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE ORDER
router.delete("/:userID", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findOne({ userID: req.params.userID });

    res.json({
      messege: `${deletedOrder.UserID} has been deleted`,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET USER ORDER
router.get("/find/:userID", verifyAndAuthToken, async (req, res) => {
  try {
    const getOrder = await Order.find({ userID: req.params.userID });

    res.status(200).json(getOrder);
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
});

// INCOME MONTLY

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
