const cloudinary = require("cloudinary")
// Cloudinary configuration
cloudinary.config({
    cloud_name: 'your-cloud-name',
    api_key: 'your-api-key',
    api_secret: 'your-api-secret',
});

module.exports = cloudinary;