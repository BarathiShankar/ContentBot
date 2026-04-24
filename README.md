# ContentBot-V2📝

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

3. **Create your environment file**
  - Copy the example file:
    ```bash
    cp AI-Content-Summarizer/.env.example AI-Content-Summarizer/.env
    ```
  - Fill in your Gemini API key and Firebase config values.
  - Do not commit `AI-Content-Summarizer/.env` to git.

4. **Configure Firebase**
  - Create a Firebase project and enable Email/Password authentication.
  - Add a Firestore database (start in test mode for development).
  - Use the Firebase values in `AI-Content-Summarizer/.env`.

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
## Sample Output 
<table border="1">
  <tr>
    <td><img src=".\AI-Content-Sumarizer\src\assets\login_pic.png" width="300"></td>
    <td><img src=".\AI-Content-Sumarizer\src/assets/Dash_pic.png" width="300"></td>
  </tr>
</table>

## 📄 License
MIT License

## 🚀 Live Demo
[AI Summarizer App](https://ai-summarizer-e401e.web.app/login)

---
Built with ❤️ for learners by R Barathi Shankar.
