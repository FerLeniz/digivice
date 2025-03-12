const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: { type: String }, // For secure JWT refresh token storage
    likedCards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DigimonCard' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
