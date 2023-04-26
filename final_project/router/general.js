const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;//das will es nicht übergeben!!!!!
    const password = req.body.password;
    const doesExist = (username) => { let does = users.filter((user) => {
              return user.username === username}
            );
            if (does.length > 0) {return true} else {return false};
        };
    if(!username||!password) {
        res.status(404).send("Invalid Input. Username and password needed.")
    };
        if (!doesExist(username)) {
            users.push({"username":username,"password":password});
            res.status(200).send({message:"User "+username+" has been added."});
        } else if 
        (doesExist(username)) {
            res.status(404).send("User "+ username+" already exists.")         
        }
        
});
 
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));  
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;
    let result = []
    for (key in books) { //hier gehe ich durch alle elemente in books
        let book = books[key]; // book ist ein sub JSON/array an der Stelle key
        if (book.author === author){
            result.push(book); // hier pushe ich den inhalt von book in das result
        }
    }    
    res.send(JSON.stringify(result,null,4));
    //res.send(JSON.stringify(books[key],null,4));
    
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let result = []
    for (key in books) { //hier gehe ich durch alle elemente in books
        let book = books[key]; // book ist ein sub JSON/array an der Stelle key
        if (book.title === title){
            result.push(book); // hier pushe ich den inhalt von book in das result
        }
    }    
    res.send(JSON.stringify(result,null,4));
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   let isbn = req.params.isbn;
   //let book = books[isbn];
   res.send(JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;