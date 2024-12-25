
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import LoanHistory from "./pages/LoanHistory";
import Dashboard from "./pages/Dashboard"; 
import LoanCreate from "./pages/LoanCreate";
import AuthWrapper from "./utils/AuthWrapper";  
import LoanDetail from "./pages/LoanDetail";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes wrapped in AuthWrapper */}
          <Route
            path="/loan-history"
            element={
              <AuthWrapper>
                <LoanHistory />
              </AuthWrapper>
            }
          />  
          <Route
            path="/loans/:id"
            element={
              <AuthWrapper>
                <LoanDetail />
              </AuthWrapper>
            }
          />
          <Route
            path="/"
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />
          <Route
            path="/loan-create"
            element={
              <AuthWrapper>
                <LoanCreate />
              </AuthWrapper>
            }
          />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
};

export default Router;
