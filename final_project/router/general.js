const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username_input = req.body.username;
    const password_input = req.body.password;
    if(username_input && password_input){
      if(!isValid(username_input)){
        users.push({"username": username_input, "password": password_input});
        return res.status(200).json({message: "User successfully registered"});
      }
      else{
        return res.status(404).json({ message: "User existed!"});
      }
    }
    return res.status(404).json({ message: "Unable to register user(check username and password input)"});
  });


function getBooks(){
    return new Promise((resolve, reject) =>{
        resolve(books)
    })    
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks().then(
        (books) => res.send(JSON.stringify(books, null, 4)),
        (error) => res.send("get books function error")
    )
});

function getIsbn(isbn){
    let filtered_books = books.filter((book) => book.isbn === isbn)
    return new Promise((resolve, reject) =>{
        if(filtered_books.length > 0){
            resolve(filtered_books[0]);
        }
        else{
            reject(`Book with ISBN ${isbn} not found`);
        }
    })
    
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    getIsbn().then((
        (book) => res.send(JSON.stringify(book, null, 4)),
        (error) = res.send(error)
    ));
});

function getAuthor(author){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_target = books[isbn];
        if (book_target.author === author){
          output.push(book_target);
        }
      }
      if(output.length > 0){
        resolve(output);  
      }
      else{
        reject(`Books with author ${author} does not exist`);
      }
    })
} 

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    getAuthor(author).then((
        (book) => res.send(JSON.stringify(book, null, 4)),
        (error) => res.send(error)
    ));
});

function getTitle(title){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let book_target = books[isbn];
        if (book_target.title === title){
          output.push(book_target);
        }
      }
      if(output.length > 0){
        resolve(output);  
      }
      else{
        reject(`Books with title ${title} does not exist`);
      }
    })
} 

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    getTitle(title).then((
        (book) => res.send(JSON.stringify(book, null, 4)),
        (error) => res.send(error)
    ));
});

//  Get book review

function getReview(isbn){
    return new Promise((resolve, reject) =>{
        resolve(books[isbn.reviews])
    })
}

public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getReview(isbn).then(
        (review) => res.send(review),
        (error) => res.send("Retreiving review error")
    )
  });

module.exports.general = public_users;
