# Ese Luxury Spa - Development Setup Guide

## 🚀 Quick Start (Recommended)

### Windows Users
```bash
# Robust startup with error checking
.\start-dev.bat

# Quick startup (minimal checks)
.\start.bat

# Stop all servers
.\stop-dev.bat

# Restart servers
.\restart-dev.bat
```

### Linux/Mac Users
```bash
# Make scripts executable first
chmod +x start-dev.sh stop-dev.sh restart-dev.sh

# Robust startup with error checking
./start-dev.sh

# Stop all servers
./stop-dev.sh

# Restart servers
./restart-dev.sh
```

## 📋 What These Scripts Do

### `start-dev.bat` / `start-dev.sh` (Robust Startup)
- ✅ Checks Node.js and Docker installation
- ✅ Verifies MySQL container is running
- ✅ Aggressively clears all ports (5000, 5173-5175)
- ✅ Validates environment configuration files
- ✅ Creates missing .env files automatically
- ✅ Starts backend first, waits for it to be ready
- ✅ Starts frontend after backend is ready
- ✅ Provides troubleshooting tips and credentials

### `start.bat` (Quick Startup)
- ⚡ Fast startup with minimal checks
- ⚡ Clears ports and starts servers
- ⚡ For experienced users who know everything is set up

### `stop-dev.bat` / `stop-dev.sh`
- 🛑 Stops all development servers cleanly
- 🛑 Clears all ports to prevent conflicts
- 🛑 Prevents zombie processes

### `restart-dev.bat` / `restart-dev.sh`
- 🔄 Stops then starts servers cleanly
- 🔄 Useful for fixing state issues

## 🔧 Why Use These Scripts?

### Prevents Common Issues:
1. **Port Conflicts** - Automatically clears ports before starting
2. **Database Issues** - Checks Docker MySQL container status
3. **Missing Config** - Creates .env files if missing
4. **Zombie Processes** - Cleanly stops all processes
5. **Startup Order** - Ensures backend starts before frontend

### Benefits:
- **Consistent Environment** - Same setup every time
- **Error Prevention** - Catches issues before they cause problems
- **Quick Recovery** - Easy restart when things go wrong
- **Team Friendly** - Same scripts work for everyone

## 🛠️ Manual Setup (Not Recommended)

If you prefer manual setup, here's the process:

### 1. Start Docker MySQL
```bash
docker-compose up -d mysql
```

### 2. Clear Ports
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

### 4. Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

## 📁 Project Structure

```
ese-luxury-spa/
├── start-dev.bat          # Windows robust startup
├── start-dev.sh           # Linux/Mac robust startup
├── start.bat              # Windows quick startup
├── stop-dev.bat           # Windows stop script
├── stop-dev.sh            # Linux/Mac stop script
├── restart-dev.bat        # Windows restart script
├── restart-dev.sh         # Linux/Mac restart script
├── TROUBLESHOOTING.md     # Comprehensive troubleshooting guide
├── SETUP.md               # This file
├── backend/
│   ├── .env               # Backend environment variables
│   ├── src/               # Backend source code
│   └── package.json      # Backend dependencies
├── frontend/
│   ├── .env               # Frontend environment variables
│   ├── src/               # Frontend source code
│   └── package.json      # Frontend dependencies
└── docker-compose.yml     # Database setup
```

## 🔑 Important Notes

### Environment Files
- **backend/.env** - Contains database URL, JWT secrets, API keys
- **frontend/.env** - Contains API URL for frontend
- Both are auto-created by the startup scripts if missing

### Port Configuration
- **Backend:** 5000 (Express API)
- **Frontend:** 5173 (Vite dev server)
- **Database:** 3307 (Docker MySQL mapping)

### Admin Credentials
- **Email:** admin.esecosmetics.beauty
- **Password:** Great gamer23
- **Phone:** 0550154253

## 🐛 Troubleshooting

If you encounter issues:

1. **Use the robust startup script:** `.\start-dev.bat`
2. **Check the troubleshooting guide:** See `TROUBLESHOOTING.md`
3. **Restart everything:** `.\restart-dev.bat`
4. **Check system requirements:** Node.js 18+, Docker Desktop

## 📞 Getting Help

For detailed troubleshooting, see:
- **TROUBLESHOOTING.md** - Comprehensive issue resolution
- **README.md** - Project documentation
- **Backend logs** - Check backend terminal for errors
- **Browser console** - Press F12 for frontend errors

## ✅ Best Practices

### Daily Development:
1. Use `start-dev.bat` to start development
2. Use `stop-dev.bat` when done for the day
3. Use `restart-dev.bat` if you encounter issues

### Before Starting:
- Ensure Docker Desktop is running
- Check no other projects use ports 5000, 5173
- Verify your internet connection (for npm packages)

### After Development:
- Always stop servers cleanly
- Commit working code
- Note any configuration changes

### Regular Maintenance:
- Update dependencies weekly
- Restart Docker Desktop occasionally
- Check database disk usage
- Review logs for errors