import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const USER_ID = "69a5b88ce7d39cd0b31133d8"; //Change userId
const TOTAL_REQUESTS = 10; 
const AMOUNT = 1000;
const port = process.env.NODE_PORT;

const token = jwt.sign(
  { userId: USER_ID },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

console.log("Generated Token:", token);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runTest = async () => {

  try {
    console.log("\nFetching initial balance...");
    const initialWallet = await axios.get(
      `http://localhost:${port}/api/v1/wallet/${USER_ID}`
    );

    const initialBalance = initialWallet.data.currentBalance || initialWallet.data.balance;
    console.log("Initial Balance:", initialBalance);

    console.log("\nSending withdrawal requests...\n");

    const requests = [];

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
      requests.push(
        axios.post(
          `http://localhost:${port}/api/v1/withdraw`,
          { amount: AMOUNT, destination: "UPI" },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "idempotency-key": `stress-${Date.now()}-${i}`
            }
          }
        )
        .then(res => {
          console.log("Success:", res.status);
        })
        .catch(err => {
          console.log(
            "Request failed:",
            err.response?.status,
            err.response?.data
          );
        })
      );
    }

    await Promise.all(requests);

    console.log("\nWaiting for background processing...");
    await sleep(8000);

    const finalWallet = await axios.get(
      `http://localhost:${port}/api/v1/wallet/${USER_ID}`
    );

    const finalBalance = finalWallet.data.currentBalance || finalWallet.data.balance;

    console.log("\nFinal Balance:", finalBalance);
    console.log("Actual Deduction:", initialBalance - finalBalance);

    const summary = await axios.get(
      `http://localhost:${port}/api/v1/wallet/${USER_ID}/summary`
    );

    console.log("\nRecent Transactions:");
    console.log(summary.data.recentTransactions);

    console.log("\nTest completed.");

  } catch (error) {
    console.log("Fatal Error:", error.message);
  }
};

runTest();