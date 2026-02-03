# VPS Deployment Guide - Deals247 Backend

## Prerequisites

- VPS server (Ubuntu 20.04+ recommended)
- SSH access to your VPS
- Domain name (optional but recommended)

---

## Step 1: Connect to Your VPS

```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

---

## Step 2: Install Node.js

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

---

## Step 3: Install Git

```bash
sudo apt install git -y
```

---

## Step 4: Clone Your Repository

```bash
# Create directory for your app
mkdir -p /var/www
cd /var/www

# Clone your repository (you'll need to push to GitHub first)
git clone https://github.com/yourusername/deals247.git
cd deals247/backend

# OR upload files manually using SCP/SFTP
```

---

## Step 5: Install Dependencies

```bash
cd /var/www/deals247/backend
npm install
```

---

## Step 6: Create Production .env File

```bash
nano .env
```

Add the following:
```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_URL="mysql://u515501238_deals247:2ap5HYzh5@R8&Cq@193.203.166.226:3306/u515501238_deals247"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://yourdomain.com
```

Save and exit (Ctrl+X, Y, Enter)

---

## Step 7: Run Database Migration

```bash
npm run migrate
```

This should work now because you're connecting from the VPS, not your local machine.

---

## Step 8: Seed the Database

```bash
npm run db:seed
```

---

## Step 9: Build TypeScript

```bash
npm run build
```

---

## Step 10: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start your application
pm2 start dist/server.js --name deals247-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the command it gives you
```

---

## Step 11: Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/deals247
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or VPS IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/deals247 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 12: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

---

## Step 13: Configure Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

---

## Quick Commands Reference

### Check Application Status
```bash
pm2 status
pm2 logs deals247-api
```

### Restart Application
```bash
pm2 restart deals247-api
```

### Update Application
```bash
cd /var/www/deals247/backend
git pull
npm install
npm run build
pm2 restart deals247-api
```

### View Logs
```bash
pm2 logs deals247-api --lines 100
```

### Stop Application
```bash
pm2 stop deals247-api
```

---

## Alternative: Quick Upload Without Git

If you don't want to use Git, upload files using SCP from your local machine:

```bash
# From your local machine (PowerShell)
scp -r d:\Repos\Later\R\D247\backend root@your-vps-ip:/var/www/deals247/
```

---

## Troubleshooting

### Can't connect to MySQL
- Verify your VPS IP is whitelisted in Hostinger Remote MySQL
- Check DATABASE_URL in .env file
- Test connection: `npm run migrate`

### Port 3000 already in use
```bash
# Find and kill the process
sudo lsof -i :3000
sudo kill -9 <PID>
```

### PM2 not starting on boot
```bash
pm2 unstartup
pm2 startup
# Run the command it provides
pm2 save
```

---

## Testing Your API

Once deployed, test your API:

```bash
# Health check
curl http://your-vps-ip/health

# Get deals
curl http://your-vps-ip/api/deals

# Login
curl -X POST http://your-vps-ip/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@deals247.com","password":"admin123"}'
```

---

## Next Steps

1. Update frontend [.env](frontend/.env) to point to your VPS:
   ```env
   VITE_API_URL=http://your-vps-ip
   # or with domain
   VITE_API_URL=https://api.yourdomain.com
   ```

2. Deploy frontend to Vercel/Netlify/Hostinger

3. Update CORS settings in backend [.env](backend/.env) to match your frontend URL
