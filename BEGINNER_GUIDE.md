# 🎯 Quick Start Guide for Non-Programmers

Welcome! This guide will help you get ReviewHub running on your computer in simple steps.

## What You'll Need

You need to install 2 programs on your computer before you can run ReviewHub:

### 1. Node.js (JavaScript runtime)
- **Windows/Mac**: Go to https://nodejs.org/
- Click the green button that says "Download" (choose the LTS version)
- Run the installer and follow the instructions
- Keep clicking "Next" until it's installed

### 2. MongoDB (Database)
You have 2 options:

#### Option A: MongoDB Atlas (Cloud - Easier, Recommended for beginners)
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create a free account
4. Create a free cluster (choose the free tier)
5. Click "Connect" and get your connection string
6. Save this connection string - you'll need it later!

#### Option B: MongoDB Local (On your computer)
- **Windows**: Go to https://www.mongodb.com/try/download/community
- Download and install MongoDB Community Server
- Follow the installation wizard

---

## 📥 Step-by-Step: Getting the Files

### Method 1: Download as ZIP (Easiest)
1. Go to https://github.com/I0nz3d/supreme-funicular
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file to a folder on your computer (e.g., `C:\ReviewHub` or `~/Documents/ReviewHub`)

### Method 2: Using Git (If you have Git installed)
```bash
git clone https://github.com/I0nz3d/supreme-funicular.git
cd supreme-funicular
```

---

## 🚀 Step-by-Step: Running ReviewHub

### Step 1: Open Terminal/Command Prompt

**Windows:**
1. Press `Windows Key + R`
2. Type `cmd` and press Enter

**Mac:**
1. Press `Command + Space`
2. Type `Terminal` and press Enter

### Step 2: Navigate to the ReviewHub Folder

Type this command (replace the path with where you saved the files):

**Windows:**
```bash
cd C:\ReviewHub
```

**Mac/Linux:**
```bash
cd ~/Documents/ReviewHub
```

### Step 3: Install Dependencies

Type this command and press Enter:
```bash
npm install
```

⏳ Wait for it to finish (this might take 1-2 minutes). You'll see lots of text scrolling - that's normal!

### Step 4: Configure the Application

Type this command:
```bash
npm run setup
```

The setup wizard will ask you questions. Here's what to enter:

1. **Server port**: Just press Enter (uses default: 3000)
2. **MongoDB URI**: 
   - If using MongoDB Atlas: Paste your connection string
   - If using local MongoDB: Just press Enter (uses default)
3. **JWT token expiry**: Just press Enter (uses default: 7d)

### Step 5: Start the Application

Type this command:
```bash
npm start
```

You should see:
```
MongoDB Connected: ...
ReviewHub server running on port 3000
```

🎉 **Congratulations!** ReviewHub is now running!

---

## 🌐 Viewing ReviewHub in Your Browser

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Type in the address bar: `http://localhost:3000`
3. Press Enter

You should see the ReviewHub homepage!

---

## 🎨 What You Can Do Now

### As a Business Owner:
1. Click "Sign Up" on the homepage
2. Fill in your information
3. Check the box "I'm registering as a business"
4. Click "Create Account"
5. You'll see your business dashboard with stats!

### To Submit a Review (as a customer):
1. Go to: `http://localhost:3000/review-form.html`
2. Enter a business ID (you'll get this from your dashboard)
3. Fill in the review form
4. Click "Submit Review"

---

## 🛑 Stopping the Application

When you're done:
1. Go back to the Terminal/Command Prompt window
2. Press `Ctrl + C` (Windows) or `Command + C` (Mac)
3. Type `Y` if asked to terminate

---

## 🔄 Running It Again Later

Next time you want to use ReviewHub:

1. Open Terminal/Command Prompt
2. Navigate to the ReviewHub folder:
   ```bash
   cd C:\ReviewHub  # or your path
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open browser to `http://localhost:3000`

---

## 🆘 Troubleshooting

### "Command not found" or "npm is not recognized"
- Node.js isn't installed properly
- Close and reopen Terminal/Command Prompt after installing Node.js
- Try restarting your computer

### "MongoDB connection error"
- Make sure MongoDB is running (if using local MongoDB)
- Check your MongoDB Atlas connection string is correct
- Make sure your internet is working (for MongoDB Atlas)

### Port 3000 is already in use
- Another program is using port 3000
- Either stop that program, or change the port:
  1. Open the `.env` file (in the ReviewHub folder)
  2. Change `PORT=3000` to `PORT=3001`
  3. Access it at `http://localhost:3001`

### Can't see the website
- Make sure the server is running (see "ReviewHub server running" message)
- Try `http://127.0.0.1:3000` instead
- Check if your firewall is blocking it

---

## 📝 Important Files to Know

- **`.env`** - Your configuration file (DON'T share this file!)
- **`server.js`** - Main application file
- **`public/index.html`** - The homepage you see in the browser
- **`README.md`** - Full technical documentation

---

## 🎓 Next Steps

Once you have it running:

1. **Explore the Features**: Click around and try creating a business account
2. **Read the Documentation**: Check out `README.md` for more details
3. **Customize**: You can change colors and text in `public/css/styles.css`
4. **Deploy Online**: See `DEPLOYMENT.md` for putting it on the internet

---

## 💡 Pro Tips

- Keep the Terminal/Command Prompt window open while using ReviewHub
- The server must be running for the website to work
- Your data is saved in MongoDB, so it persists between sessions
- Use `Ctrl + C` to stop the server before closing the Terminal

---

## 📞 Need More Help?

- Check the full README.md file for detailed documentation
- Look at DEPLOYMENT.md for hosting online
- Open an issue on GitHub if you're stuck

---

**Remember:** The first time setup takes longer. After that, it's just:
1. Open Terminal
2. `cd` to the folder
3. `npm start`
4. Open browser to `localhost:3000`

Happy reviewing! 🌟
