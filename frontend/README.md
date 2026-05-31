#  Live Stock Market Simulator - Frontend Client

This is the frontend client application for the **Live Stock Market Simulator**. It is built on React 19 using Vite as a bundler, styled with Tailwind CSS v4, and connects dynamically to the backend APIs and WebSockets.

---

##  Features

- **Responsive Trading Dashboard**: Real-time visualization of assets, portfolio distribution, cash balance, and personal profit/loss calculations.
- **Live Watching Lists**: Interactive cards representing active stocks showing daily price shifts with visual cues (green for gains, red for losses).
- **Interactive Price Graphs**: Detailed price chart visualizations using Chart.js to examine historical stock performances.
- **Traders Leaderboard**: Ranks and compares users dynamically based on net assets, with follower count displays.
- **Social Feed & Profiles**: Clean public profiles for traders, including transaction timelines and direct follow/unfollow action handlers.
- **AI-Powered Portfolio Analysis**: Generates AI insights on diversification, asset distribution, and risk factor reports.
- **Alert Systems**: Setting thresholds that notify the user in-app when stock values meet triggers.
- **Persistent Sessions**: Custom route guards that verify user logins and handle page refreshes seamlessly via secure, credential-aware cookie contexts.

---

##  Folder Structure

```
frontend/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Images, SVGs, and media
│   │
│   ├── components/         # Reusable React components
│   │   ├── Admin/          # Admin-specific modules
│   │   ├── Auth/           # Auth forms (Login/Register inputs)
│   │   ├── dashboard/      # Holdings summary, statistics charts, and activity feeds
│   │   ├── layout/         # Sidebar, Navbar, and application container templates
│   │   ├── stocks/         # Watchlist elements, detailed info models
│   │   ├── trading/        # Buy/Sell form triggers and transaction inputs
│   │   ├── Loader.jsx      # Premium spinner and animation templates
│   │   └── ProtectedRoute.jsx # Route protector verifying login state
│   │
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.jsx # Handles session persistence, tokens, and current user profile state
│   │   └── SocketContext.jsx# Establishes WebSocket client connections for real-time stock feeds
│   │
│   ├── hooks/              # Custom React Hooks
│   ├── services/           # Network layer
│   │   └── api.js          # Shared Axios configuration (withCredentials enabled)
│   │
│   ├── pages/              # Main router views
│   │   ├── AIInsights.jsx  # AI-driven portfolio suggestion engine
│   │   ├── Admin.jsx       # Admin dashboard for parameter settings
│   │   ├── Dashboard.jsx   # Trader portfolio, balance charts, and history logs
│   │   ├── Home.jsx        # Landing page
│   │   ├── Leaderboard.jsx # Rankings board of active traders
│   │   ├── Login.jsx       # User authentication entry point
│   │   ├── Market.jsx      # Explore all available stocks
│   │   ├── NotificationsPage.jsx # Triggered alerts list
│   │   ├── PublicProfile.jsx # Profiles of other platform traders
│   │   ├── Register.jsx    # Create accounts
│   │   └── Watchlist.jsx   # Real-time stock monitor page
│   │
│   ├── App.jsx             # React Router routing setup
│   ├── index.css           # Global custom stylesheet, Tailwind CSS directives
│   └── main.jsx            # Entry point rendering the React App inside DOM
│
├── vercel.json             # Vercel deployment configurations for SPA routing rules
├── vite.config.js          # Vite configuration options
└── package.json            # Frontend dependency and client scripts
```

---

##  Setup & Run Instructions

### Prerequisites
- Node.js (v16+)
- A running backend server (see the backend README for instructions)

---

### Installation & Run Steps

1. In the `frontend` folder, create a `.env` file pointing to your backend:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
2. Install local package dependencies:
   ```bash
   npm install
   ```
3. Run in Development Mode:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Build for Production:
   ```bash
   npm run build
   ```
   The production bundle is compiled into the `dist` directory.

---

##  Styles & Design Guidelines
- **Tailwind CSS v4**: Utility-first CSS classes for clean, responsive, and state-of-the-art designs.
- **Lucide React**: Vector icons used consistently across components.
- **Chart.js**: Render line graphs and doughnut charts representing asset allocations dynamically.
