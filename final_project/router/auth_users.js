const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "username": "gabriel",
    "password": "123"
}];

const isValid = (username) => { //returns boolean
    return username.trim() !== '';
}

const authenticatedUser = (username, password) => { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });

    return !!validusers.length
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'your-secret-key', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username
    const review = req.body.review
    const isbn = req.params.isbn

    const book = books[isbn]

    let bookReviews = book.reviews

    const newReview = { "review": review }

    bookReviews = { ...bookReviews, [username]: newReview }

    books[isbn].reviews = bookReviews

    return res.status(200).json(books[isbn]);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username
    const isbn = req.params.isbn
    const book = books[isbn]

    let bookReviews = book.reviews
    delete bookReviews[username]

    return res.status(200).json(book);
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
