const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
 
public_users.post("/register", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;
 
    if(username && password) 
    {
        if (!isValid(username)) 
        { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: `You have successfully registered, ${username}! Now you can login.`});
        } 
        else 
        {
            return res.status(404).json({message: "That username already exists!"});    
        }
    } 
    return res.status(404).json({message: "Registration failied: Invalid username or password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  ///////////////
 
    let listPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve("Promise resolved")
        },3000)});

        listPromise.then(() => {
        return res.status(200).json({books});
    })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let isbnPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve("Promise resolved")
        },3000)});

    isbnPromise.then(() => {
        if( books.hasOwnProperty(isbn) )
        {
            return res.status(200).json(books[isbn]);
        }
        return res.status(300).json({message: "Are you crazy? That Book does not exist!"});
    })

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) 
{
    let authorPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve("Promise resolved")
        },3000)});

    authorPromise.then(() => {
        const author = req.params.author;
        const booksByAuthor = Object.values(books).filter(value => value.author===author);
        
        if(!booksByAuthor.length) return res.status(300).json({message:"We don't have that book. Now get out!"});
        return res.status(200).json({booksByAuthor});
        });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
    let titlePromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve("Promise resolved")
        },3000)});

    titlePromise.then(() => {
        const title = req.params.title;
        const booksByTitle = Object.values(books).filter(value => value.title===title);
        
        if(!booksByTitle.length) return res.status(300).json({message:"We don't have that book. Now get out!"});
        return res.status(200).json({booksByTitle});

    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) 
{
    const isbn = req.params.isbn;
    if( books.hasOwnProperty(isbn) )
    {
        return res.status(200).json({ Title: books[isbn].title, reviews:books[isbn].reviews });
    }
    return res.status(300).json({message:"We don't have that book. Now get out!"});
});

module.exports.general = public_users;
