const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!(username && password)) return res.status(404).json({message: "Unable to register user"});
    if(isValid(username)) return res.status(404).json({message: "User is already registered!"});
    
    users.push({"username":username,"password":password})
    return res.status(200).send("User successfully registered!")
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    async function getData() {
        let promise= new Promise((resolve,reject) => {
            setTimeout(() => {
              resolve(res.status(300).json(books))
            },2000)
        });
        
        await promise;
    }
    getData();
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    async function getData() {
        let promise= new Promise((resolve,reject) => {
            setTimeout(() => {
              resolve(res.status(300).json(books[isbn]))
            },2000)
        });
        
        await promise;
    }
    getData();
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    async function getData() {
        let promise= new Promise((resolve,reject) => {
            setTimeout(() => {
              resolve(res.status(300).send(Object.values(books).filter(book => book["author"] === author)))
            },2000)
        });
        await promise;
    }
    getData();
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    async function getData() {
        let promise= new Promise((resolve,reject) => {
            setTimeout(() => {
              resolve(res.status(300).send(Object.values(books).filter(book => book["title"] === title)))
            },2000)
        });
        await promise;
    }
    getData();
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    async function getData() {
        let promise= new Promise((resolve,reject) => {
            setTimeout(() => {
              resolve(res.status(300).json(books[isbn]["reviews"], null, 0))
            },2000)
        });
        await promise;
    }
    getData();
});

module.exports.general = public_users;
