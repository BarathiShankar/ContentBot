# AI Content Summarizer

A powerful web application that uses **Google's Gemini AI** to summarize content, with **Firebase** backend and **Azure** deployment support.

## 🚀 Features

- **Text Summarization**: Use Gemini 2.5 Flash to summarize any text into bullet points
- **Summary Refinement**: Expand, simplify, or add more detail to your summaries
- **User Authentication**: Secure login/registration with Firebase Authentication
- **Cloud Storage**: Save and retrieve your summaries from Firestore
- **History Tracking**: Keep a history of all your summaries
- **Responsive Design**: Works smoothly on desktop and mobile devices
- **Azure Deployment**: CI/CD ready for Azure Static Web Apps

## 📁 Project Structure

```
AI-Content-Summarizer/
├── .github/
│   └── workflows/
│       └── azure.yml          # CI/CD workflow for Azure deployment
├── public/                    # Static assets
├── src/                       # React frontend code
│   ├── assets/                # Images and icons
│   ├── components/            # React components
│   │   ├── Dashboard.jsx
│   │   ├── History.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── styles/                # CSS stylesheets
│   │   ├── Auth.css
│   │   ├── Dashboard.css
│   │   └── History.css
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── backend/                   # Backend utilities
│   ├── firebase.js            # Firebase configuration
│   └── gemini.js              # Gemini API integration
├── .env                       # Environment variables (not in git)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── staticwebapp.config.json   # Azure Static Web Apps config
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js 16+ and npm
- Firebase project setup
- Google AI Studio account (for Gemini API key)
- Azure account (for deployment)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd AI-Content-Summarizer/AI-Content-Sumarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root with:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## 🚀 Deployment to Azure

### Option 1: Using Azure Static Web Apps (Recommended)

1. **Create an Azure Static Web Apps resource**
   - Go to Azure Portal → Create Resource → Static Web App
   - Select your GitHub repository
   - Configure build details:
     - Build Presets: React
     - App location: `/`
     - API location: `api`
     - Output location: `dist`

2. **Add GitHub Secrets**
   In your GitHub repository, add these secrets:
   - `AZURE_RESOURCE_GROUP`: Your Azure resource group name
   - `AZURE_APP_NAME`: Your Azure app name
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Your SWA deployment token

3. **Deploy**
   Push to the `main` branch, and the GitHub Actions workflow will automatically deploy.

### Option 2: Using Azure App Service

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy using Azure CLI**
   ```bash
   az webapp deployment source config-zip --resource-group <resource-group> --name <app-name> --src dist.zip
   ```

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database (in test mode for development)
5. Copy your Firebase config and add to `.env`

## 🤖 Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Add to `.env` as `VITE_GEMINI_API_KEY`

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview built app
npm run lint     # Run ESLint
```

## 🎨 Technologies Used

- **Frontend**: React 19, React Router DOM
- **AI**: Google Gemini API (2.5 Flash)
- **Backend**: Firebase (Authentication & Firestore)
- **Build Tool**: Vite
- **Deployment**: Azure Static Web Apps

## 📄 Environment Variables

All environment variables should be defined in a `.env` file at the project root:

```env
# Gemini API
VITE_GEMINI_API_KEY=your_key_here

# Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**⚠️ Never commit `.env` to version control!**

## 🐛 Troubleshooting

### API Key Errors
- Ensure your `.env` file is in the project root (same level as `vite.config.js`)
- Restart the dev server after changing `.env`

### Firebase Errors
- Check Firestore security rules allow read/write
- Verify Firebase credentials in `.env`

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

## 📞 Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include error logs and environment info

## 📜 License

This project is licensed under MIT License.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---

**Made with ❤️ using Gemini, Firebase, and Azure**
