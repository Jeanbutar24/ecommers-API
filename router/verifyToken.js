const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;

  if (!authHeader) {
    return res.status(403).json("Your not Authenticated");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) {
      return res.status(401).json("Token Is Not Valid");
    }

    req.user = user;
    next();
  });
};

const verifyAndAuthToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(401).json("Your Not Allowed To Update Data");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).json("Your Not Allowed To Update Data");
    }
  });
};
module.exports = { verifyToken, verifyAndAuthToken, verifyTokenAndAdmin };
