const Address = require("../model/Address");
const {
  verifyToken,
  verifyAndAuthToken,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// ADD ADDRESS
router.post("/addAddress", verifyToken, async (req, res) => {
  const newAddress = new Address(req.body);

  try {
    const addAddress = await newAddress.save(newAddress);
    res.status(201).json(addAddress);
  } catch (err) {
    res.status(400).json(err);
  }
});

// ADDRESS UPDATE
router.put("/:id", verifyAndAuthToken, async (req, res) => {
  try {
    const updateAddress = await Address.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updateAddress);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE Address
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(req.params.id);

    res.json({
      messege: `${deletedAddress.title} has been deleted`,
    });
  } catch (err) {
    res.status(405).json(err);
  }
});

//GET Address
router.get("/find/:userID", verifyAndAuthToken, async (req, res) => {
  try {
    const getAddress = await Address.findOne({ userID: req.params.userID });

    res.status(200).json(getAddress);
  } catch (err) {
    res.status(400).json(err);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Addresss = await Address.find();

    res.status(200).json(Addresss);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
