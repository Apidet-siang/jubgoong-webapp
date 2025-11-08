# Deploy JubGoong Webapp via GitHub

This guide shows how to upload your webapp to GitHub and deploy it from there to your OpenLiteSpeed server.

---

## Part 1: Upload to GitHub

### Step 1: Create a New Repository on GitHub

1. Go to https://github.com
2. Click the **+** icon (top right) → **New repository**
3. Fill in:
   - **Repository name**: `jubgoong-webapp` (or your preferred name)
   - **Description**: "Shrimp weight tracking webapp"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README (we already have one)
4. Click **Create repository**

### Step 2: Push Your Code to GitHub

GitHub will show you commands. Use these:

```bash
cd /Users/macbookpro/documents/webapp/Jubgoong/jubgoong-webapp

# Add your GitHub repository as remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push your code
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/yourusername/jubgoong-webapp.git
git branch -M main
git push -u origin main
```

You'll be prompted to enter your GitHub username and password (or personal access token).

---

## Part 2: Deploy to Your OpenLiteSpeed Server

### Method A: Clone the Repository (Recommended)

SSH into your server and run:

```bash
# Navigate to your web root (adjust path as needed)
cd /usr/local/lsws/Example/html/

# Or if you have a custom location:
# cd /var/www/html/

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git jubgoong

# Navigate to the cloned directory
cd jubgoong

# Copy the dist folder contents to the web root
cp -r dist/* ../

# Or move the entire dist folder
# mv dist /usr/local/lsws/Example/html/jubgoong
```

### Method B: Download ZIP from GitHub

If you can't use git on your server:

1. On GitHub, go to your repository page
2. Click the green **Code** button
3. Click **Download ZIP**
4. Upload the ZIP to your server
5. Unzip and copy the `dist` folder contents to your web root

```bash
# On your server
unzip jubgoong-webapp-main.zip
cd jubgoong-webapp-main
cp -r dist/* /usr/local/lsws/Example/html/
```

### Step 3: Set Permissions

```bash
# Navigate to where you uploaded the files
cd /usr/local/lsws/Example/html/

# Set ownership (adjust user:group based on your setup)
sudo chown -R nobody:nogroup .

# Set permissions
sudo find . -type d -exec chmod 755 {} \;
sudo find . -type f -exec chmod 644 {} \;
```

### Step 4: Configure OpenLiteSpeed

Make sure URL rewriting is enabled:

**Option 1: Admin Panel**
1. Go to https://your-server-ip:7080
2. Navigate to: **Virtual Hosts** → Your Virtual Host → **Rewrite**
3. Set: `Enable Rewrite = Yes`
4. Set: `Auto Load from .htaccess = Yes`
5. Click **Save**

**Option 2: Config File**
```bash
sudo nano /usr/local/lsws/conf/vhosts/[your-vhost]/vhconf.conf
```

Add:
```
rewrite  {
  enable                  1
  autoLoadHtaccess        1
}
```

### Step 5: Restart OpenLiteSpeed

```bash
sudo systemctl restart lsws
# or
sudo /usr/local/lsws/bin/lswsctrl restart
```

### Step 6: Test Your Webapp

Visit your website in a browser:
```
http://your-domain.com
# or
http://your-server-ip
```

---

## Updating Your Deployment

When you make changes to the webapp:

### On Your Local Machine:

```bash
cd /Users/macbookpro/documents/webapp/Jubgoong/jubgoong-webapp

# Rebuild the production files
npm run build

# Commit changes
git add .
git commit -m "Update webapp"
git push
```

### On Your Server:

```bash
cd /path/to/your/jubgoong

# Pull latest changes
git pull origin main

# Copy updated dist files
cp -r dist/* ../

# Or if you're serving from the dist folder directly:
# No additional steps needed

# Restart server (if needed)
sudo systemctl restart lsws
```

---

## Alternative: Serve Directly from Git Repository

You can point OpenLiteSpeed to serve the `dist` folder directly:

1. Clone repo to any location: `/home/yourusername/jubgoong-webapp`
2. In OpenLiteSpeed Admin Panel:
   - Virtual Host → General → **Document Root**
   - Set to: `/home/yourusername/jubgoong-webapp/dist`
3. Restart OpenLiteSpeed

Now updates are easier:
```bash
cd /home/yourusername/jubgoong-webapp
git pull origin main
sudo systemctl restart lsws
```

---

## Troubleshooting

### Can't push to GitHub?
- Make sure you have git configured:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```
- Use a Personal Access Token instead of password (GitHub requires this now)
- Generate token at: https://github.com/settings/tokens

### Files not updating on server?
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check that you copied files to the correct directory
- Verify OpenLiteSpeed document root points to the right location

### 404 errors when refreshing pages?
- Make sure `.htaccess` file is in the web root
- Verify `autoLoadHtaccess = 1` in OpenLiteSpeed config
- Check that mod_rewrite is enabled

---

## Repository Structure

```
jubgoong-webapp/
├── dist/                  # Production build (deploy this folder)
│   ├── .htaccess         # URL rewriting rules
│   ├── index.html        # Main HTML
│   └── assets/           # JS and CSS files
├── src/                   # Source code
├── DEPLOYMENT.md          # Detailed deployment instructions
├── GITHUB_DEPLOYMENT.md   # This file
├── README.md              # Project documentation
└── package.json           # Dependencies
```

**To deploy: Upload contents of `dist/` folder to your web root.**

---

## Need Help?

- **GitHub Issues**: Check your repository's Issues tab
- **OpenLiteSpeed Docs**: https://openlitespeed.org/kb/
- **Project README**: See README.md in the repository
