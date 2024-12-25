import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

// Define the shape of the user object in the Redux state
interface User {
  username: string;
  // Add other properties of the user object as needed
}

interface RootState {
  user: {
    user: User | null; // user can be null if not logged in
  };
}

const Dashboard: React.FC = () => {
  // Use typed useSelector to fetch the user from the Redux state
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>Welcome, {user ? user.username : 'Guest'}!</h1>
        <p>
          This application empowers Binance users to apply for privacy-preserving loans. Using advanced 
          <strong> zkProofs</strong>, we verify your creditworthiness without exposing your personal financial data. 
          Join us in redefining secure and private financial transactions!
        </p>
      </div>

      <div className="action-links">
        <Link to="/loan-history" className="dashboard-link">
          View Loan History
        </Link>
        <Link to="/loan-create" className="dashboard-link">
          Apply for a Loan
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
