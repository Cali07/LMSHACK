# Give & Get Hunger Hack Platform

Give & Get is a mobile-first web platform designed for the **KFC Add Hope Biggest Hunger Hack**.  
It connects **users, donors, partner companies, and KFC distribution centers** in a unified system to fight child hunger in South Africa through **discount-driven donations, real-time transparency, AI-driven hunger prediction, and route optimization for meal delivery**.

---

## 🌍 Vision
*"Get discounts, feed children, and see the impact in real-time."*

Users claim **discount codes** from partner companies. Before receiving their code, they are **optionally prompted to donate** to feed a child through KFC Add Hope.  
Donors and investors then **see exactly how their funds are used**, with:
- **Real-time dashboards** showing meals delivered.
- **Impact videos** from communities.
- **AI-powered hunger hotspot maps** predicting areas at risk.

Meanwhile, KFC centers use the **admin portal** to:
- Report daily meal distribution data.
- Manage funds and donations.
- Use **AI route optimization** to deliver meals faster and more efficiently.

---

## ✨ Features

### **Public Website**
- Browse **partner discounts**.
- **Claim discount codes** with optional donation.
- **Impact dashboard**:
    - Total meals delivered today/month/year.
    - KFC contributions and partner matches.
    - Short 30-second community impact videos.
- **AI Hunger Hotspot Map**:
    - Current hunger crisis regions.
    - Predictions of future high-risk areas.

---

### **Admin Portal (KFC Centers)**
- **Daily Reporting:**
    - Meals served.
    - Children fed.
    - Shortages and photo/video uploads.
    - Works **offline-first** and syncs later.
- **Funds Dashboard:**
    - Tracks donation balances and approvals for field operations.
- **AI Route Optimization:**
    - Inputs: vehicle availability, warehouse stock, feeding center locations, and AI hotspot data.
    - Outputs: optimized delivery routes with priority areas highlighted.
- **Report Verification & Export:**
    - Approve or flag reports.
    - Export analytics for donors and government.

---

### **Partner Management**
- Businesses can:
    - Add discount codes to the system.
    - Run donation-matching campaigns (*e.g., “1 meal donated for every code claimed”*).
    - View analytics: impressions, claims, and donations driven by their codes.

---

## 🧠 AI Hunger Prediction
The platform uses AI to **predict hunger hotspots** by combining:
- KFC center reports (meal counts, shortages).
- Weather and drought data.
- Food price trends.
- School attendance and population data.

**MVP:** rule-based scoring to flag critical areas.  
**Future:** machine learning models for more accurate predictions.

---

## 🏗 Tech Stack

| **Layer**        | **Technology**           |
|-------------------|--------------------------|
| Frontend          | Nuxt 3 (Vue), Vuetify    |
| Backend           | Node.js            |
| AI Microservice   | Python + FastAPI         |
| Database          | Supabase               |
| Storage           | Supabase / Cloudinary    |
| Maps & Routing    | Google Maps API / OR-Tools |
| Payments          | Stripe / PayU / SnapScan |
| Hosting           | Netify (Frontend)        |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The app will start on [http://localhost:3000](http://localhost:3000) by default. Update environment variables in `.env` if you
need to connect to external APIs or services.

---

## ⚙️ Architecture

