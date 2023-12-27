const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password){
        if (!isValid(username)){
            users.push({"username":username,"password":password})
            return res.status(404).json({message: "Customer Successfully registered. Now you can login!"});
        }
        else{
            return res.status(404).json({message: "User already exists!"});
        }
    }
    else{
        return res.status(404).json({message: "Unable to register user."});
    }
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise Resolved. Getting books details")
    },3000)})

    myPromise.then((successMessage) => {
        console.log("From Callback : " + successMessage)
        res.send(JSON.stringify(books))
    })   
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise Resolved. Getting book details for the requested isbn")
    },3000)})

    myPromise.then((successMessage) => {
        console.log("From Callback : " + successMessage)
        const isbn = req.params.isbn;
        res.send(books[isbn])
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise Resolved. Fetching book details wriiten by the requested author")
    },3000)})

    myPromise.then((successMessage) => {
        console.log("From Callback : " + successMessage)
        const requestedauthor = req.params.author;
        const bookslist = Object.values(books).filter((book) => book.author === requestedauthor);
        if (bookslist.length>0){
            res.send(JSON.stringify(bookslist))
        }
        else{
        return res.status(404).json({message: "Requested author not available"});
        }
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise Resolved. Fetching book details with the requested title")
    },3000)})

    myPromise.then((successMessage) => {
        console.log("From Callback : " + successMessage)
        const requestedtitle = req.params.title;
        const bookbytitle = Object.values(books);
        let filtered_value = bookbytitle.filter((book)=>book.title===requestedtitle);
        if (filtered_value.length>0){
            res.send(JSON.stringify(filtered_value))
        }
        else{
        return res.status(404).json({message: "Book with requested title is not available"});
        }
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = Object.values(books).find(book=>book.isbn==isbn);
    if (book){
        res.send(JSON.stringify(book.review))
    }
    else{
        return res.status(404).json({message: "No reviews available for the books with requested isbn"});
    }

});

module.exports.general = public_users;

