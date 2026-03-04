# Project Structure Documentation

## Complete File Hierarchy

```
AI-Content-Summarizer/
│
├── .github/
│   └── workflows/
│       └── azure.yml                    # GitHub Actions CI/CD workflow for Azure
│
├── backend/                             # Backend utilities & API integration
│   ├── firebase.js                      # Firebase initialization & Firestore
│   └── gemini.js                        # Google Gemini API integration
│
├── public/                              # Static assets (served as-is)
│   └── vite.svg
│
├── src/                                 # React frontend application
│   ├── assets/                          # Images, icons, and media files
│   │
│   ├── components/                      # Reusable React components
│   │   ├── Dashboard.jsx               # Main summarization interface
│   │   ├── History.jsx                 # Summary history/records
│   │   ├── Login.jsx                   # User login form
│   │   └── Register.jsx                # User registration form
│   │
│   ├── styles/                          # Global and component-specific CSS
│   │   ├── Auth.css                    # Login/Register styling
│   │   ├── Dashboard.css               # Dashboard layout & styling
│   │   └── History.css                 # History page styling
│   │
│   ├── App.jsx                         # Main app component with routing
│   ├── main.jsx                        # Vite entry point
│   └── index.css                       # Global styles
│
├── .env                                # Environment variables (NOT in git)
├── .gitignore                          # Git ignore rules
├── AZURE_DEPLOYMENT.md                 # Detailed Azure deployment guide
├── README.md                           # Project overview & quick start
├── eslint.config.js                    # ESLint configuration
├── index.html                          # HTML entry point
├── package.json                        # Dependencies & scripts
├── package-lock.json                   # Dependency lock file
├── staticwebapp.config.json            # Azure Static Web Apps config
└── vite.config.js                      # Vite build configuration
```

## File Descriptions

### Backend Files (`/backend`)

#### `firebase.js`
- Initializes Firebase app with configuration from environment variables
- Exports `auth` (Authentication instance) and `db` (Firestore instance)
- Used by all components that need Firebase services

**Key Exports:**
```javascript
export const auth = getAuth(app);
export const db = getFirestore(app);
```

#### `gemini.js`
- Manages Google Gemini API integration
- Provides `summarizeText()` function for generating summaries
- Provides `refineSummary()` function for modifying summaries (expand/simplify/detail)

**Key Exports:**
```javascript
export async function summarizeText(inputText)
export async function refineSummary(summary, mode)
```

### Frontend Components (`/src/components`)

#### `Login.jsx`
- User authentication form
- Uses Firebase Authentication
- Redirects to dashboard on successful login

#### `Register.jsx`
- New user registration form
- Creates user account in Firebase
- Redirects to login after registration

#### `Dashboard.jsx`
- Main application interface
- Text input area for content to summarize
- Summary output with refinement options
- User profile and logout button
- Saves summaries to Firestore

#### `History.jsx`
- Displays all user's previous summaries
- Fetches from Firestore Firestore with user filter
- Delete functionality for individual summaries
- Responsive list view

### Styling (`/src/styles`)

#### `Auth.css`
- Gradient background for login/register pages
- Form styling with focus states
- Button animations and hover effects

#### `Dashboard.css`
- Two-column layout (input | output)
- Responsive grid design
- Textarea and button styling
- Refinement options layout

#### `History.css`
- Summary list cards with hover effects
- Delete button styling
- Responsive mobile layout
- Back navigation link

### Configuration Files

#### `vite.config.js`
- Vite build configuration
- React plugin setup for HMR (Hot Module Replacement)

#### `eslint.config.js`
- ESLint rules for code quality
- React-specific linting rules

#### `staticwebapp.config.json`
- Azure Static Web Apps configuration
- SPA routing fallback to index.html
- CORS headers setup

#### `.env` (Not committed)
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Workflow Files

#### `.github/workflows/azure.yml`
- GitHub Actions workflow
- Triggers on push to `main` branch
- Steps:
  1. Checkout code
  2. Setup Node.js 18
  3. Install dependencies
  4. Build application
  5. Deploy to Azure Static Web Apps

## Import Paths Reference

### From Components to Backend
```javascript
// In /src/components/Dashboard.jsx
import { summarizeText } from "../../backend/gemini";
import { db, auth } from "../../backend/firebase";
```

### From App to Components
```javascript
// In /src/App.jsx
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import { auth } from "../backend/firebase";
```

### CSS Imports
```javascript
// In /src/components/Dashboard.jsx
import "../styles/Dashboard.css";
```

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:5173)
npm run build            # Build for production
npm run lint             # Run linting
```

### Git Workflow
```bash
git add .
git commit -m "Updated project structure"
git push origin main     # Triggers Azure deployment
```

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.0 | UI framework |
| react-dom | ^19.2.0 | React DOM rendering |
| react-router-dom | ^7.13.1 | Client-side routing |
| firebase | ^12.10.0 | Auth & Firestore |
| @google/generative-ai | ^0.24.1 | Gemini API |
| vite | ^7.3.1 | Build tool |

## Firebase Firestore Structure

### Collection: `summaries`
```javascript
{
  id: "document-id",
  userId: "firebase-user-id",
  input: "Original text content",
  summary: "Generated summary",
  createdAt: Timestamp
}
```

## Azure Static Web Apps Configuration

- **Hosting**: Azure Static Web Apps Free Tier
- **Build Preset**: React
- **App Location**: `/`
- **Output Location**: `dist/`
- **Runtime**: Node.js 18+

## Security Notes

⚠️ **Important Security Practices:**

1. Never commit `.env` file
2. Environment variables are handled via GitHub Secrets
3. Firestore has security rules (see AZURE_DEPLOYMENT.md)
4. Firebase credentials are safe in `.env` when properly gitignored
5. Gemini API key should be restricted to your domain in production

## Production Checklist

- [ ] All environment variables configured
- [ ] Firebase security rules updated
- [ ] HTTPS enabled (automatic on Azure)
- [ ] Custom domain configured
- [ ] Monitoring enabled in Azure Portal
- [ ] Error logging configured
- [ ] Performance optimizations applied

## Performance Metrics

- **Bundle Size**: ~597 KB (before gzip)
- **Gzipped Size**: ~187 KB
- **Build Time**: ~3.76s
- **Module Count**: 67 modules

## Troubleshooting Guide

See individual sections in:
- [README.md](README.md) - Quick start and features
- [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md) - Deployment and troubleshooting
