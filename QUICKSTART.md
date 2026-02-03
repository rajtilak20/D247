# 🚀 Quick Start Guide - Deals247

## Step 1: MySQL Setup

### Option A: If you have MySQL installed

1. **Start MySQL service** (if not running)

2. **Create the database:**
   ```sql
   CREATE DATABASE deals247;
   ```

3. **Update backend/.env** with your credentials:
   ```env
   DATABASE_URL="mysql://YOUR_USERNAME:YOUR_PASSWORD@localhost:3306/deals247"
   ```
   
   Example:
   ```env
   DATABASE_URL="mysql://root:mypassword@localhost:3306/deals247"
   ```

### Option B: If you DON'T have MySQL

Install MySQL:
```powershell
# Using Chocolatey
choco install mysql

# OR download from: https://dev.mysql.com/downloads/mysql/
```

## Step 2: Backend Setup & Migration

```powershell
# Navigate to backend
cd d:\Repos\Later\R\D247\backend

# Install dependencies (already done, but just in case)
npm install

# Run database migration (creates all tables)
npm run migrate

# When prompted, enter migration name: "initial_schema"

# Start the backend server
npm run dev
```

**Expected output:**
```
🚀 Server running on port 3000
Database connected successfully
```

**Test it:**
Open browser to http://localhost:3000/api/health

Should see:
```json
{
  "status": "ok",
  "timestamp": "2026-02-03...",
  "uptime": 1.234,
  "environment": "development"
}
```

## Step 3: Frontend Setup

Open a **new terminal**:

```powershell
# Navigate to frontend
cd d:\Repos\Later\R\D247\frontend

# Install dependencies (already done)
npm install

# Start the frontend
npm run dev
```

**Expected output:**
```
ROLLDOWN-VITE v7.2.5  ready in 1675 ms
➜  Local:   http://localhost:5173/
```

**Open browser:** http://localhost:5173

## Step 4: Verify Everything Works

### Current Status (Phase 1)

✅ **What WORKS:**
- Frontend UI is fully functional
- Navigation between all pages
- Backend server runs
- Database connection
- All tables created

⚠️ **What DOESN'T work yet:**
- API endpoints (not implemented yet)
- Frontend will show "Failed to load deals" - this is expected
- Admin login won't work

### Testing the Health Check

While both servers are running:

**Terminal test:**
```powershell
curl http://localhost:3000/api/health
```

**Browser test:**
Navigate to: http://localhost:3000/api/health

## Step 5: What's Next?

You now have:
- ✅ Complete project structure
- ✅ Database with all tables
- ✅ Frontend UI ready
- ✅ Backend server running

**Next Phase: Implement API Endpoints**

To actually see data in the app, we need to:
1. Implement the API routes
2. Create controllers and services
3. Add seed data to the database

---

## 📝 Common Issues

### Issue: "Migration failed"
**Solution:** Check your DATABASE_URL in `.env`. Make sure:
- MySQL is running
- Username/password are correct
- Database `deals247` exists

### Issue: "Port 3000 already in use"
**Solution:** 
```powershell
# Find and kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure backend is running on port 3000
- Check CORS settings in backend
- Verify VITE_API_BASE_URL in frontend/.env

### Issue: "Module not found"
**Solution:**
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

---

## 🎯 Summary

**Project is at: 40% Complete**

| Component | Status | Next Step |
|-----------|--------|-----------|
| Backend Structure | ✅ Done | Implement API routes |
| Database Schema | ✅ Done | Add seed data |
| Frontend UI | ✅ Done | Connect to real API |
| Admin Panel | 🟡 Partial | Implement CRUD |

**You're ready to move to Phase 2: API Implementation!**
