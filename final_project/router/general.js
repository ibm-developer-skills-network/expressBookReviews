const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

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
    const filePath = path.join(__dirname, 'asyncbooksdb.json');
    try { 
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const books = JSON.parse(fileContent).books;
        res.send(JSON.stringify(books, null, 4));
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const filePath = path.join(__dirname, 'asyncbooksdb.json');
    try { 
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const books = JSON.parse(fileContent).books;
        const bookWithISBN = books.filter(book => book.isbn === isbn);
        res.send(JSON.stringify(bookWithISBN));
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    const filePath = path.join(__dirname, 'asyncbooksdb.json');
    try { 
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const books = JSON.parse(fileContent).books;
        const booksWithAuthor = books.filter(book => book.author === author);
        res.send(JSON.stringify(booksWithAuthor));
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    const filePath = path.join(__dirname, 'asyncbooksdb.json');
    try { 
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const books = JSON.parse(fileContent).books;
        const booksWithTitle = books.filter(book => book.title === title);
        res.send(JSON.stringify(booksWithTitle));
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
