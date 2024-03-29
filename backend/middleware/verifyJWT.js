const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // Access token comes in header of req
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Access token" });
  }
  // Access token
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    } //invalid token
    req.user = decoded.UserInfo.username;
    req.role = decoded.UserInfo.role;
    next();
  });
};

module.exports = verifyJWT;
