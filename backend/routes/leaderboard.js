const express = require('express');
const router = express.Router();
const User = require('../models/user');
const History = require('../models/history');

// Create sample users (for initial setup)
router.get('/users/setup', async (req, res) => {
    const sampleUsers = ['Rahul', 'Kamal', 'Sanaki', 'Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Fay', 'Grace'];

    try {
        const existingUsers = await User.find();
        if (existingUsers.length === 0) {
            await User.insertMany(sampleUsers.map(name => ({ name })));
            res.json({ message: 'Sample users created' });
        } else {
            res.json({ message: 'Users already exist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating users', error });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Claim random points (1-10) for a user
router.post('/claim/:userId', async (req, res) => {
    const { userId } = req.params;
    const randomPoints = Math.floor(Math.random() * 10) + 1; // 1 to 10 points

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's total points
        user.totalPoints += randomPoints;
        await user.save();

        // Record the points in history
        await History.create({
            userId: user._id,
            points: randomPoints,
        });

        res.json({ points: randomPoints, totalPoints: user.totalPoints });
    } catch (error) {
        res.status(500).json({ message: 'Error claiming points', error });
    }
});

// Get leaderboard (sorted by total points in descending order)
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ totalPoints: -1 });
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leaderboard', error });
    }
});

// Get claim history
router.get('/history', async (req, res) => {
    try {
        const history = await History.find().populate('userId', 'name').sort({ claimedAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching claim history', error });
    }
});

module.exports = router;
