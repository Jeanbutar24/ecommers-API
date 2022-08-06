const router = require("express").Router();
const User = require("../model/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUSer = await newUser.save();
    res.status(201).json(savedUSer);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    // !user && res.status(400).json("Wrong Username Or Password");
    if (!user) {
      res.status(401).json("Wrong username or Password");
      return;
    }

    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const OriginalPassword = hashPassword.toString(CryptoJS.enc.Utf8);

    // password !== req.body.password &&
    //   res.status(400).json("Wrong Username Or Password");
    if (req.body.password !== OriginalPassword) {
      res.status(401).json("Wrong username or Password");
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {
        expiresIn: "1d",
      }
    );
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
