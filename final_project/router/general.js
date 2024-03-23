const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let userNameExists = require("./auth_users.js").userNameExists;

let users = require("./auth_users.js").users;
const tools = require("../utils.js");
const {getBookByField} = tools;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if(!isValid(username)){
    return res.status(400).json({message: "Invalid username"});
  }
  if(!isValid(password)){
    return res.status(400).json({message: "Invalid password"});
  }
  if(userNameExists(username)){
    return res.status(400).json({message: "User exists"});
  }
  users.push({
    username,
    password
  })
  return res.status(201).json({message: "User created"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
   const booksList = await getBooks();
  return res.status(200).json({message: "success",books:JSON.stringify(books)});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const bookFound = books[isbn];
  getBookDetails(bookFound).then(bookDetails=>{
      return res.status(200).json({message: `Book with the isbn ${isbn} found`,book:bookDetails});  
  }).catch(()=>{
    return res.status(500).json({message: `Error found book`,});  
  });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookFound = getBookByField('author',author);
    getBookDetails(bookFound).then(bookDetails=>{
        return res.status(200).json({message: `Book from author ${author} found`,book:bookDetails});  

    }).catch(()=>{
      return res.status(500).json({message: `Error found book`,});  
    });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookFound = getBookByField('title',title);
    getBookDetails(bookFound).then(bookDetails=>{
        return res.status(200).json({message: `Book with title ${title} found`,book:bookDetails});

    }).catch(()=>{
      return res.status(500).json({message: `Error found book`,});  
    });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const bookFound = books[isbn];
  if(!bookFound){
    return res.status(404).json({message: `Book with the isbn ${isbn} not found`});  
  }
  const reviews = bookFound.reviews;
  return res.status(200).json({message: `Book with the isbn ${isbn} found`,reviews:JSON.stringify(reviews)});  
});

function getBooks(){
    return new Promise((resolve, reject) => {
        try {
          resolve(JSON.stringify(books));
        } catch (error) {
          reject(error);
        }
      });
}

function getBookDetails(bookFound){
    return new Promise((resolve, reject) => {
        try {
            if(!bookFound){
                reject({ message: `Book with the isbn ${isbn} not found` });
            }
            resolve(JSON.stringify(bookFound))
          
        } catch (error) {
          reject(error);
        }
      });
}
module.exports.general = public_users;
