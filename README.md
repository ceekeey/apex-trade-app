<div align="center">

  # 📈 Apex Trade
  ### *Personal Trading Journal & Analytical Discipline Engine*

  <p align="center">
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
    <img src="https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
    <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" />
  </p>

  <p align="center">
    A high-performance mobile trading journal engineered to help traders meticulously log setups, track performance metrics, and foster absolute market discipline.
  </p>

</div>

---

## ✨ Core Features

* **🛡️ Secure Authentication:** Seamless session management backed by token persistence via `expo-secure-store`.
* **📊 Dynamic Analytics Engine:** Real-time performance calculation tracking win rates, profit factors, and trade frequency.
* **📅 Granular Time Filtering:** Filter trade histories instantly by custom months or view comprehensive all-time analytics.
* **📤 CSV Report Export:** Generate, cache, and securely share structured trading data exports directly from your device.
* **👤 Synchronized Profile Management:** Effortlessly update personal credentials, bios, and upload custom avatars with backend multipart synchronization.
* **🌙 Dark-Themed UI:** Built with a distraction-free, high-contrast dark aesthetic optimized for multi-device responsiveness.

---

## 🛠️ Technology Stack

| Category | Technology / Library |
| :--- | :--- |
| **Framework** | React Native / Expo Router |
| **Styling** | NativeWind (Tailwind CSS for React Native) |
| **Icons** | Expo Vector Icons (`@expo/vector-icons`) |
| **State & Storage** | React Context API & `expo-secure-store` |
| **Media & Sharing** | `expo-image-picker`, `expo-file-system`, `expo-sharing` |
| **UI Feedback** | `burnt` (Native Toast Notifications) |

---

## 📁 Project Architecture

```text
apex-trade/
├── app/                  # Expo Router screens & file-based navigation
├── assets/               # Branding icons, splash screens, & images
├── context/              # Global state providers (AuthContext)
├── components/           # Reusable UI widgets & atomic elements
└── app.json              # Expo application manifest configuration