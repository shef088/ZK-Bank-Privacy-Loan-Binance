const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    loanAmount: { type: Number, required: true },
    loanTerm: { type: Number, required: true },
    loanDetails: {
      monthlyPayment: { type: String },
      totalRepayment: { type: String },
      interestRate: { type: String },
    },
    approvedAmount: { type: Number },
    loanStatus: { type: String }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

const LoanModel = mongoose.model("Loan", LoanSchema);

module.exports = LoanModel;
