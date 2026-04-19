# 🌱 EcoLog – Carbon Footprint Tracker

EcoLog is a simple and intuitive web application that helps users track their daily travel activities and understand their carbon footprint.

Instead of just showing raw numbers, EcoLog translates your actions into meaningful environmental impact — helping you make better, eco-friendly choices.

---

## 🚀 Features

### 🔐 Authentication
- User Sign Up & Login using Firebase Auth
- Protected routes (only logged-in users can access the app)

### 📊 Dashboard
- View your total daily CO₂ emissions
- See all your logged activities
- Edit or delete any entry
- Real-time updates (no refresh needed)

### ➕ Add Activity
Log your travel in a simple way:
- 🚗 Car
- 🚌 Bus
- 🚲 Bike
- Enter distance in kilometers
- Clean, user-friendly UI (no confusing inputs)

### 📈 Analytics
- Visual breakdown of your carbon emissions
- Bar chart showing contribution by transport type
- Highlights your highest emission source

---

## 🧠 How It Works

Each activity is converted into CO₂ emissions using standard emission factors:

| Transport | CO₂ per km |
|-----------|------------|
| 🚗 Car    | 0.21 kg    |
| 🚌 Bus    | 0.10 kg    |
| 🚲 Bike   | 0 kg       |

**Example:**

If you travel:
- Car → 10 km → **2.1 kg CO₂**
- Bus → 12 km → **1.2 kg CO₂**
- Bike → 10 km → **0 kg CO₂** (eco-friendly 🌱)

---

## 🛠️ Tech Stack

| Layer          | Technology              |
|----------------|-------------------------|
| Frontend       | React (Vite)            |
| Routing        | React Router            |
| Database       | Firebase Firestore      |
| Authentication | Firebase Auth           |
| Charts         | Recharts                |
| Styling        | Custom CSS (Eco Minimal UI) |

---

## 📂 Project Structure

```
src/
│
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── AddLog.jsx
│   └── Analytics.jsx
│
├── context/
│   └── AuthContext.js
│
├── services/
│   └── firebase.js
│
├── components/
│   └── ProtectedRoute.jsx
│
├── App.jsx
└── App.css
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/ecolog.git
cd ecolog
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project
3. Enable:
   - Authentication (Email/Password)
   - Firestore Database
4. Add your config in `src/services/firebase.js`

### 4️⃣ Run the app
```bash
npm run dev
```
Open: [http://localhost:5173](http://localhost:5173)

---

## 🎯 Goal of the Project

EcoLog is built to:
- Make carbon tracking simple
- Make sustainability visible
- Encourage eco-friendly habits

---

## 🌍 Future Improvements

- Dark mode 🌙
- Weekly/monthly analytics
- CO₂ reduction goals 🎯
- Gamification (badges, streaks)
- Mobile responsiveness

---

## 💚 Why This Matters

Most people don't realize how daily travel impacts the environment.

EcoLog helps bridge that gap by turning everyday actions into measurable environmental impact.

---

## 👨‍💻 Author

Built with ❤️ as a learning + portfolio project.

---

## ⭐ If you like this project

Give it a star ⭐ and share it!