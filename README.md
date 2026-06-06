# DIH TEMPLATE - Premium Multi-Utility Portal

This project is a high-performance web application built with **React**, **Vite**, **Express**, and **Firebase**.

## 🚀 How to Run in VS Code

Follow these steps to get your project running locally on your computer:

### 1. Prerequisites
- **Node.js** installed (Version 18 or higher recommended)
- **VS Code** installed

### 2. Getting the Code
- Export this project from AI Studio as a **ZIP** or to **GitHub**.
- Open the project folder in VS Code.

### 3. Installation
Open your terminal in VS Code (Ctrl + `) and run:
```bash
npm install
```

### 4. Running the Development Server (Live Preview)
To start the app with live preview, run:
```bash
npm run dev
```
The app will typically start at `http://localhost:3000`. You can now edit any file in the `src` folder and see the changes instantly!

## 🛠 Features
- **HTML Hosting Engine**: Host and preview custom HTML templates.
- **Admin Dashboard**: Full control over users, logs, and site settings.
- **Cinema Experience**: TMDB integration for trending movies and series.
- **Dynamic Tools**: Daily interest calculators, site migration tools, and more.

## 📁 Key Files
- `server.ts`: The backend Express server.
- `src/App.tsx`: Main routing and tool selection.
- `src/components/admin/`: Admin panel components.
- `firebase-applet-config.json`: Your Firebase connection setup.

## 🌐 Production Build
To build the app for production:
```bash
npm run build
npm start
```
