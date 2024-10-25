const express = require('express');
const path = require("path");
const bcrypt = require('bcrypt'); 
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ZeroHunger', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error));

// Define donor schema and model
const donorSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    address: String,
    foodType: String,
    quantity: Number,
    location: String,
    password: String
});

// Define user schema and model
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
});

const Donor = mongoose.model('Donor', donorSchema);

// Routes
app.get('/', async (req, res) => { 
    try {
        // Fetch donor data from MongoDB
        const donors = await Donor.find();
        // Render 'index.ejs' and pass the donors data to be displayed
        res.render('index', { donors });
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).send('Error loading donors');
    }
});

app.get('/about', (req, res) => { 
    res.send("About page"); 
});

app.get('/donate', (req, res) => { 
    res.render('donate'); 
});

app.get('/login', (req, res) => { 
    res.render('login'); 
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        
        // Verify the password
        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).send({ message: 'Login successful!' });
        } else {
            res.status(401).send({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Login failed. Try again later.' });
    }
});

app.get('/register', (req, res) => { 
    res.render('register'); 
});

// POST route for donor registration
app.post('/register-donor', async (req, res) => {
    const { fullName, email, phone, address, foodType, quantity, location, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = new Donor({ fullName, email, phone, address, foodType, quantity, location, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).send({ error: 'Failed to register user' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
