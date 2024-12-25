import { useState } from "react";
import "./App.css";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ethers } from "ethers";
import { useWriteGetSecretAssignSecret } from "./generated";

const contractAddress = "0xf8B2Ec2c9bA0E473E3aE4682561229e0bCf274F5";

const App = () => {
  const [appId, setAppId] = useState<string>("b7627e76-b9f2-41b0-b954-2bc5f63ecec3");
  const [schemaId, setSchemaId] = useState<string>("7b7b31ecbc654213ba7fc189b01d21f3");
  const [loanAmount, setLoanAmount] = useState<number>(1000);  // loan amount in USDT
  const [loanTerm, setLoanTerm] = useState<number>(12);  // loan term in months
  const [result, setResult] = useState<any | undefined>(undefined);
  const [loanStatus, setLoanStatus] = useState<string>("");
  const { writeContractAsync } = useWriteGetSecretAssignSecret();

  // Function to calculate the monthly repayment
  const calculateMonthlyPayment = (amount: number, term: number) => {
    const interestRate = 0.05; // 5% annual interest rate, can adjust as needed
    const monthlyRate = interestRate / 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
    return monthlyPayment;
  };

  // Handle loan verification and contract submission
  const requestVerifyMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const connector = new TransgateConnect(appId);
      const isAvailable = await connector.isTransgateAvailable();

      if (isAvailable) {
        const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
        const signer = await provider?.getSigner();
        const recipient = await signer?.getAddress();

        const res = (await connector.launch(schemaId, recipient)) as any;

        const validatedResult = connector.verifyProofMessageSignature("evm", schemaId, res);
        if (validatedResult) {
          alert("Verified Successfully");

          setResult(res);

          // Calculate monthly repayment based on loan term
          const monthlyPayment = calculateMonthlyPayment(loanAmount, loanTerm);
          console.log(`Loan Term: ${loanTerm} months`);
          console.log(`Monthly Payment: ${monthlyPayment.toFixed(2)} USDT`);

          // Add loan details to the smart contract call
          const taskId = ethers.hexlify(ethers.toUtf8Bytes(res.taskId)) as `0x${string}`;
          const schemaIdHex = ethers.hexlify(ethers.toUtf8Bytes(schemaId)) as `0x${string}`;

          if (recipient) {
            const chainParams = {
              taskId,
              schemaId: schemaIdHex,
              uHash: res.uHash as `0x${string}`,
              recipient: recipient as `0x${string}`,
              publicFieldsHash: res.publicFieldsHash as `0x${string}`,
              validator: res.validatorAddress as `0x${string}`,
              allocatorSignature: res.allocatorSignature as `0x${string}`,
              validatorSignature: res.validatorSignature as `0x${string}`,
              loanAmount: loanAmount,
              loanTerm: loanTerm,
              monthlyPayment: monthlyPayment.toFixed(2),
            };

            await writeContractAsync({
              address: contractAddress,
              args: [chainParams],
            });

            setLoanStatus("Loan request verified and sent to the smart contract!");
          }
        } else {
          setLoanStatus("Verification failed.");
        }
      } else {
        console.log("Please install zkPass Transgate from https://chromewebstore.google.com/detail/zkpass-transgate/afkoofjocpbclhnldmmaphappihehpma");
      }
    } catch (error) {
      console.error("Error verifying loan:", error);
      setLoanStatus("An error occurred during verification.");
    }
  };

  return (
    <div className="app">
      <form className="form" onSubmit={requestVerifyMessage}>
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
        <button type="submit">Start Loan Verification</button>

        {loanStatus && <h3>{loanStatus}</h3>}

        {/* Show repayment details dynamically */}
        <div>
          <h3>Repayment Details:</h3>
          <p><strong>Loan Amount:</strong> {loanAmount} USDT</p>
          <p><strong>Loan Term:</strong> {loanTerm} months</p>
          <p>
            <strong>Monthly Payment:</strong> 
            {calculateMonthlyPayment(loanAmount, loanTerm).toFixed(2)} USDT
          </p>
        </div>

        {result && (
          <>
             
            <h1>Loan Approved: {loanAmount} USDT</h1>
            <h2>Term: {loanTerm} Months</h2>
            <h3>Monthly Payment: {calculateMonthlyPayment(loanAmount, loanTerm).toFixed(2)} USDT</h3>
          </>
        )}
      </form>
    </div>
  );
};

export default App;
