const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./Booksdb.js");
const regd_users = express.Router();

let users = [
    {
        "user_name": "asif",
        "password": "12345"
    }
];
const jwt_Secret = '244d0b97c61cb978567e348a15fc8cd5c3c5791af982ccae88db48383bc3c273';

const isValid = (user_name) => { 
    return true
}

const authenticatedUser = (user_name, password) => { 

    return true
}


regd_users.post("/login", (req, res) => {

    const { user_name, password } = req.body;
    const user = users.find(u => u.user_name === user_name && u.password === password);
    if (user) {
        const userToken= jwt.sign({ user_name: user.user_name }, jwt_Secret, { expiresIn: '1h' });
        res.status(200).json({ userToken});
    } else {
        res.status(401).json({ message: "Invalid user_name or password" });
    }
});


regd_users.put("/auth/userReview/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const userReview = req.query.userReview;
    const userToken= req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, jwt_Secret);
    const user_name = decode.user_name;

    if (books[isbn]) {
        if (!books[isbn].userReviews) {
            books[isbn].userReviews = {};
        }
        books[isbn].userReviews[user_name] = userReview;
        res.status(200).json({ message: "userReview added/updated successfully" });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


regd_users.delete("/auth/userReview/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const userToken= req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, jwt_Secret);
    const user_name = decode.user_name;

    if (books[isbn] && books[isbn].userReviews && books[isbn].userReviews[user_name]) {
        delete books[isbn].userReviews[user_name];
        res.status(200).json({ message: "userReview deleted successfully" });
    } else {
        res.status(404).json({ message: "userReview not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;