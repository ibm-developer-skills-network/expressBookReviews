const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here Async
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

public_users.get("/", async (req,res) => {
    try {
        const booklist = await books;
        res.send(JSON.stringify(booklist, null, 4));
        } catch (error) {
            res.status(500).send(error);
        }
    });

public_users.get("/isbn/:isbn", async (req,res) => {
    let isbn= req.params.isbn;
    try {
        const book = await books[isbn];
        res.send(JSON.stringify(book, null, 4));
        } catch (error) {
            res.status(500).send(error);
        }
    });

public_users.get("/author/:author", async (req,res) => {
    let author = req.params.author;
    let result = []
    try {    
        for (key in books) { //hier gehe ich durch alle elemente in books
            let book = books[key]; // book ist ein sub JSON/array an der Stelle key
            if (book.author === author){
                result.push(book); // hier pushe ich den inhalt von book in das result
            }
        }
            res.send(JSON.stringify(result,null,4));
        
        } catch (error) {
            res.status(500).send(error);
        }
    });

public_users.get("/title/:title", async (req,res) => {
    let title = req.params.title;
    let result = [];
    try {
        for (key in books) { //hier gehe ich durch alle elemente in books
            let book = books[key]; // book ist ein sub JSON/array an der Stelle key
               if (book.title === title) {
                result.push(book); // hier pushe ich den inhalt von book in das result
                res.send(JSON.stringify(result,null,4)); 
                }
            }
         } catch (error) {res.status(500).send(error);

    }
        
    });

/*
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

public_users.put("/review/:isbn", (req, res) => {
      //Write your code here
        //You have to give a review as a request query & it must get posted with the username (stored in the session) posted.
        let isbn = req.params.isbn;
        let book = books[isbn];
        //erstmal eine Review posten
        if (book) {
            let username = req.body.username;
            let review = req.body.review;

            if (review) {  
                if (!book.reviews[username]) {
                    book.reviews[username] = {text:review};
                } else if (book.reviews[username]) {
                    book.reviews[username].text=review;
                }
            //res.status(200).send("Review added");
            }
        
        }
        
        res.send(JSON.stringify(books[isbn],null,4))
    });
    */

module.exports.general = public_users;