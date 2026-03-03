# Payment Withdrawal System

## Overview

This project is a secure and concurrency-safe wallet withdrawal system
built using Node.js and MongoDB.\
It simulates real-world fintech platforms like Google Pay or Paytm with
focus on:

-   Atomic balance deduction
-   Concurrency handling
-   Idempotent withdrawals
-   JWT authentication
-   Background processing
-   Immutable transaction logs

------------------------------------------------------------------------

## Tech Stack

-   Node.js (Latest LTS)
-   Express.js
-   MongoDB (Atlas)
-   Mongoose
-   JWT Authentication

------------------------------------------------------------------------

## Setup Instructions

### Install Dependencies

``` bash
npm install
```

### Create Environment File

Create a `.env` file in the root folder:

    NODE_PORT=3000
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_secret_key

### Start Server

``` bash
npm run dev
```

Server runs on:

    http://localhost:3000

------------------------------------------------------------------------

## Seed Data


``` bash
node src/seed.js
```

This will create: - Test user - Wallet - Initial balance. Make Sure copy the userId and pass in paymentwithDraw.js file to check the transaction.

------------------------------------------------------------------------

## Authentication

Withdrawal APIs require JWT.

Send token in header:

    Authorization: Bearer <your_token>

------------------------------------------------------------------------

## API Endpoints

### Create User

POST `/api/v1/users`

### Create Withdrawal

POST `/api/v1/withdraw`

Headers: - Authorization: Bearer Token - idempotency-key: unique value

Body:

``` json
{
  "amount": 1000,
  "destination": "UPI"
}
```

### Get Wallet Balance

GET `/api/v1/wallet/:userId`

### Get Wallet Summary

GET `/api/v1/wallet/:userId/summary`

### Get Withdrawal Details

GET `/api/v1/withdrawals/:withdrawalId`

------------------------------------------------------------------------

## Background Processor

-   Runs every 5 seconds
-   Processes withdrawals in batches
-   Uses MongoDB transactions
-   Retries write conflicts
-   Prevents negative balance

------------------------------------------------------------------------

## Stress Test

Run:

``` bash
node paymentwithDraw.js
```
This sends concurrent withdrawal requests and validates balance safety. 

------------------------------------------------------------------------

## Security Features

-   JWT authentication
-   Idempotency key protection
-   Strict schema validation
-   Immutable transaction logs
-   Atomic wallet updates

------------------------------------------------------------------------

## Production Improvements (Future Scope)

-   Replace polling with message queue (BullMQ / Kafka)
-   Add rate limiting
-   Add monitoring & logging
-   Horizontal scaling support

------------------------------------------------------------------------

## Conclusion

This project demonstrates secure financial transaction handling with
concurrency safety, atomic database operations, and clean backend
architecture.
