const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
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
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        resolve(books)
    })
    myPromise.then((successMessage) => {
        return res.send(JSON.stringify(successMessage));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        resolve(books[req.params.isbn])
    })
    myPromise.then((successMessage) => {
        return res.send(JSON.stringify(successMessage));
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  if(req.params.author)
  {
    let myPromise = new Promise((resolve,reject) => {
        let keys = Object.keys(books);
        
        for (key in keys) {
            let element = books[parseInt(key)+1];
            if(element.author == req.params.author)
                resolve(element) 
        }
    })
    myPromise.then((successMessage) => {
        res.send(JSON.stringify(successMessage));
    })
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    if(req.params.title)
    {
        let myPromise = new Promise((resolve,reject) => {
            let keys = Object.keys(books);
            
            for (key in keys) {
                let element = books[parseInt(key)+1];
                if(element.title == req.params.title)
                    resolve(element) 
            }
        })
        myPromise.then((successMessage) => {
            res.send(JSON.stringify(successMessage));
        })
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
