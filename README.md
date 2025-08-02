# 🛡️ Fraud Detection Dashboard – Next.js + AI

A modern web application built with **Next.js** that connects to a trained fraud detection model to classify banking transactions in real-time. Users can input transaction details and instantly receive predictions with confidence scores.

---

## 📌 Overview

This dashboard visualizes and interacts with a backend ML model (e.g., XGBoost or Autoencoder) that was trained on over 2 million financial transactions. It allows manual input of transaction data and displays whether the transaction is fraudulent or legitimate.

---

## ⚙️ Tech Stack

| Layer         | Technology                      |
|---------------|----------------------------------|
| Frontend      | Next.js 14, React               |
| Styling       | Tailwind CSS                    |
| Visualization | Chart.js, React Plotly          |
| Model Hosting | Flask API / Hugging Face / Vercel Function |
| Backend (optional) | Python (FastAPI / Flask)      |
| Deployment    | Vercel                          |

---

## 🧠 Features

- ✅ Real-time fraud detection (using AI model)
- 🧾 Manual input of transaction features:
  - `cc_num`, `zip`, `city_pop`, `acct_num`, `unix_time`, `amt`
- 📊 Confidence score + explanation
- 🌐 Responsive design (mobile + desktop)
- 📤 Connects to API endpoint: `/api/detect-fraud`

---

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-username/fraud-dashboard.git
cd fraud-dashboard

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
