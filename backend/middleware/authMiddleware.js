// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ;
console.log("JWT SECRET:", JWT_SECRET); // Debugging log for JWT secret

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Debugging log to see the decoded JWT
    req.userId = decoded.id; // Attach userId to the request
    next();
  } catch (err) {
    res.status(401).json({
      message: "Token is not valid",
    });
  }
};

module.exports = { protect };
