const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//function to help register [check if user with same name is registered]
const doesExist = (username)=>{
    let users_same_name = users.filter((user)=>{
      return user.username === username
    });
    if(users_same_name.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN])
 });
  
 //Function to get detailsbased on Author
 function getFromAuthor(author){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let each_book = books[isbn];
        if (each_book.author === author){
          output.push(each_book);
        }
      }
      resolve(output);  
    })
  }
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
const author = req.params.author;
    getFromAuthor(author)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
});

// function to support title task
function getDetailsFromTitle(title){
    let output = []
    return new Promise((resolve,reject)=>{
        for (var isbn in books) {
            let each_book = books[isbn];
            if (each_book.title === title){
                output.push(each_book);
            }
        }
        resolve(output);
    })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;
  getDetailsFromTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

//  Get book review by ISBN
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
