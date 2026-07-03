# GitHub Deployment - Complete Guide

## 🎯 What You Need to Do Before Uploading to GitHub

### **Step 1: Export Your Current Database Data**

**Run this script to export all your products, categories, and data:**

```bash
.\export-data.bat
```

**Or manually:**
```bash
cd backend
npm run export-data
```

**This will create:**
- `backend/src/scripts/seedData.json` - Contains all your products, categories, brands

### **Step 2: Upload to GitHub**

**Now your repository is ready:**
- ✅ All source code
- ✅ Product images (in `backend/uploads/`)
- ✅ Database schema
- ✅ Exported data (in `seedData.json`)
- ✅ Environment template (`.env.example`)
- ✅ Setup scripts

### **Step 3: What Others Will Need to Do**

When someone clones your repo, they need to:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Ese-Luxury-Spa

# 2. Install dependencies
cd backend
npm install
cd ../frontend
npm install

# 3. Setup environment
cd backend
cp .env.example .env
# Edit .env with their database credentials

# 4. Start MySQL
docker-compose up -d mysql

# 5. Run migrations
cd backend
npx prisma migrate dev --name init
npx prisma generate

# 6. Seed database with your data
npm run seed-from-export

# 7. Start servers
.\start-dev.bat
```

## 📋 Complete GitHub Setup Checklist

### **Before You Upload:**

- [ ] Run `.\export-data.bat` to export your database
- [ ] Verify `backend/src/scripts/seedData.json` was created
- [ ] Check that `backend/uploads/` contains your images
- [ ] Verify `.env.example` exists
- [ ] Update README with your GitHub repo URL
- [ ] Test that the export script worked

### **After You Upload:**

- [ ] Others can clone the repository
- [ ] Others can run the setup steps
- [ ] Others will see your products and images
- [ ] Application will work the same as yours

## 🔧 Troubleshooting

### **If Export Script Fails:**

**Problem:** Database connection error
**Solution:** Make sure MySQL is running and DATABASE_URL is correct

**Problem:** Permission error
**Solution:** Run as administrator or check file permissions

### **If Import Script Fails:**

**Problem:** `seedData.json` not found
**Solution:** Make sure you ran the export script first

**Problem:** Database already has data
**Solution:** Clear database or use upsert (the script handles this)

### **If Images Don't Show:**

**Problem:** Image paths are wrong
**Solution:** Check that `backend/uploads/` folder structure is preserved

**Problem:** File permissions
**Solution:** Make sure uploads folder is readable

## 🚀 Advanced Setup

### **For Production Deployment:**

1. **Environment Variables:**
   - Use strong JWT secrets
   - Use production API keys
   - Update DATABASE_URL for production database

2. **Database:**
   - Use managed MySQL service
   - Set up automated backups
   - Configure read replicas for scaling

3. **Storage:**
   - Move images to cloud storage (S3, Cloudinary)
   - Update image paths in database
   - Set up CDN for faster loading

4. **Security:**
   - Enable HTTPS
   - Set up firewall rules
   - Use environment variable management
   - Enable rate limiting

## 📝 Summary

**What I've Set Up For You:**

✅ **Export Script** - Exports all your database data  
✅ **Import Script** - Imports data to new installations  
✅ **Environment Template** - `.env.example` for others to use  
✅ **Updated README** - Complete setup instructions  
✅ **Package Scripts** - Easy npm commands for export/import  
✅ **Batch Scripts** - Windows-friendly scripts  

**What You Need to Do:**

1. **Run** `.\export-data.bat` to export your data
2. **Upload** to GitHub
3. **Share** the repository URL
4. **Others** can clone and run the setup steps

**Result:** Your GitHub repository will work exactly like your local setup, with all products, images, and functionality intact.