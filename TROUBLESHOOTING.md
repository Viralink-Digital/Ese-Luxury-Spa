# Ese Luxury Spa - Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **1. Port Conflicts (EADDRINUSE)**
**Problem:** Backend or frontend won't start due to port already in use.

**Solution:**
```bash
# Use the stop script
.\stop-dev.bat

# Then restart
.\start-dev.bat
```

**Prevention:**
- Always use `stop-dev.bat` before starting new servers
- Use `restart-dev.bat` for clean restarts
- Don't manually start servers if using the scripts

---

### **2. Database Connection Issues**
**Problem:** Backend fails to connect to MySQL database.

**Solution:**
```bash
# Check Docker is running
docker ps

# Start MySQL container
docker-compose up -d mysql

# Verify database exists
docker exec -it ese_luxury_mysql mysql -uroot -proot -e "SHOW DATABASES;"
```

**Prevention:**
- Keep Docker Desktop running
- Don't change `.env` DATABASE_URL without understanding
- Use provided `start-dev.bat` which checks Docker

---

### **3. Products Not Showing**
**Problem:** Admin panel or shop shows no products.

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:5000/api/v1/products

# 2. Check browser console (F12) for errors
# 3. Verify authentication (admin panel requires login)
# 4. Clear browser cache
```

**Prevention:**
- Use consistent API response structure
- Check console logs regularly
- Verify authentication tokens

---

### **4. Search Not Working**
**Problem:** Product search returns no results or errors.

**Solution:**
```bash
# 1. Check backend logs for errors
# 2. Test API directly
curl "http://localhost:5000/api/v1/products?search=test"

# 3. Clear React Query cache in browser
# 4. Restart frontend
```

**Prevention:**
- Disable aggressive caching for search queries
- Add proper error handling
- Use debug logging

---

### **5. Authentication Issues**
**Problem:** Can't login to admin panel or API returns 401.

**Solution:**
```bash
# 1. Verify admin user exists
cd backend
npm run seed

# 2. Check credentials in backend/.env
# 3. Clear browser localStorage
# 4. Check JWT secrets in .env
```

**Prevention:**
- Run `npm run seed` after database changes
- Keep secure JWT secrets
- Use consistent auth middleware

---

## 🔧 Development Best Practices

### **Starting Development Environment**
```bash
# ALWAYS use this script
.\start-dev.bat

# It handles:
# - Port cleanup
# - Docker verification
# - Environment setup
# - Sequential server startup
```

### **Stopping Development Environment**
```bash
# ALWAYS use this script
.\stop-dev.bat

# It handles:
# - Clean process termination
# - Port cleanup
# - Prevents zombie processes
```

### **Restarting Development Environment**
```bash
# For clean restarts
.\restart-dev.bat

# This runs stop then start automatically
```

---

## 🛠️ System Requirements

### **Required Software**
- **Node.js 18+** - Backend and frontend runtime
- **Docker Desktop** - MySQL database container
- **Git** - Version control (optional but recommended)

### **Port Configuration**
- **Backend:** 5000 (Express API)
- **Frontend:** 5173 (Vite dev server)
- **Database:** 3307 (Docker MySQL mapping)

### **Environment Files**
- `backend/.env` - Backend configuration
- `frontend/.env` - Frontend configuration
- `docker-compose.yml` - Database setup

---

## 🐛 Debugging Techniques

### **Backend Debugging**
```bash
# Check backend logs
cd backend
npm run dev

# Test API endpoints
curl http://localhost:5000/api/v1/products
curl http://localhost:5000/api/v1/categories

# Check database connection
cd backend
node src/scripts/checkDatabase.js
```

### **Frontend Debugging**
```bash
# Check browser console (F12)
# Look for:
# - Network errors (red failed requests)
# - Console errors (JavaScript errors)
# - React Query errors (API failures)

# Test API calls in browser console
fetch('http://localhost:5000/api/v1/products')
  .then(r => r.json())
  .then(console.log)
```

### **Database Debugging**
```bash
# Check database state
cd backend
node src/scripts/checkDatabase.js

# Test search functionality
cd backend
node src/scripts/testSearch.js

# Verify API response structure
cd backend
node src/scripts/testApiResponse.js
```

---

## 📋 Maintenance Tasks

### **Weekly**
- Restart development environment (`restart-dev.bat`)
- Check for Node.js updates
- Verify Docker containers are running

### **Monthly**
- Update dependencies (`npm update`)
- Check database disk usage
- Review logs for errors

### **As Needed**
- Clear browser cache
- Restart Docker Desktop
- Run database migrations
- Seed admin user (`npm run seed`)

---

## 🚨 Emergency Procedures

### **Complete System Reset**
```bash
# 1. Stop everything
.\stop-dev.bat

# 2. Kill all Node processes
taskkill /F /IM node.exe

# 3. Restart Docker Desktop
# (Manual: right-click Docker icon -> Restart)

# 4. Start fresh
.\start-dev.bat
```

### **Database Reset**
```bash
# ⚠️ WARNING: This deletes all data
docker-compose down -v
docker-compose up -d mysql
cd backend
npx prisma migrate dev
npm run seed
```

### **Frontend Cache Clear**
```bash
# Delete node_modules and reinstall
cd frontend
rmdir /s /q node_modules
rmdir /s /q .vite
npm install
npm run dev
```

---

## 📞 Getting Help

### **Check These First**
1. Browser console (F12) for errors
2. Backend terminal for error logs
3. Docker Desktop for container status
4. Port availability (5000, 5173)

### **Useful Commands**
```bash
# Check what's using ports
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Check Docker containers
docker ps
docker logs ese_luxury_mysql

# Check Node processes
tasklist | findstr node
```

### **Last Resort**
If all else fails:
1. Restart your computer
2. Use `start-dev.bat` fresh
3. Check this troubleshooting guide
4. Review recent code changes

---

## ✅ Prevention Checklist

Before starting development each day:
- [ ] Docker Desktop is running
- [ ] No zombie Node processes (use `stop-dev.bat`)
- [ ] Environment files exist (`.env`)
- [ ] Ports 5000, 5173 are available
- [ ] Database container is healthy

During development:
- [ ] Use provided scripts, not manual starts
- [ ] Check browser console for errors
- [ ] Monitor backend logs
- [ ] Test changes immediately

After development:
- [ ] Use `stop-dev.bat` to clean up
- [ ] Commit working code
- [ ] Document any issues found
- [ ] Note any configuration changes