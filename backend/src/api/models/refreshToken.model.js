const mongoose = require('mongoose');
const crypto = require('crypto');
const moment = require('moment-timezone');

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  token: String,
  userEmail: { type: 'String', ref: 'User' },
  expires: { type: Date },
});

refreshTokenSchema.statics = {
  generate(user) {
    const userId = user._id;
    const userEmail = user.email;

    const token = `${userId}.${crypto.randomBytes(40).toString('hex')}`;
    const expires = moment().add(30, 'days').toDate();

    const tokenObject = new RefreshToken({
      token, userId, userEmail, expires,
    });
    tokenObject.save();
    return tokenObject;
  },

};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
