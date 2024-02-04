const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: `User ${username} successfully registered. Now you can login`});
        } else {
            return res.status(404).json({message: `User ${username} already exists!`});
        }
    }
    if (username) {
        return res.status(404).json({message: "Unable to register user. No password specified."});
    }
    if (password) {
        return res.status(404).json({message: "Unable to register user. No username specified."});
    }
});


// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     res.send(JSON.stringify(books, null, 4));
// });

public_users.get('/', async function (req, res) {
    const response = await JSON.stringify(books, null, 4);
    try {
        res.send(response);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    if (!(isbn in books)) {
        return res.status(404).json({"message": `ISBN ${isbn} not found in our collection of books.`});
    }
    try {
        res.send(books[isbn]);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        let booksWithAuthor = {};
        for (let isbn = 1; isbn <= Object.keys(books).length; isbn++) {
            let currBook = books[isbn];
            if (currBook.author === author) {
                booksWithAuthor[isbn] = currBook;
            }
        }
        res.send(JSON.stringify(booksWithAuthor, null, 4));
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        let booksWithTitle = {};
        for (let isbn = 1; isbn <= Object.keys(books).length; isbn++) {
            let currBook = books[isbn];
            if (currBook.title === title) {
                booksWithTitle[isbn] = currBook;
            }
        }
        res.send(JSON.stringify(booksWithTitle, null, 4));
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    res.send(`Reviews for ${book.title} by ${book.author}: ${JSON.stringify(books[isbn].reviews, null, 4)}`);
});

module.exports.general = public_users;
