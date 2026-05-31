#  Live Stock Market Simulator

Welcome to the **Live Stock Market Simulator**—a full-stack virtual stock trading platform designed to let users practice trading, track portfolios, analyze market trends with AI insights, and compete on a live leaderboard. 

This repository contains both the backend server (Node.js/Express) and the frontend application (React/Vite).

---

##  Key Features

- **Real-Time Market Data**: Live stock price updates delivered via WebSockets (Socket.io) integrated with the Finnhub API.
- **Virtual Portfolio Management**: Buy, sell, and track stocks dynamically using mock currency.
- **Leaderboard**: Compete with other virtual traders and check global performance rankings.
- **Social Trading**: Follow other users, view their public profiles, and track their trading moves.
- **AI Insights**: Generate portfolio performance reports and smart trade suggestions.
- **Customizable Price Alerts**: Set trigger alerts for specific stock prices to notify you immediately.
- **Interactive Charts**: Responsive charts powered by Chart.js for analyzing historical price actions.

---

##  Tech Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4, Styled Components
- **State Management**: Zustand, Custom React Contexts (Auth, Socket)
- **Charts**: Chart.js & React-Chartjs-2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

##  Repository Structure

```
live-stock-market-simulator/
├── backend/            # Express Server, Mongoose Models, APIs & Services
│   ├── APIs/           # Express Route Handlers (Auth, User, Stocks, Trading, Admin)
│   ├── middlewares/    # Custom middlewares (JWT Token verification)
│   ├── models/         # MongoDB Schemas (User, Stock, Alert, Portfolio, etc.)
│   ├── services/       # Finnhub Data synchronization and live websocket services
│   ├── package.json    # Backend dependencies & run scripts
│   └── server.js       # Entry point for the Node.js server
│
├── frontend/           # Vite + React Client App
│   ├── public/         # Static assets
│   ├── src/            # Application code
│   │   ├── components/ # Reusable UI components (Dashboard, Stock Cards, Loader)
│   │   ├── contexts/   # React Context providers (Auth, Socket)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Router pages (AI Insights, Leaderboard, Watchlist, etc.)
│   │   ├── services/   # Axios API client setup
│   │   └── App.jsx     # App component & Route setup
│   ├── package.json    # Frontend dependencies & run scripts
│   └── vite.config.js  # Vite configuration
│
└── README.md           # Project overview (this file)
```

---

##  Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a cloud URI via MongoDB Atlas)
- [Finnhub API Key](https://finnhub.io/) (free tier available)

---

### Step 1: Set Up Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and populate it:
   ```env
   DB_URL=mongodb://localhost:27017/LiveStockDB
   SECRET_KEY=your_jwt_secret_key_here
   FINNHUB_API_KEY=your_finnhub_api_key_here
   FRONTEND_URL=http://localhost:5173
   port=5000
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend server should now run on `http://localhost:5000`.

---

### Step 2: Set Up Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder and populate it:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend should now be running on `http://localhost:5173`.

---

##  Sub-Folder Documentation

For more granular details on how the backend or frontend is structured and operated, please check out their respective README files:
- [Backend README](https://github.com/1Manojkumar1/Live-Stock-Market-Simulator/blob/main/backend/README.md)
- [Frontend README](https://github.com/1Manojkumar1/Live-Stock-Market-Simulator/blob/main/frontend/README.md)

---

##  License

This project is licensed under the **ISC License**.
