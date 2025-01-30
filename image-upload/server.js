// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('./cloudinary')
// Create Express app
const app = express();
const streamifier = require('streamifier')
// Set up multer for image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = './uploads';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     cb(null, dir); // Save images in 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
//   }
// });

const storage = multer.memoryStorage()
const upload = multer({ storage });

// Middleware to serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Serve the HTML file
app.use(express.static('public'));



// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }

  // Upload to Cloudinary using a stream
  const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'uploads' }, // Optional: Save in a specific folder
      (error, result) => {
          if (error) {
              console.error('Error uploading to Cloudinary:', error);
              return res.status(500).send('Upload failed.');
          }
          res.send(`Image uploaded successfully: ${result.secure_url}`);
      }
  );

  // Pipe the file buffer to the upload stream
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});
// Handle image upload via POST request
// app.post('/upload', upload.single('image'), (req, res) => {
//   if (req.file) {
//     res.json({
//       message: 'Image uploaded successfully',
//       imageUrl: `/uploads/${req.file.filename}`
//     });
//   } else {
//     res.status(400).send('No file uploaded');
//   }
// });

// Start server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});