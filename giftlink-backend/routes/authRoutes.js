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


// Login endpoint
router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Task 2: Check for user credentials in database
        const theUser = await collection.findOne({ email: req.body.email });

        // Task 3: Check if the user exists
        if (theUser) {
            // Task 4: Check if the user entered password matches the stored encrypyted password and send appropriate message on mismatch
            let result = await bcryptjs.compare(req.body.password, theUser.password);

            if (!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong details' });
            }

            // Task 5: Fetch user details from database
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            const userName = theUser.firstName;
            const userEmail = theUser.email;

            // Task 6: Create JWT authentication if passwords match with user._id as payload
            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User logged in successfully');
            return res.status(200).json({ authtoken, userName, email: userEmail });
        } else {
            // Task 7: Send appropriate message if user not found
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).send('Internal server error');
    }
});


module.exports = router;
