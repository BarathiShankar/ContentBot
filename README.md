# Smart Content Summarizer 📝⚡

A **summary tracker for shrinking/expanding notes** that helps students convert their study material into points, essays or stories.  
This React + Firebase web application uses the Gemini API to power the summarization and refinement logic.  Users can log in, create summaries, refine them in several modes, and view a history of past results with timestamps.

---

## 🚀 Features
- **AI‑powered summarization**: Convert text into bulleted points, essays, or stories using Gemini.
- **Refinement modes**: Shrink, expand, simplify or add detail with a single click.
- **History tracker**: All outputs are stored per user in Firestore, complete with date‑time stamps.
- **Authentication**: Email/password login and registration via Firebase.
- **Student‑friendly UI**: Simple dashboard, history page, and navigation for study workflows.

---

## 🛠️ Tech Stack
- **Frontend**: React, React Router, React Markdown
- **Backend**: Firebase (Auth + Firestore)
- **AI Integration**: Custom Gemini API functions (`summarizeText`, `refineSummary`)
- **Styling**: CSS animations, black + orange theme



## ⚙️ Setup & Usage

1. **Clone the repository**
  ```bash
  git clone https://github.com/BarathiShankar/smart-content-summarizer.git
  cd AI-Content-Sumarizer
  ```

2. **Install dependencies**
  ```bash
  npm install
  ```

3. **Configure Firebase**
  - Create a Firebase project and enable Email/Password authentication.
  - Add a Firestore database (start in test mode for development).
  - Copy the config object into `Backend/firebase.js`.

4. **Set up Gemini API key**
  - Obtain a key from the Gemini (or Google Bard) service.
  - Add it to a `.env` file as `VITE_GEMINI_API_KEY=<your_key>`.

5. **Start development server**
  ```bash
  npm run dev
  ```
  Open the URL shown in the terminal (usually http://localhost:5173).

6. **Use the app**
  - Register/login with email and password.
  - Enter or paste text on the dashboard and click **Summarize**.
  - Optionally press **Expand**, **Simplify**, or **Write As Essay** to refine.
  - Click **History** to view previously generated entries plus timestamps.

## 💡 Gemini API Integration

All AI calls are centralized in `Backend/gemini.js`. It exports:
```js
export const summarizeText = async (input) => { ... };
export const refineSummary = async (text, mode) => { ... };
```
`mode` accepts `"expand"`, `"simplify"`, or `"detail"`. The functions send prompts to Gemini using the environment API key and return plain text.

The frontend components in `Dashboard.jsx` invoke these functions and update the UI. Summaries are also saved to Firestore with a `createdAt` timestamp for history tracking.

## 🔧 Project Structure
```
AI-Content-Sumarizer/
├── Backend/            # Firebase & Gemini integration
│   ├── firebase.js     # Firestore and auth setup
│   └── gemini.js       # Wrapper around Gemini API calls
├── public/             # Static assets
├── src/
│   ├── App.jsx         # Router and main component
│   ├── Dashboard.jsx   # Main UI with summarizer
│   ├── history.jsx     # Shows past summaries
│   ├── Login.jsx       # User login
│   ├── Register.jsx    # User registration
│   └── assets/         # Icons/images
├── package.json
└── vite.config.js
```

## 📄 License
MIT License

---
Built with ❤️ for learners by R Barathi Shankar.
