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
    //Write your code here
    let myPromise = new Promise(function(myResolve, myReject) {
        // "Producing Code" (May take some time)
        const booksToReturn = JSON.stringify(books);
        if(booksToReturn) {
            myResolve(booksToReturn);
        } else {
            myReject("There is no book in the library!");
        } 
          
    });        
    
    myPromise.then(
        function(value) { return res.send(value) },
        function(error) { return res.send(error) }
    );
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    let myPromise = new Promise(function(myResolve, myReject) {   
        const singlebook = ((books, req) => {        
            for(var keys in books){
                if(books[keys].isbn === req.params.isbn){                
                    return books[keys];
                }
            }
        });
        const bookToReturn = singlebook(books, req);

        if(!book.isEmpty()){
            myResolve(JSON.stringify(bookToReturn));

        } else {
            myReject("There is no book in the library with this ISBN");
        }
    });

    myPromise.then(
        function(value) { return res.send(value) },
        function(error) { return res.send(error) }
    );
    
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const booksToDisplay = ((books, req) => {
        let booksToDisplay = [];
        for(var keys in books){
            if(books[keys].author === req.params.author){                
                booksToDisplay.push(books[keys]);
            }
        }
        return booksToDisplay;
    });

    return res.send(booksToDisplay(books, req));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const booksToDisplay = ((books, req) => {
        let booksToDisplay = [];
        for(var keys in books){
            if(books[keys].title === req.params.title){                
                booksToDisplay.push(books[keys]);
            }
        }
        return booksToDisplay;
    });

    return res.send(booksToDisplay(books, req));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const reviewsToDisplay = ((books, req) => {    
        for(var keys in books){
            if(books[keys].isbn === req.params.isbn){                
                return {"isbn":req.params.isbn, "reviews":books[keys].reviews};
            }
        }    
    });

return res.send(JSON.stringify(reviewsToDisplay(books, req)));
});

module.exports.general = public_users;
