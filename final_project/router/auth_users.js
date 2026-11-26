const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require("express-session")
const regd_users = express.Router();

let users = {};

// Middleware for session handling
regd_users.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }))

const isValid = (username) => {
    return users.hasOwnProperty(username);
}

const authenticatedUser = (username, password) => {
    return users[username] && users[username].password === password;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Validate Input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and Password are required!" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT token
        const accessToken = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });

        // Store access token in session
        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).json({ message: "✅ Login Successfully!" });
    } else {
        return res.status(401).json({ message: "Invalid Username or Password!" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;

    // Check if the user is authenticated
    if (!req.session || !req.session.authorization) {
        return res.status(401).json({ message: "Unauthorized. Please login to add or modify a review." });
    }

    // Retrieve username from the session
    const username = req.session.authorization.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added / updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Check if the user is authenticated
    if (!req.session || !req.session.authorization) {
        return res.status(401).json({ message: "Unauthorized. Please login to delete a review." });
    }

    // Retrieve username from the session
    const username = req.session.authorization.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if reviews exist and if the user has a review for the book
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
