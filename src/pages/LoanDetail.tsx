import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import "../styles/LoanDetail.css";  
import Loader from "../components/Loader";  
import moment from "moment";

// Define types for the loan structure
interface LoanDetails {
  monthlyPayment: number;
  totalRepayment: number;
  interestRate: number;
}

interface Loan {
  loanAmount: number;
  loanTerm: number;
  loanStatus: string;
  approvedAmount: number;
  loanDetails: LoanDetails;
  createdAt: string;
}

// Define the component with appropriate types
const LoanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Type the params for useParams
  const [loan, setLoan] = useState<Loan | null>(null); // Type for loan state
  const [error, setError] = useState<string>(""); // Type for error message state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Type for loading state

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/loans/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLoan(response.data.loan); // Assume response data has the 'loan' key
      } catch (err) {
        setError("Error fetching loan details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id]);

  return (
    <div className="loan-details-container">
      {isLoading && <Loader />}
      {error && <p className="error-message">{error}</p>}
      <h1 className="loan-details-header">Loan Details</h1>
      {loan ? (
        <div className="loan-card">
          <div className="loan-field">
            <span className="label">Loan Amount:</span>
            <span className="value">${loan.loanAmount}</span>
          </div>
          <div className="loan-field">
            <span className="label">Loan Term:</span>
            <span className="value">{loan.loanTerm} months</span>
          </div>
          <div className="loan-field">
            <span className="label">Loan Status:</span>
            <span className="value">{loan.loanStatus}</span>
          </div>
          <div className="loan-field">
            <span className="label">Approved Amount:</span>
            <span className="value">${loan.approvedAmount}</span>
          </div>
          <div className="loan-field">
            <span className="label">Monthly Payment:</span>
            <span className="value">${loan.loanDetails.monthlyPayment}</span>
          </div>
          <div className="loan-field">
            <span className="label">Total Repayment:</span>
            <span className="value">${loan.loanDetails.totalRepayment}</span>
          </div>
          <div className="loan-field">
            <span className="label">Interest Rate:</span>
            <span className="value">{loan.loanDetails.interestRate}%</span>
          </div>
          <div className="loan-field">
            <span className="label">Created At:</span>
            <span className="value">
              {moment(loan.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </span>
          </div>
        </div>
      ) : (
        <div className="loading">No details available.</div>
      )}
    </div>
  );
};

export default LoanDetail;
