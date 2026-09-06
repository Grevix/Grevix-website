# 🌌 GREVIX — Official Web Platform

> **Ideas by Students. For a Brighter Tomorrow.**  
> A student-led technology collective, open-source engineering lab, and AI/ML research initiative.

---

## 🚀 Overview

**GREVIX** is a modern, high-performance web platform designed for tech enthusiasts, open-source contributors, and student innovators. Built with a sleek dark-mode cybernetic design system, it delivers real-time telemetry, confidential membership onboarding, flagship event showcases, and complete privacy shielding.

---

## ✨ Key Features & Capabilities

### 🌐 1. Dynamic Client-Side Telemetry & Geolocation
- **Privacy-First Location Coordinates:** Detects the visiting user's real geographic coordinates dynamically using standard browser HTML5 Geolocation (`navigator.geolocation`).
- **Zero Server Exposure:** Coordinates are computed 100% locally inside the visitor's web browser and are **never** transmitted to backend servers, logged, or exposed to intruders.
- **Failover Lookup:** Seamless client-side fallback to public IP geolocation (`get.geojs.io`) if location access is restricted.

### 🛡️ 2. Confidential Local Registration & Data Shielding
- **Encrypted Local Storage:** Form submissions from prospective members are stored locally in `private_data/details.xlsx`.
- **Strict Duplicate Enforcement:** Prevents duplicate entries by validating Email and GitHub profile URLs against existing records before saving.
- **HTTP Shielding Middleware:** Returns strict `404 Not Found` responses to any public attempt to inspect `.xlsx`, `.env`, `private_data/`, `server.js`, or configuration files over HTTP.

### 🎯 3. Flagship Events & Competitions
- **Grevix Aivora (October 2, 2026):** Flagship AI/ML Quiz competition offering top podium achievers direct membership opportunities in the GREVIX core engineering team, social media recognition, and official certificates.

### 👥 4. Executive Leadership & Core Team
- **Leadership Roster:** Features Founder **Aaryan Rawat**, Co-Founder **Apoorv Negi**, President **Baibhab Gusain**, and Core Members **Alok Singh**, **Happy Singh**, and **Pragya Semwal**.

### 📜 5. Legal & Privacy Compliance
- **Comprehensive Guidelines:** 60+ detailed policy directives in `privacy.html` and `terms.html` covering data protection, intellectual property, user rights, and community standards.

---

## 🛠️ Technology Stack

| Layer | Technology / Tools |
| :--- | :--- |
| **Frontend UI** | HTML5, Vanilla CSS3 (Custom Design System, Cybernetic Tokens, Responsive Layouts), JavaScript (ES6+) |
| **Backend API** | Node.js, Express.js |
| **Data Engine** | SheetJS / ExcelJS (`details.xlsx` with route shielding) |
| **Security** | Custom HTTP Shielding Middleware, Input Sanitization, Client-Side Sandbox Geolocation |
| **Design System** | Google Fonts (JetBrains Mono, Archivo Black, Inter), Custom SVG Favicon & Graphic Elements |

---

## 📁 Directory Structure

```text
website/
├── assets/                  # Brand assets, project imagery, blackhole emblems & icons
│   ├── blackhole.png
│   ├── build.jpg
│   ├── contribute.jpg
│   ├── learn.jpg
│   └── favicon.jpg
├── private_data/            # Shielded local data directory (Restricted Access)
│   └── details.xlsx         # Confidential member registrations
├── index.html               # Main Community Landing Page
├── home.html                # Telemetry Hero & Portal Page
├── about.html               # Mission, Vision & Leadership Roster
├── events.html              # Flagship Events & Grevix Aivora Showcase
├── projects.html            # Open Source Systems & Project Hub
├── community.html           # Team Directory & Member Onboarding Form
├── privacy.html            # 60-Guideline Comprehensive Privacy Policy
├── terms.html              # Terms of Service & Code of Conduct
├── styles.css               # Core CSS Design System & Responsive Rules
├── server.js                # Express Server, Form Handler & Security Middleware
├── favicon.jpg              # Blackhole Emblem Favicon
├── favicon.svg              # Scalable Tech SVG Favicon
└── README.md                # Project Documentation
```

---

## 🚦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) installed on your machine.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Grevix/website.git
   cd website
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Production / Local Server:**
   ```bash
   node server.js
   ```

4. **Access the Website:**
   Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 🔒 Security Policy & Data Privacy

- All candidate registration data collected via the join form is saved directly to local storage inside `private_data/details.xlsx`.
- Public access to private data folders or raw Excel files via web request/Inspect Element is automatically blocked by `server.js` HTTP shielding middleware.
- Client location coordinates are processed strictly in-browser and are never recorded or transmitted over network sockets.

---

## 🤝 Community & Contact

- **Organization:** GREVIX Tech Collective  
- **Email:** [teamgrevixorg@gmail.com](mailto:teamgrevixorg@gmail.com)  
- **GitHub:** [https://github.com/Grevix](https://github.com/Grevix)  
- **Discord:** [Join GREVIX Community](https://discord.gg/HMFaCYeYa)

---

&copy; 2026 GREVIX COMMUNITY. Built with purpose. Driven by students.
