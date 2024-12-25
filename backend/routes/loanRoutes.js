const express = require('express');
const { requestLoan, getLoanHistory, getLoanDetails } = require("../controllers/loanController.js");
const { protect } = require("../middleware/authMiddleware.js"); // Middleware to protect routes

const loanRouter = express.Router();

// Protect middleware ensures that only authenticated users can access the routes
loanRouter .post("/request", protect, requestLoan); // Route to request a new loan
loanRouter .get("/history", protect, getLoanHistory); // Route to get loan history
loanRouter .get("/:loanId", protect, getLoanDetails); // Route to get loan details by loan ID

module.exports =loanRouter ;
