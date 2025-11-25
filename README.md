# Full-Stack AI Invoice Generator

## Description

The **Full-Stack AI Invoice Generator** streamlines the invoicing workflow for freelancers, small businesses, and finance teams. It supports invoice creation, client management, AI automation for invoice generation, reminder emails, and financial insights.

The system transforms unstructured inputs such as plain text descriptions into structured, ready-to-send invoices using **Gemini AI**.

---

## Features

### AI-Powered Capabilities
- **Invoice Generation:** Converts plain text content into structured invoice data using Google Gemini AI.
- **Payment Reminders:** Automatically generates professional follow-up emails for overdue invoices.
- **Financial Insights:** Provides analytics, summaries, and performance indicators.

### Core Platform Features
- **Create & Manage Invoices:** Full CRUD operations with an intuitive dashboard.
- **Invoice Tracking:** Monitor status such as Paid, Pending, and Unpaid.
- **Analytics Dashboard:** Visual overview of revenue trends, client activity, invoice history, and performance metrics.
- **PDF Export:** Generate print-ready PDF invoices for clients.
- **Responsive UI:** Built with Tailwind CSS for fast, clean, and mobile-friendly design.

---

## Tech Stack

### Frontend
- **React.js** (Vite)
- **Typescript**
- **Tailwind CSS**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **Typescript**
- **Google Gemini AI API**

### Database
- **MongoDB**
- **Mongoose** for schema modeling

## Installation & Setup

Follow the steps below to install and run both the **frontend** and **backend** of the Full-Stack AI Invoice Generator.

---

### Frontend Setup

1. Navigate to the frontend directory:
    ```bash
   cd frontend/invoice-generator
    ```

2. Install frontend dependencies:
    ```bash
    npm install
    ```

3. Create a .env file inside the frontend root directory and add the following variable:
    ```bash
    VITE_BASE_URL="http://localhost:8000"
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

  The frontend will now be running at:
  ```bash
  http://localhost:5173
  ```

### Backend Setup

1. Navigate to the backend directory:
    ```bash
   cd backend
    ```

2. Install backend dependencies:
    ```bash
    npm install
    ```

3. Create a .env file inside the backend root folder and add the following configuration:
    ```bash
    PORT=8000

    # Replace <UserName> and <Password> with your actual MongoDB credentials
    MONGODB_URL="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_IDENTIFIER>.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority"

    # Paste the following command inside terminal to generate a strong JWT secret
    # openssl rand -hex 64
    JWT_SECRET="secure_jwt_secret"

    # Obtain a Gemini API Key from Google AI Studio
    GEMEINI_API_KEY="gemini_key"
    ```

4. Start the backend server:
    ```bash
    npm run dev
    ```

  The backend will now be running at:
  ```bash
  http://localhost:8000
  ```

## Frontend Folder Structure
```bash
frontend/
  └── invoice-generator/
      ├── public/
      ├── src/
      │   ├── assets/
      │   ├── components/
      │   ├── context/
      │   ├── hooks/
      │   ├── pages/
      │   ├── types/
      │   ├── utils/
      │   ├── App.tsx
      │   ├── index.css
      │   └── main.tsx
      ├── .env
      ├── .gitignore
      ├── eslint.config.js
      ├── index.html
      ├── package-lock.json
      ├── package.json
      ├── README.md
      ├── tsconfig.app.json
      ├── tsconfig.json
      ├── tsconfig.node.json
      └── vite.config.ts
```

## Backend Folder Structure
```bash
backend/
  ├── config/
  ├── controllers/
  ├── middlewares/
  ├── models/
  ├── routes/
  ├── .env
  ├── .gitignore
  ├── eslint.config.mts
  ├── package-lock.json
  ├── package.json
  ├── server.ts
  └── tsconfig.json
```

## API Endpoints
A complete Postman collection with request bodies, headers, authentication, and sample responses is available inside backend folder.

#### Postman Collection: 
ai-invoice-generator.postman_collection.json


### Base URL

  ```bash
  http://localhost:8000/api
  ```

  ---

### Auth Routes
| Method | Endpoint         | Description                |
|--------|------------------|----------------------------|
| POST   | /auth/register   | Register a new user        |
| POST   | /auth/login      | Authenticate and get token |
| GET    | /auth/me         | Get logged-in user info    |
| PUT    | /auth/me         | Update user profile        |

---

### Invoice Routes
| Method | Endpoint                | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | /invoices               | Get all invoices                     |
| POST   | /invoices               | Create a new invoice                 |
| GET    | /invoices/:id           | Get invoice by ID                    |
| PUT    | /invoices/:id           | Update invoice                       |
| DELETE | /invoices/:id           | Delete invoice                       |

---

### AI Routes
| Method | Endpoint              | Description                                   |
|--------|-----------------------|-----------------------------------------------|
| POST   | /ai/parse-text        | Generate invoice data from natural language   |
| POST   | /ai/generate-reminder | Generate AI payment reminder email            |
| GET    | /ai/dashboard-summary | Generate financial summary using AI           |
