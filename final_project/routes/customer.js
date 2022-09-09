const express = require('express');
const router = express.Router();
const books = require('./booksdb.js');

// Buy a book
// router.post("/",(req,res)=>{
//     users.push({"firstName":req.query.firstName,"lastName":req.query.lastName,"ph_no":req.query.ph_no,"email":req.query.email});
//     res.send("The user + (' ')+ (req.query.firstName) + (req.query.lastName) +" has been added!")
// }); 


// Add a book review
router.put("/:isbn", (req, res) => {
    const email = req.params.isbn;
    let filtered_books = books.filter((book) => book.isbn === isbn);
    if (filtered_books.length > 0) {
        let filtered_book = filtered_books[0];
        let review = req.query.review;

        if(review) {
            filtered_book.review = review
        }

        books = books.filter((book) => book.isbn != isbn);
        books.push(filtered_book);
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });



module.exports=router;