# ZK-Bank Privacy Loan (Binance)

## Description
**ZK-Bank Privacy Loan (Binance)** is a decentralized application designed to enable privacy-preserving credit verification and loan applications using **zkPass**. By leveraging zero-knowledge proofs, users can prove their creditworthiness without revealing sensitive financial details. 

The app integrates with the **Binance predefined schemas**, specifically the **Earn Balance** and **Balance in the Last 24 Hours**, to verify users' financial standing. These schemas are combined to generate a composite creditworthiness score, which is then used to approve or reject loan applications.

With **zkPass** and these **Binance schemas**, users can maintain their financial privacy while accessing decentralized loan services.

---

## Video Demonstration

📺 Watch a demo of the App:  
👉 **[Video Demo](https://youtu.be/5rwcwSivJtc)**

---
## My Deployed Smart Contract Address
**Smart Contract Address:** 👉  0xf8B2Ec2c9bA0E473E3aE4682561229e0bCf274F5    


---

## Live Application
NB: Live application might be down if hosting platform is down or upgrading. Or might not work as expected due to extra configurations on the hosting platforms(In case emergency please run locally).
👉 
1. **[Frontend](https://zk-bank-privacy-loan-binance.vercel.app/)**

2. **[Backend Api](https://zk-bank-privacy-loan-binance-rtbo.vercel.app/)**


---
## Zkpass Custom Schema Json
 - For earn balance and balance in last 24 hours
   ```json
   {
     "issuer": "Binance",
     "desc": "This schema verifies a user's eligibility for a crypto-backed loan on the ZK-Crypto Wealth & Loan Platform by combining three key factors from their Binance account: Binance Earn Balance, and 24-Hour Active Balance.",
     "website": "https://www.binance.com/my/dashboard",
     "breakWall": true,
     "APIs": [
       {
         "host": "www.binance.com",
         "intercept": {
           "url": "bapi/accounts/v1/private/account/user/base-detail",
           "method": "POST"
         },
         "nullifier": "data|userId"
       },
       {
         "host": "www.binance.com",
         "intercept": {
           "url": "bapi/asset/v2/private/asset-service/wallet/balance",
           "method": "GET"
         },
         "override": {
           "query": [
             {
               "quoteAsset": "USDT",
               "verify": true
             },
             {
               "needBalanceDetail": "false"
             }
           ]
         },
         "assert": [
           {
             "key": "data|?=0|accountType",
             "value": "SAVING",
             "operation": "="
           },
           {
             "key": "data|?=0|balance",
             "value": "1.00000000",
             "operation": ">"
           }
         ]
       },
       {
         "host": "www.binance.com",
         "intercept": {
           "url": "bapi/apex/v2/private/apex/marketing/wallet/userHistoryAssets",
           "method": "POST"
         },
         "override": {
           "body": [
             {
               "recentDays": "1",
               "verify": true
             }
           ]
         },
         "assert": [
           {
             "key": "data|6|total",
             "value": "1.00000000",
             "operation": ">"
           }
         ]
       }
     ],
     "HRCondition": [
       "Verifies the user's eligibility for a crypto-backed loan based on two key factors from their Binance account: Earn Balance and Active Balance in the last 24 hours. All verifications are performed using zkProofs to ensure privacy."
     ],
     "tips": {
       "message": "When you successfully log in, please click the 'Start' button to initiate the verification process."
     }
   }
   ```
---




 
## Table of Contents
1. [Clone the Repository](#1-clone-the-repository)
2. [Creating a Custom Schema on zkPass](#2-creating-a-custom-schema-on-zkpass)
3. [Frontend Setup](#3-frontend-setup)
4. [Backend Setup](#4-backend-setup)
5. [Smart Contract Setup](#5-smart-contract-setup)

---
 
## 1. Clone the Repository

```bash
git clone https://github.com/Im-in123/ZK-Bank-Privacy-Loan-Binance
cd ZK-Bank-Privacy-Loan-Binance
```
## 2. Creating a Custom Schema on zkPass

### Steps to Create a Custom Schema:

1. **Visit zkPass Developer Portal:**
   - Go to the [zkPass Developer Portal](https://dev.zkpass.org/).
   - Sign up or log in if you haven’t already.

2. **Create a New App:**
   - Click on **Create New App** and enter your frontend url without trailing slash into the domain field.
   - After creating, make sure to copy the **appId**, as you will need it for the frontend integration.

3. **Add a Custom Schema:**
   - After creating the app, click on **Add Schema** and select **Custom Schema**.

4. **Set the Schema Details:**
   - Set the schema's **name** to `Binance Financial Data`.
   - Set the **category** to `Finance`.

5. **Define the Schema JSON:**
   - Use the following JSON for the schema definition:
   
   ```json
   {
     "issuer": "Binance",
     "desc": "This schema verifies a user's eligibility for a crypto-backed loan on the ZK-Crypto Wealth & Loan Platform by combining three key factors from their Binance account: Binance Earn Balance, and 24-Hour Active Balance.",
     "website": "https://www.binance.com/my/dashboard",
     "breakWall": true,
     "APIs": [
       {
         "host": "www.binance.com",
         "intercept": {
           "url": "bapi/accounts/v1/private/account/user/base-detail",
           "method": "POST"
         },
         "nullifier": "data|userId"
       },
       {
         "host": "www.binance.com",
         "intercept": {
           "url": "bapi/asset/v2/private/asset-service/wallet/balance",
           "method": "GET"
         },
         "override": {
           "query": [
             {
               "quoteAsset": "USDT",
               "verify": true
             },
             {
               "needBalanceDetail": "false"
             }
           ]
         },
         "assert": [
           {
             "key": "data|?=0|accountType",
             "value": "SAVING",
             "operation": "="
           },
           {
             "key": "data|?=0|balance",
             "value": "1.00000000",
             "operation": ">"
           }
         ]
       },
       {
         "host": "www.binance.com",
         "intercept": {
           "url": "bapi/apex/v2/private/apex/marketing/wallet/userHistoryAssets",
           "method": "POST"
         },
         "override": {
           "body": [
             {
               "recentDays": "1",
               "verify": true
             }
           ]
         },
         "assert": [
           {
             "key": "data|6|total",
             "value": "1.00000000",
             "operation": ">"
           }
         ]
       }
     ],
     "HRCondition": [
       "Verifies the user's eligibility for a crypto-backed loan based on two key factors from their Binance account: Earn Balance and Active Balance in the last 24 hours. All verifications are performed using zkProofs to ensure privacy."
     ],
     "tips": {
       "message": "When you successfully log in, please click the 'Start' button to initiate the verification process."
     }
   }
   ```
5. **Submit Schema JSON:**
   - Submit the schema for validation.
   - Once approved, zkPass will provide you with a schemaId which is required for integration 
     with your app. Make sure to copy the schemaId.
 
## 3. Frontend Setup

1. Prerequisites:
  - Ensure you are using Chromium or Chrome as the zkPass Schema Validator and Transgate extensions are required.
  - Install the necessary extensions from the Chrome Web Store:
  
- [zkPass Schema Validator](https://chromewebstore.google.com/detail/zkpass-schema-validator/kpcbjghknfclbkejkdllpjhhheppaoca)
- [zkPass Transgate](https://chromewebstore.google.com/detail/zkpass-transgate/afkoofjocpbclhnldmmaphappihehpma)
 

2. Navigate to the root directory of the project:
 
 - Run the following command to install required dependencies:
```bash
npm install
```

3. Configure constants.js:

  - Navigate to src/ and open constants.js. Ensure the following fields are populated:
javascript
```bash
export const BASE_URL = "https://your-backend-url.com";
export const CONTRACT_ADDRESS = "your-contract-address";
export const APP_ID = "your-app-id";
export const SCHEMA_ID = "your-schema-id";
```
Replace BASE_URL with the URL of your backend server.
Start the Frontend Server.

4. Add the frontend url to the cors allow list in the index.js.

5. Run the following command to start the frontend server:
```bash
npm run dev
```
 
## 4. Backend Setup
1. Go back to the root of the  project
2. Navigate to the backend Directory
3. Setup a mongodb or mongo atlas database and note your mongo connection string or connection uri.
3. Create .env File:
 - Create a .env file and populate it with the following information:
```bash
PORT=your_port_number
JWT_SECRET=your_jwt_secret
MONGO_URI=your-mondo-db-connection-uri
```

4. Install Dependencies:

   - Run the following command to install the necessary backend dependencies:
```bash
npm install
```
5. Add the frontend url to the cors allow list in the index.js

6. Start the Backend Server:
```bash
npm start
```

7. Update constants.js:
 
  - Copy the URL of the running backend server and replace BASE_URL in src/constants.js with the copied URL.

 
## 5. Smart Contract Setup

 
1. Install Foundry:

 - In the root folder, run the following command to install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
```
2. Cd into the secret folder
3. Create .env File for Smart Contract:

 - In the secret directory, create a .env file and add the following contents:
 ```bash
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_SEPOLIA_API_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY   #metamask privatekey
```
- Replace YOUR_INFURA_SEPOLIA_API_KEY and YOUR_PRIVATE_KEY with your actual values.

4. Test the Smart Contract:
 ```bash
forge test -vvv --summary
```

5. Deploy the Smart Contract:
 ```bash
source .env
forge script --chain sepolia script/Deployer.s.sol:Deployer --rpc-url ${SEPOLIA_RPC_URL} --broadcast -vvvv
```
6. Copy the deployed contract address in the terminal and the CONTRACT_ADDRESS it in the src/constants.js of the root directory with it




   