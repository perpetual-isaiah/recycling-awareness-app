const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken'); // JWT auth middleware

// PUT /api/user/location
// Updates the logged-in user's location
router.put('/location', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;  // Extracted from verified JWT token
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    // Update user's location in DB
    const user = await User.findByIdAndUpdate(
      userId,
      { location },
      { new: true }
    ).select('-password'); // Exclude password in response

    res.json({ message: 'Location updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
});

module.exports = router;
