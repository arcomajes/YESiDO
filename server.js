const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Uploads directory created");
}

// Middleware
app.use(express.json({ limit: '50mb' }));

// CORS configuration
const allowedOrigins = [
  "https://yes-i-do-eta.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { 
  dbName: "yesido",
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Schema Definitions
const MemorySchema = new mongoose.Schema({
  name: String,
  images: [{
    data: { type: String, required: true },
    contentType: { type: String, required: true }
  }],
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Memory = mongoose.model("Memory", MemorySchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Routes
app.post("/upload", upload.array("images", 10), async (req, res) => {
  try {
    console.log("Upload request received");
    
    if (!req.files || req.files.length === 0) {
      console.error("No files uploaded");
      return res.status(400).json({ message: "No files uploaded" });
    }
    
    console.log(`Processing ${req.files.length} files`);
    
    const images = req.files.map(file => {
      console.log(`File processed: ${file.filename}, size: ${file.size} bytes`);
      return {
        data: `/uploads/${file.filename}`,
        contentType: file.mimetype
      };
    });

    const newMemory = new Memory({
      name: req.body.name || "Anonymous",
      images,
      message: req.body.message || ""
    });

    await newMemory.save();
    console.log("Memory saved successfully");
    res.status(201).json({ message: "Memory saved!" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Upload failed", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.get("/api/memories", authMiddleware, async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 });
    res.json(memories.map(memory => ({
      _id: memory._id,
      name: memory.name,
      message: memory.message,
      images: memory.images.map(img => ({
        data: img.data,
        contentType: img.contentType
      })),
      createdAt: memory.createdAt
    })));
  } catch (error) {
    console.error("Fetch memories error:", error);
    res.status(500).json({ message: "Error fetching memories" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { 
      expiresIn: "1h" 
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Default admin setup
const createDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ username: "Estrell&Kevin" });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("Kevstrell0613", 10);
      await User.create({
        username: "Estrell&Kevin",
        password: hashedPassword
      });
      console.log("✅ Default admin created");
    }
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};
createDefaultUser();


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));