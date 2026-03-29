<div align="center">

<img src="public/MoneyFLow_Logo.png" alt="MoneyFlow Logo" width="80" />

# MoneyFlow

**A desktop-first personal finance manager built with Tauri and React.**

Track income, expenses, and savings goals — all offline, all yours.

[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](https://github.com/SanujaMenath/moneyflow/releases)
[![Status](https://img.shields.io/badge/status-in%20development-orange?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri-24C8D8?style=flat-square&logo=tauri&logoColor=white)](https://tauri.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)

</div>

---

## Overview

MoneyFlow is a lightweight, offline-first finance tracker designed for people who want full control over their money without relying on cloud services or subscriptions. Built as a native desktop application using Tauri, it combines the performance of a Rust backend with a modern React frontend.

> **v1.0.0** — Initial release. Core tracking, dashboard analytics, and recurring transactions are live.

---

## Features

- **Income & Expense Tracking** — Log transactions with categories, dates, and amounts
- **Recurring Transactions** — Set weekly, monthly, or yearly recurring entries
- **Financial Dashboard** — Visual overview of balance, income/expense ratio, and spending trends
- **Savings Goal** — Set a target savings percentage and track progress against your income
- **Analytics Page** — Category breakdowns and seasonal spending trend charts
- **Multi-Currency Support** — Switch between LKR, USD, EUR, GBP, and more from Settings
- **Offline-First** — No account required, no internet needed, your data stays local

---

## Screenshots

> Coming soon — screenshots will be added after v1.0.0 UI is finalised.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | [Tauri](https://tauri.app) (Rust) |
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Storage | localStorage (v1.0) · SQLite (planned) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- [Rust](https://rustup.rs) (stable toolchain)
- [Tauri CLI prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) for your OS

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/SanujaMenath/moneyflow.git
cd moneyflow

# 2. Install dependencies
npm install

# 3. Run in development mode
npm run tauri dev
```

### Build for production
```bash
npm run tauri build
```

The compiled installer will be output to `src-tauri/target/release/bundle/`.

---

## Project Structure
```
moneyflow/
├── public/                  # Static assets (logo, favicon)
├── src/
│   ├── context/             # React context (Currency, SavingsGoal)
│   ├── features/
│   │   ├── dashboard/       # Dashboard view and components
│   │   ├── transactions/    # Transactions page, form, hooks
│   │   ├── analytics/       # Analytics charts and insights
│   │   └── settings/        # Settings page
│   ├── layout/              # MainLayout, sidebar
│   └── types/               # TypeScript type definitions
└── src-tauri/               # Rust backend (Tauri)
```

---

## Roadmap

- [x] Transaction tracking (income & expense)
- [x] Recurring transactions
- [x] Dashboard with insights
- [x] Multi-currency support
- [x] Savings goal tracking
- [ ] SQLite persistence
- [ ] Data export (CSV / PDF)
- [ ] Loan and interest tracker
- [ ] Mobile sync

---

## Contributing

Contributions are welcome. If you find a bug or have a feature suggestion, please [open an issue](https://github.com/SanujaMenath/moneyflow/issues) first before submitting a pull request.
```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## License

MIT © 2026 [Sanuja Menath](https://github.com/SanujaMenath)

---

<div align="center">
  <sub>MoneyFlow · Built with care by Sanuja Menath</sub>
</div>