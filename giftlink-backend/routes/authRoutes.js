/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');

// Create Pino logger instance
const logger = pino();

// Load environment variables
dotenv.config();

// Create JWT authentication using secret key from .env file
const JWT_SECRET = process.env.JWT_SECRET;


// Register endpoint
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access the users collection
        const collection = db.collection('users');

        // Task 3: Check for existing email ID
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            logger.error('Email already exists');
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Task 4: Hash the password using bcryptjs
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);

        // Task 5: Save user details in the database
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            createdAt: new Date()
        };

        const result = await collection.insertOne(newUser);

        // Task 6: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: result.insertedId
            }
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.status(201).json({ authtoken, email: newUser.email });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
