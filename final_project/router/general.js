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
  //Write your code here
  const username = req.body.username;
  const password= req.body.password;
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
    setTimeout(() => {
        resolve("Promise resolved")
    },6000)})
    
    myPromise.then((successMessage) => {
        console.log("callback " + successMessage)
        res.send(JSON.stringify({books},null, 4));
    })

  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise resolved")
    },6000)})
    
    myPromise.then((successMessage) => {
        console.log("callback " + successMessage)
        let isbn = req.params.isbn;
        res.send(books[isbn]);

    })

    console.log("After calling promise");
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise resolved ")
    },6000)})
    

    myPromise.then((successMessage) => {
        console.log("callback " + successMessage)
        let author = req.params.author;
        for(var i in books)
        {
                let details = books[i];
                if(details)
                {
                    if(author === details["author"])
                    {
                        res.send(books[i]);
                    }
                }
        }

    })

 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Promise resolved in getting book details based on title")
    },6000)})
    
    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
        let title = req.params.title;
        for(var i in books)
        {
              let details = books[i];
              if(details)
              {
                  if(title === details["title"])
                  {
                      res.send(books[i]);
                  }
              }
        }
    })

    //Console log after calling the promise
    console.log("After calling promise");
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let review = books[isbn]["reviews"];
  res.send(JSON.stringify({review}, null,4));
});

module.exports.general = public_users;