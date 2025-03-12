const User = require('../models/User');
const bcrypt = require('bcryptjs'); // For password comparison
const jwt = require('jsonwebtoken'); // For authentication token
const mongoose = require('mongoose');
const Card = require('../models/cardModel');

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in HTTP-only cookie
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        // Remove password before sending response
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({ message: 'SignIn successful', user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};


const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const logout = (req, res) => {
  res.cookie('token', '', { 
    httpOnly: true, 
    expires: new Date(0), // Expire immediately
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  });

  res.status(200).json({ message: 'Logged out successfully' });
};


const likeCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: 'Invalid card ID' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.likedCards.findIndex(id => id.toString() === cardId);

    if (index === -1) {
      user.likedCards.push(cardId);
    } else {
      user.likedCards.splice(index, 1);
    }

    await user.save();
    res.json({ likedCards: user.likedCards });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getLikedCards = async (req, res) => {
  try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const likedCards = await Card.find({ _id: { $in: user.likedCards } });

      res.json({ likedCards });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
};

  const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

  
  module.exports = { signIn, signUp, likeCard, getLikedCards, getCurrentUser, logout };

