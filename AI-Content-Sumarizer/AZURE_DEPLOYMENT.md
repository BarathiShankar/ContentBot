# Azure Deployment Guide

This guide walks you through deploying the AI Content Summarizer to Azure Static Web Apps.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Repository](#step-1-prepare-your-repository)
3. [Step 2: Create Azure Static Web Apps Resource](#step-2-create-azure-static-web-apps-resource)
4. [Step 3: Configure GitHub Secrets](#step-3-configure-github-secrets)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Deploy](#step-5-deploy)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

## Prerequisites

- GitHub account with repository push access
- Azure account (free tier available)
- Firebase project set up
- Gemini API key from Google AI Studio
- Node.js 16+ (for local testing)

## Step 1: Prepare Your Repository

### 1a. Ensure .env is Gitignored

Make sure your `.env` file is in `.gitignore`:

```bash
# Check .gitignore contains:
.env
.env.local
.env.*.local
```

### 1b. Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Azure deployment"
git push origin main
```

## Step 2: Create Azure Static Web Apps Resource

### Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **+ Create a resource**
3. Search for **Static Web App**
4. Click **Create**

### Configure the Static Web App

Fill in the following details:

| Field | Value |
|-------|-------|
| **Subscription** | Your Azure subscription |
| **Resource Group** | Create new or select existing |
| **Name** | `ai-content-summarizer` (or your choice) |
| **Plan Type** | Free |
| **Region** | (East US) or closest to you |
| **GitHub Account** | Sign in with your GitHub account |
| **Organization** | Your GitHub username |
| **Repository** | Select `AI-Content-Summarizer` |
| **Branch** | `main` |

### Configure Build Details

Under **Build Details**:

| Field | Value |
|-------|-------|
| **Build Presets** | React |
| **App location** | `/` |
| **API location** | `api` |
| **Output location** | `dist` |

Click **Review + Create** → **Create**

## Step 3: Configure GitHub Secrets

Azure will automatically create a GitHub Actions workflow. You need to add the following secrets to your GitHub repository:

### Add Secrets to GitHub

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**

Add these secrets:

### Environment Variables as Secrets

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**Note:** Each requires a separate secret entry.

## Step 4: Configure Environment Variables

### In Azure Portal

1. Go to your Static Web App resource
2. Select **Configuration** → **Application settings**
3. Add all the environment variables from Step 3 as application settings

Alternatively, you can pass them as environment variables in GitHub Actions workflow.

### Modified GitHub Actions Workflow

The `.github/workflows/azure.yml` file includes environment variable setup:

```yaml
env:
  VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
  VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
  VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
  VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
  VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
  VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
  VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
```

## Step 5: Deploy

### Automatic Deployment

Push changes to the `main` branch:

```bash
git add .
git commit -m "Deploy to Azure"
git push origin main
```

GitHub Actions will automatically:
1. Install dependencies
2. Run the build
3. Deploy to Azure Static Web Apps

### Check Deployment Status

1. Go to your GitHub repository
2. Click **Actions** tab
3. View the workflow run status
4. Once complete, visit your Azure Static Web App URL

## Monitoring & Troubleshooting

### View Logs

**GitHub Actions Logs:**
1. Go to repository → Actions
2. Click on the workflow run
3. View detailed logs

**Azure Portal Logs:**
1. Go to Static Web App resource
2. Diagnostic diagnostic logs
3. Check for build/runtime errors

### Common Issues

#### 1. Build Fails - Module Not Found

**Error:** `Cannot find module '@google/generative-ai'`

**Solution:**
- Ensure `npm install` runs before build
- Check `package.json` has all dependencies
- Delete `node_modules` and reinstall locally

#### 2. Runtime Errors - Firebase Config Missing

**Error:** `firebase is not configured`

**Solution:**
- Verify all `VITE_FIREBASE_*` secrets are added
- Check secret names match exactly (case-sensitive)
- Restart the deployment after adding secrets

#### 3. API Key Invalid

**Error:** `Invalid API key for Gemini`

**Solution:**
- Verify your Gemini API key is correct
- Check key isn't expired or revoked
- Ensure secret is set with exact key value

#### 4. CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- This is expected for cross-origin requests
- Google APIs and Firebase are configured for browser access
- Check browser console for specific error details

### Debug Mode

To see verbose logs during build:

1. Add the following to GitHub Actions workflow:
```yaml
- name: Debug
  run: |
    echo "Node version:"
    node --version
    echo "Npm version:"
    npm --version
    echo "Build output:"
```

### Firebase Firestore Rules

Ensure your Firestore security rules allow reads/writes:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their summaries
    match /summaries/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Post-Deployment

### Verify Deployment

1. Visit your Azure Static Web App URL
2. Test user registration
3. Test summarization feature
4. Check Firebase Firestore for saved summaries

### Set Up Custom Domain

1. Go to Static Web App → Custom domains
2. Click **Add**
3. Follow the steps to configure DNS

### Enable HTTPS

HTTPS is automatically enabled for Azure Static Web Apps.

### Monitor Performance

1. Go to Static Web App → Monitoring
2. View:
   - Request count
   - HTTP status codes
   - Server response time
   - Bandwidth usage

## Cleanup

To delete the Azure Static Web App:

1. Go to Azure Portal
2. Select your Static Web App
3. Click **Delete**
4. Confirm deletion

**Note:** This does not delete your GitHub Actions workflow. You can remove it manually from `.github/workflows/azure.yml`.

## Additional Resources

- [Azure Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase Hosting Alternatives](https://firebase.google.com/docs/hosting)
- [Vite Deployment Guide](https://vitejs.dev/guide/deploy.html)

## Support

For issues:
1. Check Azure Portal → Static Web App → Logs
2. Check GitHub Actions workflow logs
3. Review browser console for client-side errors
4. Check [Azure Documentation](https://docs.microsoft.com/azure/)

---

**Happy Deploying! 🚀**
