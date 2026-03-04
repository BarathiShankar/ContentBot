# Deployment Checklist

A complete checklist for deploying AI Content Summarizer to Azure.

## Pre-Deployment Setup

### Local Verification
- [ ] Clone/navigate to project directory
- [ ] Run `npm install` to ensure dependencies are installed
- [ ] Create `.env` file with all required variables (see below)
- [ ] Run `npm run dev` to test locally
- [ ] Run `npm run build` to verify production build
- [ ] Test in browser at `http://localhost:5173/`

### Environment Variables Required
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Firebase Setup
- [ ] Create Firebase project in [Firebase Console](https://console.firebase.google.com)
- [ ] Enable Email/Password authentication
- [ ] Create Firestore Database (start in test mode)
- [ ] Set up Firestore security rules:
  ```firestore
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /summaries/{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```
- [ ] Copy Firebase config and add to `.env`

### Gemini API Setup
- [ ] Go to [Google AI Studio](https://aistudio.google.com)
- [ ] Create API key
- [ ] Copy key to `.env` as `VITE_GEMINI_API_KEY`
- [ ] Test API key works locally

### GitHub Repository
- [ ] Create GitHub repository (or use existing one)
- [ ] Push code to `main` branch
- [ ] Confirm `.env` is in `.gitignore` (should not be committed)
- [ ] Verify all files are committed:
  ```bash
  git status  # Should show working tree clean
  ```

## Azure Deployment Setup

### Create Azure Static Web Apps Resource
- [ ] Go to [Azure Portal](https://portal.azure.com)
- [ ] Create new resource → Static Web App
- [ ] Configure:
  - **Name**: `ai-content-summarizer` (or your choice)
  - **Plan Type**: Free
  - **Region**: Select closest to your users
  - **GitHub Account**: Sign in and authorize
  - **Repository**: Select your GitHub repo
  - **Branch**: `main`

### Build Configuration in Azure
- [ ] **Build Presets**: React
- [ ] **App location**: `/`
- [ ] **API location**: `api`
- [ ] **Output location**: `dist`
- [ ] Click **Create**

### Add GitHub Secrets
- [ ] Go to GitHub repository
- [ ] Settings → Secrets and variables → Actions
- [ ] Create these secrets (copy values from `.env`):
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_GEMINI_API_KEY`

### Configure Azure Application Settings
- [ ] Go to Azure Static Web App resource
- [ ] Configuration → Application settings
- [ ] Add all environment variables as settings OR
- [ ] Use GitHub Secrets in workflow (already configured in `.github/workflows/azure.yml`)

## Testing Deployment

### Initial Deployment
- [ ] Push to `main` branch: `git push origin main`
- [ ] Go to GitHub repository → Actions tab
- [ ] Monitor workflow run
- [ ] Check for build success (green checkmark)
- [ ] Visit Azure Static Web App URL

### Functional Testing
- [ ] Navigate to your Azure Static Web App URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test text summarization with sample text
- [ ] Test summary refinement (expand/simplify/detail)
- [ ] Verify summary saved to Firestore
- [ ] Test History page to view saved summaries
- [ ] Test summary deletion
- [ ] Test logout

### Performance Testing
- [ ] Check page load time
- [ ] Test on mobile device
- [ ] Check console for errors (F12 → Console)
- [ ] Check Network tab for failed requests
- [ ] Verify all CSS loads correctly

## Troubleshooting Deployment

### Build Fails
- [ ] Check GitHub Actions logs
- [ ] Verify all files were committed
- [ ] Check for syntax errors: `npm run lint`
- [ ] Delete `node_modules` locally and reinstall
- [ ] Verify `package.json` has all dependencies

### Runtime Errors - Blank Page
- [ ] Check Azure Portal → Logs
- [ ] Check browser console (F12)
- [ ] Verify environment variables are set correctly
- [ ] Check `staticwebapp.config.json` exists and is correct

### Authentication Errors
- [ ] Verify Firebase credentials in secrets
- [ ] Check Firebase project has authentication enabled
- [ ] Test locally with `npm run dev`
- [ ] Check Firebase security rules

### Summarization Not Working
- [ ] Verify Gemini API key in secrets
- [ ] Test API key works: Check Gemini API usage in Google Cloud Console
- [ ] Check browser console for errors
- [ ] Verify API quota not exceeded

### Firestore Not Saving
- [ ] Check Firestore security rules allow writes
- [ ] Verify Firebase project ID matches
- [ ] Check Azure logs for Firestore errors
- [ ] Test locally with `npm run dev`

## Post-Deployment Configuration

### Custom Domain (Optional)
- [ ] Go to Azure Static Web App → Custom domains
- [ ] Add custom domain
- [ ] Follow DNS configuration steps
- [ ] Verify SSL certificate (automatic)

### Monitoring
- [ ] Set up Azure Monitor alerts
- [ ] Enable Application Insights (optional)
- [ ] View metrics:
  - [ ] Page views
  - [ ] Request count
  - [ ] Error rate
  - [ ] Response time

### Optimization
- [ ] Monitor bundle size
- [ ] Optimize images in `/public`
- [ ] Enable compression
- [ ] Consider code splitting if needed

## Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Environment variables not hardcoded in source
- [ ] HTTPS enabled (automatic on Azure)
- [ ] Firebase security rules configured properly
- [ ] Firebase authentication enabled
- [ ] Gemini API key restricted to your domain (if possible)
- [ ] No sensitive data in git history

## Maintenance

### Regular Tasks
- [ ] Monitor Azure resource costs
- [ ] Review error logs weekly
- [ ] Update dependencies monthly: `npm update`
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Backup Firestore data periodically

### Versioning
- [ ] Tag releases: `git tag v1.0.0`
- [ ] Maintain CHANGELOG.md
- [ ] Update README when features change

## Rollback Plan

If deployment fails:
1. [ ] Check Azure Static Web Apps deployment history
2. [ ] Revert to previous commit: `git revert <commit-hash>`
3. [ ] Push to `main` to re-trigger deployment
4. [ ] Monitor GitHub Actions for new build

## Success Criteria

Your deployment is successful when:

✅ Azure Static Web Apps shows as "Running"
✅ Custom URL is accessible
✅ Page loads without errors
✅ User can register and login
✅ Summarization works end-to-end
✅ Summaries are saved in Firestore
✅ History page displays saved summaries
✅ No errors in browser console
✅ Performance is acceptable (< 3 second load time)

## Support Resources

- [Azure Static Web Apps Docs](https://learn.microsoft.com/azure/static-web-apps/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Vite Documentation](https://vitejs.dev/)

## Final Notes

- Keep `.env` file secure and never commit it
- Monitor Azure costs (Free tier available)
- Update secrets if API keys change
- Maintain regular backups of Firestore data
- Test in staging before deploying to production

---

**Deployment Complete! 🚀**

For detailed troubleshooting, see [AZURE_DEPLOYMENT.md](AZURE_DEPLOYMENT.md)
