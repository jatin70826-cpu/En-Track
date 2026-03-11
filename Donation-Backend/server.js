// server.js

//  Modules Import
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const crypto = require("crypto");   // Crypto module for hashing
require("dotenv").config();

//  Express App Setup
const app = express();
const PORT = 5000;

//  Middleware
app.use(cors());
app.use(express.json());

//  MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "xlad@1290",
    database: process.env.DB_NAME || "donation_db"
});

//  Connection Check
db.connect((err) => {
    if (err) {
        console.log("Database connection failed ", err);
    } else {
        console.log("Database connected ");
    }
});

//  Test Route
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

//  User Registration API
app.post("/api/users/register", (req, res) => {
    const { name, email, password } = req.body;
    // hash the password
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, passwordHash], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "User registered successfully", userId: result.insertId });
    });
});

// User Login API
app.post("/api/users/login", (req, res) => {
    const { email, password } = req.body;
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, passwordHash], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length > 0) {
            res.json({ message: "Login successful", userId: results[0].id });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

//  NGO Add API
app.post("/api/ngos/add", (req, res) => {
    const { name, description } = req.body;
    const query = "INSERT INTO ngos (name, description) VALUES (?, ?)";
    db.query(query, [name, description], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "NGO added successfully", ngoId: result.insertId });
    });
});

// Donation Add API with Hashing
app.post("/api/donations/add", (req, res) => {
    const { user_id, ngo_id, amount } = req.body;

    //  Current date/time in MySQL DATETIME format
    const donationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //  Generate SHA-256 hash
    const data = `${user_id}${ngo_id}${amount}${donationDate}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');

    //  Insert donation + hash into DB
    const query = "INSERT INTO donations (user_id, ngo_id, amount, donation_date, hash) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [user_id, ngo_id, amount, donationDate, hash], (err, result) => {
        if (err) {
            console.log("DB ERROR:", err); // full DB error
            return res.status(500).json({ error: "Database error" });
        }
        console.log("Donation Hash:", hash); // optional log
        res.json({
            message: "Donation recorded successfully",
            donationId: result.insertId,
            hash: hash
        });
    });
});

// Blood_donation API
app.post("/api/blood-donation", (req, res) => {
    console.log("Blood Donation Request Body:", req.body);
    const { blood_group, state, city, name, contact, message } = req.body;
    db.query(
        "INSERT INTO blood_donations (blood_group, state, city, name, contact, message) VALUES (?, ?, ?, ?, ?, ?)",
        [blood_group, state, city, name, contact, message],
        (err, result) => {
            if (err) {
                console.log("Blood Donation DB Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true });
        }
    );
});

// Organ_donation API
app.post("/api/organ-donation", (req, res) => {
    console.log("Organ Donation Request Body:", req.body);
    const { full_name, age, phone, email, city, state, organ_to_donate } = req.body;
    db.query(
        "INSERT INTO organ_donations (full_name, age, phone, email, city, state, organ_to_donate) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [full_name, age, phone, email, city, state, organ_to_donate],
        (err, result) => {
            if (err) {
                console.log("Organ Donation DB Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true });
        }
    );
});

// Stationary Donation API
app.post("/api/stationary-donation", (req, res) => {
    console.log("Stationery Donation Request Body:", req.body);
    const { items, quantity, condition_type, preferred_school, pickup_address, name, contact } = req.body;
    db.query(
        "INSERT INTO stationary_donations (items, quantity, condition_type, preferred_school, pickup_address, name, contact) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [items, quantity, condition_type, preferred_school, pickup_address, name, contact],
        (err, result) => {
            if (err) {
                console.log("Stationery Donation DB Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true });
        }
    );
});

// Clothes Donation API
app.post("/api/clothes-donation", (req, res) => {
    console.log("Clothes Donation Request Body:", req.body);
    const { clothing_type, approx_items, size_range, condition_type, pickup_address, name, contact } = req.body;
    db.query(
        "INSERT INTO clothes_donations (clothing_type, approx_items, size_range, condition_type, pickup_address, name, contact) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [clothing_type, approx_items, size_range, condition_type, pickup_address, name, contact],
        (err, result) => {
            if (err) {
                console.log("Clothes Donation DB Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true });
        }
    );
});

// Electronics Donation API
app.post("/api/electronics-donation", (req, res) => {
    console.log("Electronics Donation Request Body:", req.body);
    const { device_type, brand_model, condition_type, working_status, pickup_address, name, contact } = req.body;
    db.query(
        "INSERT INTO electronics_donations (device_type, brand_model, condition_type, working_status, pickup_address, name, contact) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [device_type, brand_model, condition_type, working_status, pickup_address, name, contact],
        (err, result) => {
            if (err) {
                console.log("Electronics Donation DB Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true });
        }
    );
});


//  Start Server
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;