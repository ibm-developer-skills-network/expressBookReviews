const express = require('express');
const router = express.Router();
const books = require('./booksdb.js');


// Get the book list available in the shop
router.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
 });
 

// Get book details based on ISBN
router.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
    });
    

// Get book details based on author
router.get('/author/:author',function (req, res) {
    a = res.send(JSON.stringify({books}, null, 4));
    JSON.parse(a);
    // const author = req.params.author;
    // a = Object.keys(books).filter(books[key][author] == req.params.author)
    // console.log(a);
});    



// Get all books based on title

router.get('/title/:title',function (req, res) {
    const title = req.params.title;
    var books_based_on_title = JSON.parse(books).filter(function (book) {
        return book.title === req.params.title;
    });

});


//  Get book review

router.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
});


// Sign in as Customer
router.post("/",(req,res)=>{
    users.push({"firstName":req.query.firstName,"lastName":req.query.lastName,"ph_no":req.query.ph_no,"email":req.query.email});
    res.send("The user /n" + (req.query.firstName) + (req.query.lastName) + "has been added!")
}); 


module.exports=router;