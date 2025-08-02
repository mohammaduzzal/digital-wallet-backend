#   Digital Wallet API

A robust RESTful API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB** to manage secure, role-based digital wallet system.

---

## 🌐 Live Links

- **Live Deployment:** [Library Management API]()

---

## 🚀 Features

- **JWT Authentication:** Secure login, token refresh, and password management.
- **Role-Based Access Control:** Differentiates between user, agent, and admin roles, with protected routes for each.
- **Wallet & Transaction Management:** Core financial operations including deposit, withdraw, and send money.
- **Atomic Transactions:** Ensures data consistency for multi-step financial operations using MongoDB transactions.
- **Secure Password Hashing:** Uses bcryptjs to securely hash and store user password.
- **Modular Architecture:** A clean, scalable project structure for easy maintenance and feature expansion.
- **Zod Validation:** Comprehensive validation for all incoming request bodies.
- **Error Handling:** Centralized error handling with custom `AppError` for validation and runtime errors..

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Language:** TypeScript
- **Authentication:** JSON Web Tokens (jsonwebtoken), bcryptjs
- **Validation::** Zod
- **Development Tools:** Nodemon, dotenv,cookie-parser
- **Deployment:** Vercel (serverless functions)

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <repo-link>
cd <project-directory>
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL=
PORT=
NODE_ENV=

# JWT Secrets
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRES_IN=

```

---

## 📘 API Documentation

This API provides endpoints for managing users, wallets, and transactions in a digital wallet system.

---

### Auth Endpoints

#### ➕ login

- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### ✅ Successful Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "email": "user@example.com",
      "role": "USER",
      "wallet": "wallet_id"
    }
  },
  "token": "access_token_string"
  }
}
```

---

#### 🚪 Refresh Token

- **Method:** `POST`
- **URL:** `/api/v1/auth/refresh-token`
- **Description:** Generates a new access token using a refresh token stored in cookies.
- 
#### 🔄 Logout

- **Method:** `POST`
- **URL:** `/api/v1/auth/logout`
- **Description:** Clears the HTTP-only cookie containing the refresh token.


#### 🔑 Reset Password

- **Method:** `POST`
- **URL:** `/api/v1/auth/reset-password`
- **Description:** Allows an authenticated user to change their password.

### 👥 User Endpoints

#### ➕ Register a User/Agent

- **Method:** `POST`
- **URL:** `/api/v1/auth/register`
- **Description:** Creates a new user or agent. A wallet is automatically created for them with an initial balance.
- **Request Body:**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "phoneNumber": "01712345678",
  "password": "SecurePassword123!",
  "role": "USER"
}
```


#### 🔍 Get All Users

- **Method:** `GET`
- **URL:** `/api/v1/user/all-users`
- **Roles:** USER, AGENT, ADMIN
- 
#### 👤 Get My Profile

- **Method:** `GET`
- **URL:** `/api/v1/user/me`
- **Roles:** ADMIN
- 
#### 🆔 Get a Single User by ID

- **Method:** `GET`
- **URL:** `/api/v1/user/:id`
- **Roles:** ADMIN

#### 📝 Update a User

- **Method:** `PATCH`
- **URL:** `/api/v1/user/:id`
- **Roles:** USER, AGENT, ADMIN
- **Description:** Allows self-updates for non-admin roles and full updates for admins.

**Request Body:**

**Self-Update (User/Agent):** Can update name, email, phoneNumber, password.

**Admin-Update:** Can update any field, including role, isApproved, commissionRate.


#### 🏦 Wallet Endpoints

#### 🔍 Get All Wallets
**Method:** GET

**URL:** `/api/v1/wallet/all-wallets`

**Roles:** ADMIN

#### 💰 Get My Wallet

**Method:** GET

**URL:** `/api/v1/wallet/my-wallet`

**Roles:** USER, AGENT

#### 🆔 Get a Single Wallet by ID

**Method:** GET

**URL:** `/api/v1/wallet/:id`

**Roles:** ADMIN

#### 📝 Update a Wallet (e.g., Block/Unblock)

**Method:** PATCH

**URL:** `/api/v1/wallet/:id`

**Roles:** ADMIN

**Request Body:**
```json
{
    "isBlocked": true
}
```

#### 💸 Transaction Endpoints

#### ➕ Deposit Money

**Method:** POST

**URL:** `/api/v1/transaction/deposit`

**Roles:** USER

**Description:** User adds money to their own wallet (top-up).

**Request Body:**
```JSON

{
  "amount": 500,
  "description": "Mobile top-up"
}
```
#### ➖ Withdraw Money
**Method:** POST

**URL:** `/api/v1/transaction/withdraw`

**Roles:** USER

**Description:** User withdraws money from their own wallet.

**Request Body:**

```JSON

{
  "amount": 250,
  "description": "Cash withdrawal"
}
```

### ➡️ Send Money

**Method:** POST

**URL:** `/api/v1/transaction/send`

**Roles:** USER

**Description:** User sends money to another user's wallet.

**Request Body:**

```JSON

{
  "amount": 100,
  "receiverWallet": "receiver_wallet_id",
  "description": "Sent to a friend"
}
```


#### ➕ CASH_IN

**Method:** POST

**URL:** `/api/v1/transaction/cash-in`

**Roles:** AGENT

**Description:** Agent adds money to a user's wallet.

**Request Body:**
```JSON

{
     "types": "CASH_IN",
     "amount" : 500,
     "senderWallet" : "688c59e346b9014a38cfe116",
     "receiverWallet" :"688a48f0a806d9b624625b1s8",
     "initiateBy" : "688c59e246b9014a38cfea54a"
}
```

#### ➕ CASH_OUT

**Method:** POST

**URL:** `/api/v1/transaction/cash-out`

**Roles:** AGENT

**Description:** Agent withdraws money from a user's 
wallet.

**Request Body:**
```JSON

{
            "types": "CASH_OUT",
            "amount" : 50,
            "fee" : 5,
            "senderWallet" : "688a48f0a806d9b624625b18",
            "receiverWallet" :"688c59e346b9014a38cfea56",
            "initiateBy" : "688a48f0a806d9b624625b16"
}
```

#### 📜 Get All Transactions

**Method:** GET

**URL:** `/api/v1/transaction/all-transactions`

**Roles:** ADMIN

#### 📜 Get My Transactions

**Method:** GET

**URL:** `/api/v1/transaction/me`

**Roles:** USER, AGENT

**Description:** Retrieves all transactions related to the authenticated user's wallet.


#### 🔍 Advanced Query Builder
To provide flexible and reusable querying , the project uses a custom QueryBuilder utility. This class simplifies and standardizes complex query operations across multiple routes.

Features
- ✅ **Filtering:** Exclude fields like page, limit, etc., and apply dynamic filters.

- 🔎 **Search:** Perform keyword search across multiple fields.

- ↕️ **Sorting:** Sort results by any field (default: createdAt descending).

- 📝 **Field Selection:** Return only selected fields using the fields query param.

- 📄 **Pagination:** Efficiently paginate results with page and limit parameters.

- 📊 **Metadata:** Returns total count and total pages for admin dashboards.



## 🛠️ Deployment

### Local Development

```bash
npm run dev
```

### Production Deployment

```bash
vercel --prod
```