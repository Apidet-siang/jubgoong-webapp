# JubGoong Webapp - Deployment Instructions for OpenLiteSpeed

## Production Build Complete

Your webapp has been built and is ready for deployment. All files are in the `dist` folder.

## Deployment Steps

### 1. Upload Files to Your Server

Upload the entire contents of the `dist` folder to your OpenLiteSpeed web root directory. Common locations:
- `/usr/local/lsws/Example/html/`
- `/var/www/html/`
- Or your custom document root

**Upload these files:**
```
dist/
├── .htaccess          (URL rewriting configuration)
├── index.html         (Main HTML file)
└── assets/           (JavaScript, CSS, and other assets)
```

### 2. Configure OpenLiteSpeed

#### Option A: Using Admin Panel (Recommended)

1. Log into OpenLiteSpeed Admin Panel (usually at https://your-domain:7080)
2. Go to **Virtual Hosts** → Your Virtual Host
3. Under **Rewrite**, enable rewrite rules
4. Make sure the document root points to where you uploaded the files

#### Option B: Manual Configuration

Edit your virtual host configuration file:
```bash
sudo nano /usr/local/lsws/conf/vhosts/[your-vhost]/vhconf.conf
```

Add or verify this section:
```
rewrite  {
  enable                  1
  autoLoadHtaccess        1
}
```

### 3. Set Proper Permissions

```bash
# Navigate to your upload directory
cd /path/to/your/upload/directory

# Set proper ownership (adjust user:group as needed)
sudo chown -R nobody:nogroup .

# Set proper permissions
sudo find . -type d -exec chmod 755 {} \;
sudo find . -type f -exec chmod 644 {} \;
```

### 4. Restart OpenLiteSpeed

```bash
sudo systemctl restart lsws
# or
sudo /usr/local/lsws/bin/lswsctrl restart
```

### 5. Access Your Webapp

Visit your domain in a web browser:
```
http://your-domain.com
# or
https://your-domain.com
```

## Important Notes

### SSL/HTTPS Configuration
For production use, you should set up SSL:
1. Use Let's Encrypt with certbot
2. Configure SSL in OpenLiteSpeed Admin Panel
3. Force HTTPS redirect in your virtual host

### Data Storage
This webapp uses **localStorage** in the browser:
- All data is stored locally on each user's device
- Data is NOT synced between devices
- Clearing browser data will delete all lots and transports

### Browser Compatibility
The webapp works best on modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Problem: Blank page or 404 errors on refresh
**Solution:** Make sure .htaccess rewrite rules are working:
1. Verify mod_rewrite is enabled in OpenLiteSpeed
2. Check that autoLoadHtaccess is enabled in your vhost config

### Problem: Assets not loading (404 errors for CSS/JS)
**Solution:** Check file permissions and paths:
1. Verify all files were uploaded correctly
2. Check permissions (755 for directories, 644 for files)
3. Look at browser console for specific error messages

### Problem: Slow loading
**Solution:** Enable compression and caching:
1. The .htaccess file includes caching rules
2. Verify mod_expires and mod_deflate are enabled
3. Consider using a CDN for static assets

## Building Again

If you need to rebuild the webapp:

```bash
cd /Users/macbookpro/documents/webapp/Jubgoong/jubgoong-webapp
npm run build
```

Then re-upload the contents of the `dist` folder to your server.

## Support

For issues with:
- **The webapp**: Check browser console for errors
- **OpenLiteSpeed**: Check `/usr/local/lsws/logs/error.log`
- **Build process**: Check the terminal output during `npm run build`
