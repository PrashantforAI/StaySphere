
# StaySphere AI - AI-Powered Vacation Rental Marketplace

StaySphere AI is a modern, scalable, full-stack vacation rental platform for the Indian market, designed with a multi-role architecture supporting guests, hosts, service providers, and admins. It features a unique three-panel UI with an integrated AI assistant powered by Google Gemini.

## Core Features

- **Role-Based Access Control:** Separate experiences for Guests, Hosts, Service Providers, and Admins.
- **AI-Powered Chat:** A persistent AI assistant to help users with bookings, queries, and recommendations.
- **Three-Panel Layout:** A desktop-first design for power users, providing easy navigation and multitasking.
- **Mobile Responsive:** A seamless experience on mobile devices with a dedicated layout.
- **Firebase Integration:** Leverages Firebase for Authentication, Firestore database, and Storage.
- **Scalable Architecture:** Built with a clean, modular structure using React and TypeScript.
- **Future-Ready:** Stubs and preparation for payment gateways (Razorpay) and iCal sync.

## Tech Stack

- **Frontend:** React 18 (TypeScript), Tailwind CSS
- **Backend Services:** Firebase (Firestore, Authentication, Storage)
- **AI:** Google Gemini API
- **Routing:** React Router (HashRouter)

---

## Firebase Setup Instructions

This project requires a Firebase project to handle authentication, database, and storage.

### 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the on-screen instructions to create a new project. Give it a name like "StaySphereAI".

### 2. Register Your Web App

1.  In your new project's dashboard, click the Web icon (`</>`) to add a new web app.
2.  Enter an app nickname (e.g., "StaySphere AI Web").
3.  Click **"Register app"**. You do NOT need to add the Firebase SDK scripts to your HTML, as we handle it in the code.
4.  Firebase will provide you with a `firebaseConfig` object. **Copy these credentials.**

### 3. Set Up Authentication

1.  In the Firebase Console, go to **Build > Authentication**.
2.  Click **"Get started"**.
3.  Under the **"Sign-in method"** tab, enable the following providers:
    -   **Email/Password**
    -   **Phone**

### 4. Set Up Firestore Database

1.  Go to **Build > Firestore Database**.
2.  Click **"Create database"**.
3.  Start in **Test mode** for initial development. This allows open read/write access.
    *   **IMPORTANT:** For production, you **MUST** configure [Security Rules](https.firebase.google.com/docs/firestore/security/get-started) to protect your data.
4.  Choose a location for your database (e.g., `asia-south1`).
5.  Click **"Enable"**.

### 5. Configure Environment Variables

This application expects your Firebase config to be available as environment variables.

1.  In the root of your project, create a file named `.env` (this is ignored by Git).
2.  Paste your copied `firebaseConfig` object into this file, formatting it as follows:

```
# .env file

REACT_APP_FIREBASE_API_KEY="AIzaSy..."
REACT_APP_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
REACT_APP_FIREBASE_PROJECT_ID="your-project-id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="1234567890"
REACT_APP_FIREBASE_APP_ID="1:1234567890:web:..."

# Add your Gemini API Key here
REACT_APP_GEMINI_API_KEY="your-gemini-api-key"
```

**Note:** The application code is set up to read these `REACT_APP_` variables. In a real build setup (like Create React App), these are automatically embedded. In this environment, we simulate it.

---

## Local Development

### Prerequisites

-   Node.js and npm (or yarn)

### Running the App

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Development Server:**
    ```bash
    npm start
    ```
3.  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.
