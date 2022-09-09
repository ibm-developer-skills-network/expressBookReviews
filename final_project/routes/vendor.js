const express = require('express');
const router = express.Router();
const books = require('./booksdb.js');

// Add books
router.post("/",(req,res)=>{
    books.push({"isbn":req.query.isbn,"author":req.query.author,"title":req.query.title,"review":req.query.review});
    res.send("The book with ISBN" + (' ')+ (req.query.isbn) + " has been added!")
}); 


// Update books
router.put("/:isbn", (req, res) => {
    const email = req.params.isbn;
    let filtered_books = books.filter((book) => book.isbn === isbn);
    if (filtered_books.length > 0) {
        let filtered_book = filtered_books[0];
        let author = req.query.author;
        let title = req.query.title;
        let review = req.query.review;

        if(author) {
            filtered_book.author = author
        }
        if(title) {
            filtered_book.title = title
        }
        if(review) {
            filtered_book.review = review
        }

        books = books.filter((book) => book.isbn != isbn);
        books.push(filtered_book);
        res.send(`The book with ISBN  ${isbn} has been updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });


// Delete books
  router.delete("/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    books = books.filter((book) => book.isbn != isbn);
    res.send(`The book with ISBN ${email} has been deleted!`);
  });






module.exports=router;