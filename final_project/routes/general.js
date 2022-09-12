const express = require('express');
const router = express.Router();
const books = require('./booksdb.js');


// Get the book list available in the shop
router.get("/",(req,res)=>{
    res.send(books);
});



// Get the based on isbn
router.get("/:isbn",(req,res)=>{
    const isbn = req.params.isbn;
    let filtered_books = books.filter((book) => book.isbn === isbn);
    res.send(filtered_books);
}); 


// Get all books by author
router.get("/:author",(req,res)=>{
    const email = req.params.author;
    let filtered_books = books.filter((book) => book.author === author);
    res.send(filtered_books);
}); 


// Get all books based on title
router.get("/:title",(req,res)=>{
    const email = req.params.title;
    let filtered_books = books.filter((book) => book.title === title);
    res.send(filtered_books);
}); 

//  Get book review
router.get("/:review",(req,res)=>{
    const email = req.params.review;
    let filtered_books = books.filter((book) => book.review === review);
    res.send(filtered_books);
}); 


// Sign in as Customer
router.post("/",(req,res)=>{
    users.push({"firstName":req.query.firstName,"lastName":req.query.lastName,"ph_no":req.query.ph_no,"email":req.query.email});
    res.send("The user /n" + (req.query.firstName) + (req.query.lastName) + "has been added!")
}); 



module.exports=router;