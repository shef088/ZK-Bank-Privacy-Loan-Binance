import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import '../styles/LoanHistory.css';

// Define the loan data interface
interface LoanDetails {
  totalRepayment: number;
}

interface Loan {
  _id: string;
  loanAmount: number;
  loanTerm: number;
  loanStatus: string;
  loanDetails: LoanDetails;
  createdAt: string;
}

// LoanHistory component
const LoanHistory: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanHistory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/loans/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const loaddata= response.data.loans.reverse()
        setLoans(loaddata); // Assuming response data contains an array of loans
        console.log("Loans::",loaddata)
      } catch (err: any) {
        console.log('error:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.message || 'Error fetching loan history');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoanHistory();
  }, [navigate]);

  const handleLoanClick = (loanId: string) => {
    navigate(`/loans/${loanId}`); // Navigate to the loan details page
  };

  return (
    <div className="loan-history-container">
      {isLoading && <Loader />}
      {error && <p className="error-message">{error}</p>}
      <h2 className="title">Loan History</h2>
      {loans.length === 0 ? (
        <p className="no-loans">No loan history found</p>
      ) : (
        <ul className="loan-list">
          {loans.map((loan) => (
            <li
              key={loan._id}
              className="loan-item"
              onClick={() => handleLoanClick(loan._id)} // Add onClick handler
            >
              <div className="loan-detail">
                <strong>Loan Amount:</strong> ${loan.loanAmount}
              </div>
              <div className="loan-detail">
                <strong>Loan Term:</strong> {loan.loanTerm} months
              </div>
              <div className="loan-detail">
                <strong>Status:</strong> {loan.loanStatus || 'Pending'}
              </div>
              <div className="loan-detail">
                <strong>Total Repayment:</strong> ${loan.loanDetails.totalRepayment}
              </div>
              <div className="loan-detail">
                <strong>Date Created:</strong> {moment(loan.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoanHistory;
