const express = require('express');
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

// Task 6: Register new user
public_users.post("/register", (req,res) =>{
    const username = req.body.username; // retrieves Username from URL Query
    const password = req.body.password; // retrieves Password from URL Query
    if(username && password){ // Checks for valid credentials, registers the user
        if (!doesExist(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User is now successfully registered. You may now login"});
        } 
        else{
            return res.status(404).json({message: "User already exists! Please try again!"});
        }
    }
    return res.status(404).json({message: "Unable to register user. Unknown error detected."});
});

// Task 1: GET request to retrieve a list of all books available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4))
});
// Task 10: Retrieve a list of all books available in the shop using async-await with Axios
public_users.get("/async", async (req, res) => {
    let response = await axios.get("http://localhost:5000/");
    return res.send(response.data);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get("/async/isbn/:isbn", (req, res) => {
    axios.get("http://localhost:5000/isbn/" + req.params.isbn)
        .then((response) => {return res.status(200).json(response.data);})
        .catch((err) => {return res.send(err);});
});

// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const a_author = req.params.author;
    const b_authors = Object.entries(books);
    const filtered_books = [];
    for (const [key, c_author] of b_authors){
        if(c_author.author === a_author){filtered_books.push(c_author);}}
    res.send(filtered_books);
});
//Task 12: Get book details based on author using async-await with Axios
public_users.get("/async/author/:author", async (req, res) => {
    let response = await axios.get("http://localhost:5000/author/" + req.params.author);
    return res.status(200).json(response.data);
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const a_title = req.params.title;
    const b_titles = Object.entries(books);
    const filtered_books = [];
    for (const [key, c_title] of b_titles){
        if(c_title.title === a_title){filtered_books.push(c_title);}}
    res.send(filtered_books);
});
//Task 13: Get all books based on title using async-await with Axios
public_users.get("/async/title/:title", async (req, res) => {
    let response = await axios.get("http://localhost:5000/title/" + req.params.title);
    return res.status(200).json(response.data)});

//  Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;