const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3019;

const app = express();

app.use(express.static(path.join(__dirname))); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UserData', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB successfully!');
});

// Define schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    city: String,
    state: String,
    zip: String,
    comments: String,
    gender: String,
    dob: String
});

const User = mongoose.model('User', userSchema);

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/post', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, city, state, zip, comments, gender, dob } = req.body;

        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            city,
            state,
            zip,
            comments,
            gender,
            dob
        });

        await newUser.save(); // Save to MongoDB
        console.log('User saved:', newUser);
        res.status(200).send('Form submission successful!');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Error saving user data');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

