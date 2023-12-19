const express = require('express');
const router = express.Router();

let books = {
      1: { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {} },
      2: { "author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {} },
      3: { "author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": {} },
      4: { "author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": {} },
      5: { "author": "Unknown", "title": "The Book Of Job", "reviews": {} },
      6: { "author": "Unknown", "title": "One Thousand and One Nights", "reviews": {} },
      7: { "author": "Unknown", "title": "Nj\u00e1l's Saga", "reviews": {} },
      8: { "author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {} },
      9: { "author": "Honor\u00e9 de Balzac", "title": "Le P\u00e8re Goriot", "reviews": {} },
      10: { "author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

router.get("/", (req, resp) => {
      resp.send(JSON.stringify(books, null, 4))
})

router.get("/:id", (req, resp) => {
      const isbnId = parseInt(req.params.id);
      if (books[isbnId]) {
            resp.send(JSON.stringify(books[isbnId], null, 4));
      } else {
            resp.status(404).send("Book not found");
      }
});

router.get("/:author/find", (req, resp) => {
      const authorParam = req.params.author;
      const booksByAuthor = Object.values(books).filter(book => book.author === authorParam);
      
      if (booksByAuthor.length > 0) {
          resp.send(JSON.stringify(booksByAuthor, null, 4));
      } else {
          resp.status(404).send("Author not found");
      }
  });

  router.get("/title/:titleName", (req, resp) => {
      const titleParam = req.params.titleName;
      const booksByTitle = Object.values(books).filter(book => book.title === titleParam);
      
      if (booksByTitle.length > 0) {
          resp.send(JSON.stringify(booksByTitle, null, 4));
      } else {
          resp.status(404).send("Author not found");
      }
  });

  router.get("/review/:id", (req, resp) => {
      const reviewParam = parseInt(req.params.id);
      
      if (books[reviewParam]) {
          resp.send(JSON.stringify(books[reviewParam].reviews, null, 4));
      } else {
          resp.status(404).send("Isbn not found");
      }
  });
  
  router.put("/review/:id", (req, resp) => {
      const reviewParam = parseInt(req.params.id);
  
      // Check if the book with the given ISBN exists
      if (books[reviewParam]) {
          // Use a different variable name to avoid conflicts
          let bookToUpdate = books[reviewParam];
          
          // Check if the request body contains the 'reviews' property
          let reviewUpdate = req.body.reviews;
          if (reviewUpdate) {
              // Update the 'reviews' property of the book
              bookToUpdate.reviews = reviewUpdate;
              resp.send(`Review for the book with ISBN ${reviewParam} updated.`);
          } else {
              resp.status(400).send("Invalid request. 'reviews' property is missing in the request body.");
          }
      } else {
          resp.status(404).send("Book with the given ISBN not found.");
      }
  });

  
  router.delete("/review/:id",(req,resp)=>{
      const reviewParam = parseInt(req.params.id);
      if(books[reviewParam]){
            let bookToDelete = books[reviewParam];
            delete bookToDelete.reviews;
            resp.send(`Review for the book with ISBN ${reviewParam} deleted.`);
      }
      else{
            resp.status(404).send("Book with the given ISBN not found.")
      }
  })
  
module.exports = router;
