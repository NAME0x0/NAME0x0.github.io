# 🚀 GitHub Pages Deployment Guide

## 📋 **Overview**
This guide will help you deploy your cinematic portfolio to your existing GitHub Pages repository: `NAME0x0.github.io`

## 🔧 **Step-by-Step Deployment**

### **1. Prepare Your GitHub Repository**

#### **Option A: Replace Existing Content**
If you want to completely replace your current `NAME0x0.github.io` repository:

```bash
# Navigate to your existing repository
cd /path/to/NAME0x0.github.io

# Backup existing content (optional)
git checkout -b backup-old-site
git push origin backup-old-site
git checkout main

# Remove all existing content
rm -rf *
rm -rf .*  # Be careful with this - it removes hidden files

# Copy your portfolio files
cp -r /path/to/futuristic-portfolio-prototype/* .
cp -r /path/to/futuristic-portfolio-prototype/.github .

# Stage and commit
git add .
git commit -m "🎬 Deploy cinematic portfolio"
git push origin main
```

#### **Option B: Create Fresh Repository**
If you want to start fresh:

```bash
# Clone your existing repository
git clone https://github.com/NAME0x0/NAME0x0.github.io.git
cd NAME0x0.github.io

# Copy portfolio files
cp -r /path/to/futuristic-portfolio-prototype/* .
cp -r /path/to/futuristic-portfolio-prototype/.github .

# Stage and commit
git add .
git commit -m "🎬 Deploy cinematic portfolio"
git push origin main
```

### **2. Enable GitHub Pages**

1. Go to your repository: `https://github.com/NAME0x0/NAME0x0.github.io`
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the settings

### **3. Configure Repository Settings**

In your repository settings:

1. **General Settings**:
   - Repository name: `NAME0x0.github.io`
   - Description: "Award-worthy cinematic portfolio - AI Developer & Tech Innovator"
   - Make it public (required for GitHub Pages)

2. **Actions Permissions**:
   - Go to **Settings** → **Actions** → **General**
   - Enable "Allow all actions and reusable workflows"

3. **Pages Configuration**:
   - **Source**: GitHub Actions
   - **Custom domain** (optional): If you have one

### **4. Test the Deployment**

After pushing to GitHub:

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Once complete, visit: `https://name0x0.is-a.dev`

## 🔄 **Automatic Deployment**

The GitHub Actions workflow will automatically:
- ✅ Build your portfolio on every push to `main`
- ✅ Run tests and optimizations
- ✅ Deploy to GitHub Pages
- ✅ Update your live site

## 🛠 **Local Development**

For local development:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 **File Structure After Deployment**

```
NAME0x0.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated deployment
├── public/
│   └── icon.svg               # App icon
├── index.html                 # Main page
├── app.js                     # Application logic
├── style.css                  # Styles
├── manifest.json              # PWA manifest
├── sw.js                      # Service Worker
├── sitemap.xml                # SEO sitemap
├── robots.txt                 # Search engine directives
├── package.json               # Dependencies
└── README.md                  # Documentation
```

## 🔧 **Custom Domain (Optional)**

If you want to use a custom domain:

1. Add a `CNAME` file to your repository root:
   ```
   yourdomain.com
   ```

2. Update DNS settings with your domain provider:
   - Add CNAME record pointing to `NAME0x0.github.io`

3. Update configuration files:
   - `package.json` → `homepage`
   - `sitemap.xml` → URLs
   - `index.html` → meta tags

## 🚨 **Troubleshooting**

### **Deployment Failed**
- Check the Actions tab for error details
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### **Site Not Loading**
- Wait 5-10 minutes after first deployment
- Check GitHub Pages settings
- Verify repository is public

### **Assets Not Loading**
- Check browser console for 404 errors
- Verify `base` path in `vite.config.js`
- Ensure all files are committed

### **Performance Issues**
- Run Lighthouse audit
- Check bundle size with `npm run build`
- Optimize images and assets

## 📊 **Post-Deployment Checklist**

- [ ] Site loads at `https://NAME0x0.github.io`
- [ ] All sections display correctly
- [ ] 3D animations work (particles, globe, rings)
- [ ] Terminal commands function
- [ ] Carousel navigation works
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] SEO meta tags correct
- [ ] PWA installable

## 📈 **Monitoring & Analytics**

Consider adding:
- Google Analytics
- Plausible Analytics (privacy-friendly)
- Hotjar for user behavior
- Sentry for error tracking

## 🎉 **Congratulations!**

Your cinematic portfolio is now live at:
**https://name0x0.is-a.dev**

Share your amazing work with the world! 🌟