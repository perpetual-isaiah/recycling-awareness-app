const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const verifyToken = require('../middleware/verifyToken');

// ✅ Create a new challenge
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const challenge = new Challenge({
      title,
      description,
      createdBy: req.user.id,
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating challenge',
      error: error.message,
    });
  }
});

// ✅ Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    res.json(challenges);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching challenges',
      error: error.message,
    });
  }
});

// ✅ Get one challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email');

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching challenge details',
      error: error.message,
    });
  }
});

// ✅ Join a challenge
router.post('/:id/join', verifyToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (challenge.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    challenge.participants.push(req.user.id);
    await challenge.save();

    res.json({ message: 'Joined the challenge', challenge });
  } catch (error) {
    res.status(500).json({
      message: 'Error joining challenge',
      error: error.message,
    });
  }
});

module.exports = router;
