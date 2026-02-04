/*jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');
const { body, validationResult } = require('express-validator');

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


// Update profile endpoint
router.put('/update', [
    // Task 1: Use the body, validationResult from express-validator for input validation
    body('email', 'Invalid email').isEmail(),
    body('firstName', 'First name is required').notEmpty(),
    // body('lastName', 'Last name is required').notEmpty(), // Assuming lastName is also updated but user requirement specifically mentioned firstName validation style
], async (req, res) => {
    // Task 2: Validate the input using validationResult and return appropriate message if there is an error.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Task 3: Check if email is present in the header and throw an appropriate error message if not present.
        const email = req.headers.email;
        if (!email) {
            logger.error('Email not found in the header');
            return res.status(400).json({ error: 'Email not found in the header' });
        }

        // Task 4: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js` and access users collection.
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Task 5: Find user credentials in database
        const existingUser = await collection.findOne({ email: email });

        if (!existingUser) {
            logger.error('User not found for update');
            return res.status(404).json({ error: 'User not found' });
        }

        // Task 6: Update user credentials in database
        existingUser.firstName = req.body.firstName;
        existingUser.lastName = req.body.lastName; // Assuming we update last name too if provided
        existingUser.updatedAt = new Date();

        // If password is provided, re-hash it
        if (req.body.password) {
            const salt = await bcryptjs.genSalt(10);
            existingUser.password = await bcryptjs.hash(req.body.password, salt);
        }

        await collection.updateOne(
            { email: email },
            { $set: existingUser } // Update the document
        );

        // Task 7: Create JWT authentication with user._id as payload using secret key from .env file
        const payload = {
            user: {
                id: existingUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User updated successfully');
        res.json({ authtoken, userName: existingUser.firstName, email: existingUser.email });

    } catch (error) {
        logger.error('Update error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
