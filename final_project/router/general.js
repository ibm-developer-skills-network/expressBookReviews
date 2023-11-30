const express = require('express');
let Books = require("./Booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    //Write your code here
    const { user_name, password } = req.body;
    if (!user_name || !password) {
        return res.status(400).send({ message: "user_name and password are required" });
    }
    const existingUser = users.find(user => user.user_name === user_name);
    if (existingUser) {
        return res.status(400).send({ message: "user_name already exists" });
    }
    users.push({ user_name, password });
    res.status(200).send({ message: "User registered successfully" });
});

public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('URL');
        const Books = response.data;
        res.status(200).json(Books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Books", error: error.message });
    }
});

public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`URL/${isbn}`); 
        const book = response.data;
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`URL/${author}`);
        const BooksByAuthor = response.data;
        res.status(200).json(BooksByAuthor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Books by author", error: error.message });
    }
});

public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`URL/${title}`);
        const BooksByTitle = response.data;
        res.status(200).json(BooksByTitle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Books by title", error: error.message });
    }
});


public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;
    const book = Books[isbn];
    if (book) {
        res.status(200).send(book.reviews);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

module.exports.general = public_users;