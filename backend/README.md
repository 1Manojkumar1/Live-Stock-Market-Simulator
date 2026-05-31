#  Live Stock Market Simulator - Backend Server

This is the backend server for the **Live Stock Market Simulator**. It is built with Node.js, Express.js, MongoDB (Mongoose), and Socket.io to support real-time communication and virtual trading.

---

##  Features

- **JWT-Based Authentication**: Registration, Login, Logout, and Token validation with secure HTTP-only cookies.
- **Mongoose Data Models**: Clean, validated schema structures for Users, Stocks, Transactions, Portfolios, Alerts, Followers, and Global Settings.
- **Real-Time Market Syncing**: Dynamically fetches live stock pricing from the Finnhub API and pushes real-time price updates to connected web clients via WebSockets (`Socket.io`).
- **Trading Engine**: Validates transaction rules (e.g., verifying if the user has enough cash balance for buying or sufficient shares for selling).
- **Price Alerts Trigger**: Monitors live stock prices against user-defined price alert thresholds and issues in-app notifications when conditions are met.
- **REST Client Configs**: Includes `.http` files for rapid API testing.

---

##  Folder Structure

```
backend/
├── APIs/                   # Express routes & request handlers
│   ├── adminRoutes.js      # Global settings, system state, initial balance configurations
│   ├── authRoutes.js       # Register, login, session validation, logout
│   ├── stockRoutes.js      # Stock list, query details, search, historical data
│   ├── transactionRoutes.js# Trade logs and history
│   └── userRoutes.js       # Watchlists, portfolios, price alerts, follow/unfollow, notifications
│
├── middlewares/            # Custom express middlewares
│   └── verifyToken.js      # JWT authentication guard for protected routes
│
├── models/                 # Mongoose schemas & MongoDB interfaces
│   ├── alertModel.js       # Set target price alerts (ABOVE or BELOW)
│   ├── follow.js           # Follow/unfollow relations between users
│   ├── notification.js     # User alert and system notifications
│   ├── portfolio.js        # Tracks user holdings (symbol, qty, avgBuyPrice)
│   ├── Settings.js         # Global admin configurations (e.g., default initial balance)
│   ├── stock.js            # Cached stock information & current price
│   ├── transaction.js      # Logs of buy/sell events (type, qty, price, symbol)
│   └── userModel.js        # User details, hashed passwords, cash balances
│
├── services/               # Background helper processes
│   └── marketSync.js       # Finnhub API fetcher & Socket.io broadcast manager
│
├── req-*.http              # API Testing configuration files for REST clients
├── package.json            # Node project configuration
└── server.js               # Entry point, database connector, middleware setup, socket initialize
```

---

##  API Endpoints

###  Auth Routes (`/APIs/authRoutes.js`)
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticates user and sets HTTP-only JWT token.
- `POST /api/auth/logout` - Clears the authentication token cookie.
- `GET /api/auth/verify` - Validates the active session and returns user metadata.
- `PUT /api/auth/profile` - Update user information.

###  User & Portfolio Routes (`/APIs/userRoutes.js`)
- `GET /api/user/profile/:id` - Fetch details of a public user profile.
- `GET /api/user/portfolio` - Fetch the authenticated user's portfolio and balance.
- `GET /api/user/dashboard` - Get consolidated portfolio valuation and cash statistics.
- `POST /api/user/follow` / `POST /api/user/unfollow` - Connect with other traders.
- `GET /api/user/feed` - Get custom activity logs of people you follow.
- `GET /api/user/notifications` - Retrieve in-app notifications.
- `POST /api/user/alerts` - Create a custom price alert.
- `DELETE /api/user/alerts/:id` - Remove a price alert.

###  Stock & Trading Routes (`/APIs/stockRoutes.js`)
- `GET /api/stocks` - Get list of tracked stocks with current prices.
- `GET /api/stocks/search` - Look up a stock ticker/symbol.
- `GET /api/stocks/history/:symbol` - Retrieve historical price intervals (for chart plotting).
- `POST /api/stocks/trade` - Execute virtual `BUY` or `SELL` orders.

###  Leaderboard & Stats
- Routes nested under `/APIs/userRoutes.js` aggregate user rankings based on their total portfolio value (cash balance + net stock asset value).

###  Admin Routes (`/APIs/adminRoutes.js`)
- `GET /api/admin/settings` - Fetch global settings (like initial balance).
- `PUT /api/admin/settings` - Update global settings.
- `GET /api/admin/users` - Get stats on registered users.

---

##  Setup & Installation

1. Make sure MongoDB is running on your local machine or copy your MongoDB Atlas Connection String.
2. In the `backend` folder, create a `.env` file with:
   ```env
   DB_URL=mongodb://localhost:27017/LiveStockDB
   SECRET_KEY=generate_a_secure_random_string_here
   FINNHUB_API_KEY=your_finnhub_key_from_finnhub_io
   FRONTEND_URL=http://localhost:5173
   port=5000
   ```
3. Run installation:
   ```bash
   npm install
   ```
4. Start Server:
   ```bash
   npm start
   ```

---

##  WebSockets (Socket.io)
When the backend starts, it spins up a Socket.io server alongside the Express server.
- The `marketSync` service fetches current prices from Finnhub at set intervals and broadcasts them on the `stock-updates` channel.
- Clients can listen to `stock-updates` to receive real-time changes to the stock watchlist and portfolio value.
