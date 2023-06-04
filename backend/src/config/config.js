const path = require('path');

require('dotenv-safe').config({
  allowEmptyValues: true,
  example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  mongoURI: process.env.MONGO_URI,
  Role: {
    Admin: "admin",
    Owner: "owner",
    Regular: "regular"
  }
};
