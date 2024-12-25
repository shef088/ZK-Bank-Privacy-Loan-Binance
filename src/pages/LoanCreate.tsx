
import React, { useState , useEffect} from "react";
import axios from "axios";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ethers } from "ethers";
import { useWriteGetSecretAssignSecret } from "../generated";
import "../styles/LoanRequest.css";
import { toast } from "react-toastify";
import { CONTRACT_ADDRESS, APP_ID, SCHEMA_ID, BASE_URL } from "../constants";
 
const LoanCreate: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(1000);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  const [loanStatus, setLoanStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { writeContractAsync } = useWriteGetSecretAssignSecret();
  useEffect(() => {
    toast.info("🚨 Important: For testing purposes, you must have more than $1 USD in both your Binance Earn Balance and your Binance Balance in the Last 24 Hours for the verification to pass. 🚨");

  }, []); 
  const calculateMonthlyPayment = (amount: number, term: number) => {
    const interestRate = 0.05;
    const monthlyRate = interestRate / 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
    return monthlyPayment;
  };

  const requestVerifyMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (loanAmount <= 0 || loanTerm <= 0) {
      toast.error("Loan amount and term must be positive numbers.");
      setLoading(false);
      return;
    }

    try {
      console.log("APP_ID::", APP_ID)
      const connector = new TransgateConnect(APP_ID);
      const isAvailable = await connector.isTransgateAvailable();
      console.log("isAvailable")
      if (!isAvailable) {
        toast.error("Please install zkPass Transgate.");
        return;
      }

      const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
      const signer = await provider?.getSigner();
      const recipient = await signer?.getAddress();

      if (!recipient) {
        toast.error("Ethereum wallet is not connected. Install metamask!");
        return;
      }

      const res = (await connector.launch(SCHEMA_ID, recipient)) as any;
      console.log('connector res::', res)
      const validatedResult = connector.verifyProofMessageSignature("evm", SCHEMA_ID, res);
      console.log("validatedres::", validatedResult)
      if (!validatedResult) {
        toast.error("ZKProof verification failed.");
        setLoanStatus("Verification failed.");
        return;
      }

      alert("ZKProof Verified Successfully");
      const taskId = ethers.hexlify(ethers.toUtf8Bytes(res.taskId)) as `0x${string}`;
      const schemaIdHex = ethers.hexlify(ethers.toUtf8Bytes(SCHEMA_ID)) as `0x${string}`;

      const chainParams = {
        taskId,
        schemaId: schemaIdHex,
        uHash: res.uHash as `0x${string}`,
        recipient: recipient as `0x${string}`,
        publicFieldsHash: res.publicFieldsHash as `0x${string}`,
        validator: res.validatorAddress as `0x${string}`,
        allocatorSignature: res.allocatorSignature as `0x${string}`,
        validatorSignature: res.validatorSignature as `0x${string}`,
      };

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        args: [chainParams],
      });

      toast.success("Smart contract verification successful. Confirming transaction...");

      const loanData = { loanAmount, loanTerm };
      const response = await axios.post(`${BASE_URL}/loans/request`, loanData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.status === 201) {
        setLoanStatus("Loan successfully approved!");
        toast.success("Your loan request has been approved!");
      } else {
        setLoanStatus("Error creating loan on the backend.");
      }
    } catch (error) {
      console.error("Error verifying loan:", error);
      toast.error("An error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 
 
  return (
    <div className="loan-form-container">
      <form className="form" onSubmit={requestVerifyMessage}>
        <h3>Loan Request Credibility (Binance Option)</h3>

        <label htmlFor="loan-amount">
          Loan Amount (USDT):
          <input
            id="loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
          />
        </label>
        <label htmlFor="loan-term">
          Loan Term (Months):
          <input
            id="loan-term"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Start Credibility Verification"}
        </button>

        {loanStatus && <h3>{loanStatus}</h3>}

        <div className="repayment-details">
          <h3>Repayment Details:</h3>
          <p><strong>Loan Amount:</strong> {loanAmount} USDT</p>
          <p><strong>Loan Term:</strong> {loanTerm} months</p>
          <p><strong>Monthly Payment:</strong> {calculateMonthlyPayment(loanAmount, loanTerm).toFixed(2)} USDT</p>
          <p><strong>Total Repayment:</strong> {(calculateMonthlyPayment(loanAmount, loanTerm) * loanTerm).toFixed(2)} USDT</p>
          <p><strong>Interest Rate:</strong> 0.05%</p>
        </div>
      </form>
      <div>
        <br></br>
        <h3>Eligibility Criteria</h3>
          <p className="eligibility-title">To be eligible for the loan, the following conditions must be met:</p>
          <div className="eligibility-container">
            <div className="eligibility-condition">
              <div className="condition-icon">💰</div>
              <div className="condition-text">
                <strong>Binance Earn Balance:</strong> Your Binance Earn Balance should be more than 1 USDT.
              </div>
            </div>
            <div className="eligibility-condition">
              <div className="condition-icon">⏳</div>
              <div className="condition-text">
                <strong>Binance Active Balance:</strong> Your Active Binance Balance from the past 24 hours should be more than 1 USDT.
              </div>
            </div>
          </div>

          <p className="eligibility-note">
            Please note that we use <strong>zkProofs</strong> for all verifications, ensuring that none of your private Binance data is exposed. Your financial data will remain confidential, and only the proof of eligibility will be shared for verification.
          </p>
        </div>
           
   
    </div>
  );
};

export default LoanCreate;
