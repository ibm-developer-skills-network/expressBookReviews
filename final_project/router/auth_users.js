const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	let userswithsamename = users.filter((user) => {
		return user.username === username
	});
	if (userswithsamename.length > 0) {
		return true;
	} else {
		return false;
	}
}

const authenticatedUser = (username, password) => {
	let validusers = users.filter((user) => {
		return (user.username === username && user.password === password)
	});
	if (validusers.length > 0) {
		return true;
	} else {
		return false;
	}
}

//only registered users can login
regd_users.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({ message: "Error logging in" });
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({
			data: password
		}, 'access', { expiresIn: 60 * 60 });

		req.session.authorization = {
			accessToken, username
		}
		return res.status(200).send("User successfully logged in");
	} else {
		return res.status(208).json({ message: "Invalid Login. Check username and password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const review = req.query.review;

	// Check if the user is authenticated (has a valid session)
	if (!req.session.authorization || !req.session.authorization.username) {
		return res.status(401).json({ message: "Unauthorized. Please log in." });
	}

	// Check if the book with the given ISBN exists in your 'books' object
	if (!books[isbn]) {
		return res.status(404).json({ message: "Book not found." });
	}

	// Add the review to the book object with the username
	books[isbn].reviews = {
		username: req.session.authorization.username,
		text: review,
	};

	return res.status(200).json({ message: "Review added successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;

	// Check if the user is authenticated (has a valid session)
	if (!req.session.authorization || !req.session.authorization.username) {
		return res.status(401).json({ message: "Unauthorized. Please log in." });
	}

	// Check if the book with the given ISBN exists in your 'books' object
	if (!books[isbn]) {
		return res.status(404).json({ message: "Book not found." });
	}

	const usernameToDelete = req.session.authorization.username;
	const reviews = books[isbn].reviews;

	// Find the review associated with the authenticated user
	const reviewToDelete = Object.values(reviews).find(review => review.username === usernameToDelete);

	if (!reviewToDelete) {
		return res.status(404).json({ message: "Review not found for the authenticated user." });
	}

	// Delete the review from the 'reviews' object of the book
	const reviewKeyToDelete = Object.keys(reviews).find(key => reviews[key] === reviewToDelete);
	delete reviews[reviewKeyToDelete];

	return res.status(200).json({ message: "Review deleted successfully." });
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
