# 🌿 EcoFeast - AI Food Redistribution Platform

**Reduce food waste by predicting surplus and redistributing it to those in need using AI-driven insights.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.8-blue)](https://www.python.org)

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [AI Module](#ai-module)
- [Contributing](#contributing)
- [License](#license)

---

## 💡 Problem Statement

Every year, **one-third of food produced globally is wasted**, while millions face food insecurity. Restaurants, groceries, and food businesses struggle to:

- Predict food waste accurately
- Manage surplus inventory efficiently
- Find safe, reliable redistribution channels
- Track donations and impact

---

## ✅ Solution

**EcoFeast** connects food donors, volunteers, and NGOs on a single platform powered by AI:

- **Predict** food waste using machine learning models
- **Match** surplus food with those in need in real-time
- **Track** donations from pickup to delivery
- **Visualize** impact through interactive dashboards
- **Coordinate** between stakeholders with role-based access

---

## 🎯 Features

### For Donors (Restaurants, Groceries, Caterers)

- ✅ Register and list available food items
- ✅ Set pickup time and location
- ✅ Track donation status in real-time
- ✅ AI-powered waste prediction insights
- ✅ Impact statistics and reporting

### For Volunteers

- ✅ Browse available food donations
- ✅ Accept delivery assignments
- ✅ Track delivery progress
- ✅ Mark deliveries as complete
- ✅ View mapped locations with Leaflet integration

### For NGOs

- ✅ Monitor all donations and deliveries
- ✅ Manage volunteer network
- ✅ Generate impact reports
- ✅ Analytics dashboard with Recharts visualizations

### Platform Features

- 🤖 **AI Waste Prediction**: Machine learning model predicts food waste based on historical data
- 📍 **Geo-mapping**: Interactive map shows donation locations and delivery routes
- 📊 **Analytics Dashboard**: Real-time charts and statistics
- 🔐 **Secure Authentication**: Role-based access control
- 💾 **SQLite Database**: Efficient local data storage
- ⚡ **Fast & Responsive**: Built with React 19 and Tailwind CSS

---

## 🛠 Tech Stack

| Layer                | Technology                               |
| -------------------- | ---------------------------------------- |
| **Frontend**         | React 19, TypeScript, Tailwind CSS, Vite |
| **Backend**          | Express.js, Node.js                      |
| **Database**         | SQLite, better-sqlite3                   |
| **AI/ML**            | Python, scikit-learn, pandas             |
| **UI Components**    | Lucide React, Recharts, Leaflet, Motion  |
| **State Management** | Zustand                                  |
| **Build Tool**       | Vite, tsx                                |

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org))
- **npm** >= 9.0.0 (comes with Node.js)
- **Python** >= 3.8 ([Download](https://www.python.org))
- **Git** ([Download](https://git-scm.com))

Optional:

- Postman or similar tool for API testing

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ecofeast.git
cd ecofeast
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Install Python Dependencies

```bash
cd ai_module
pip install pandas scikit-learn
cd ..
```

### 4. Initialize Database

The database will auto-initialize when the server starts, but you can manually set it up:

```bash
sqlite3 food_waste.db < database/schema.sql
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# App Configuration
APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_PATH=./food_waste.db

# AI/ML (if using Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Port
PORT=3000
```

### Database Schema

The platform uses three main tables:

| Table             | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `users`           | User accounts (Donors, Volunteers, NGOs) |
| `donations`       | Food donation listings                   |
| `deliveries`      | Delivery tracking                        |
| `food_waste_data` | Historical data for ML training          |

See [database/schema.sql](database/schema.sql) for complete schema.

---

## 📖 Running the Project

### Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:3000`

- **Frontend**: Auto-reloads on file changes (Hot Module Reload enabled)
- **Backend**: Express server handles API requests

### Build for Production

```bash
npm run build
```

Outputs optimized bundle to `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run lint
```

Validates TypeScript without emitting files.

### Clean Build

```bash
npm run clean
```

Removes the `dist/` folder.

---

## 📁 Project Structure

```
ecofeast/
├── src/                          # React Frontend
│   ├── App.tsx                   # Main app component
│   ├── Landing.tsx               # Landing page
│   ├── Auth.tsx                  # Login/Signup
│   ├── Dashboard.tsx             # Main dashboard
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles
│   ├── store.ts                  # Zustand state management
│   └── db.ts                     # Database utilities
│
├── ai_module/                    # Python ML Module
│   └── waste_prediction.py       # Linear regression model
│
├── database/                     # Database Configuration
│   └── schema.sql                # SQLite schema
│
├── sampledataset/                # Sample Data
│   └── food_waste_dataset.csv    # Historical training data
│
├── server.ts                     # Express backend
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # npm dependencies
├── index.html                    # HTML entry point
└── README.md                     # This file
```

---

## 💾 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Donor', 'Volunteer', 'NGO') NOT NULL
);
```

### Donations Table

```sql
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    donor_name VARCHAR(255) NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    pickup_time DATETIME NOT NULL,
    status ENUM('Available', 'Accepted', 'Cancelled', 'Delivered'),
    lat FLOAT,
    lng FLOAT,
    FOREIGN KEY (donor_id) REFERENCES users(id)
);
```

### Deliveries Table

```sql
CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    volunteer_id INT,
    delivery_status ENUM('Accepted', 'Out for Delivery', 'Delivered'),
    FOREIGN KEY (donation_id) REFERENCES donations(id),
    FOREIGN KEY (volunteer_id) REFERENCES users(id)
);
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint      | Description       | Body                            |
| ------ | ------------- | ----------------- | ------------------------------- |
| POST   | `/api/signup` | Register new user | `{name, email, password, role}` |
| POST   | `/api/login`  | Login user        | `{email, password}`             |

### Donations

| Method | Endpoint                    | Description                 |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/donations`            | Create donation listing     |
| GET    | `/api/donations`            | Get all available donations |
| PATCH  | `/api/donations/:id/status` | Update donation status      |

See [server.ts](server.ts) for complete endpoint implementations.

---

## 🤖 AI Module

### Waste Prediction Model

The AI module uses **Linear Regression** to predict food waste based on:

- **Features**: Amount of food prepared
- **Target**: Food waste quantity
- **Data Source**: Historical donation data

### Usage

```python
from ai_module.waste_prediction import predict_waste

prediction = predict_waste()
# Returns forecasted waste for next day
```

### Training Data

Historical data located in `sampledataset/food_waste_dataset.csv` is used to train the model.

---

## 🔐 Security Notes

⚠️ **For Development Only**: Current implementation uses plain-text passwords. For production:

- [ ] Implement bcrypt or Argon2 for password hashing
- [ ] Use JWT tokens for authentication
- [ ] Add HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Use environment-based secrets management

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style

- Use TypeScript for all frontend/backend code
- Follow existing formatting (use Prettier)
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🙋 Support & Questions

- **Issues**: Open an issue on GitHub for bug reports
- **Discussions**: Use GitHub Discussions for feature requests
- **Email**: contact@ecofeast.example.com (update with your email)

---

## 🌟 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Maps powered by [Leaflet](https://leafletjs.com/)
- State management with [Zustand](https://github.com/pmndrs/zustand)
- AI powered by scikit-learn

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced ML models (neural networks)
- [ ] Blockchain for donation verification
- [ ] Integration with food logistics APIs
- [ ] Multi-language support
- [ ] Carbon footprint calculation
- [ ] Gamification and rewards system

---

**Made with ❤️ for a sustainable future.**
