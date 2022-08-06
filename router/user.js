const User = require("../model/User");
const {
  verifyToken,
  verifyAndAuthToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// USER UPDATE
router.put("/:id", verifyAndAuthToken, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updateUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE USER
router.delete("/:id", verifyAndAuthToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.json({
      messege: `${deletedUser.username} has been deleted`,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    const { password, ...others } = getUser._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(400).json(err);
  }
});
//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const getUser = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();

    res.status(200).json(getUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } },
      },
      {
        $project: { month: { $month: "$createdAt" } },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
