const LoanModel  = require("../models/LoanModel");
// Request a new loan
const requestLoan = async (req, res) => {
  console.log("Requesting loan");
  const { loanAmount, loanTerm } = req.body;
  const userId = req.userId;  

  try {
    // Validate input (optional, for better error handling)
    if (!loanAmount || !loanTerm || loanTerm <= 0 || loanAmount <= 0) {
      return res.status(400).json({
        message: "Invalid loan amount or term",
      });
    }

    // Calculate loan details using amortization formula
    const interestRate = 0.05; // Annual interest rate (5%)
    const monthlyRate = interestRate / 12; // Monthly interest rate

    // Amortization formula to calculate the monthly payment
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -loanTerm));

    // Calculate total repayment (monthly payment * loan term)
    const totalRepayment = monthlyPayment * loanTerm;

    // Create loan details object
    const loanDetails = {
      monthlyPayment: monthlyPayment.toFixed(2), // Round to 2 decimal places
      totalRepayment: totalRepayment.toFixed(2), // Round to 2 decimal places
      interestRate: (interestRate * 100).toFixed(2), // Convert interest rate to percentage
    };

    // Create a new loan in the database
    const loan = await LoanModel.create({
      userId,
      loanAmount,
      loanTerm,
      loanDetails,
      approvedAmount: loanAmount, // Assuming the full loan amount is approved
      loanStatus: "Approved",
    });

    res.status(201).json({
      message: "Loan request created successfully",
      loan,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      message: "Error creating loan request",
      error: err.message,
    });
  }
};

 
// Get loan details by loan ID
const getLoanDetails = async (req, res) => {
  
  const { loanId } = req.params;
  console.log("Load id::", loanId)

  try {
    // Fetch the loan document by ID
    const loan = await LoanModel.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({ loan });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error fetching loan details", error: err.message });
  }
};

// Get loan history by user id
const getLoanHistory = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({
      message: "User ID not found",
    });
  }

  try {
    // Use Mongoose's `find` method to retrieve loans
    const loans = await LoanModel.find({ userId });
    res.status(200).json({
      loans,
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({
      message: "Error fetching loan history",
      error: err.message,
    });
  }
};

module.exports = {
  requestLoan,
  getLoanHistory,
  getLoanDetails,
};
