const express = require('express');

const router = express.Router();

var books = {
    "isbn1":{"title":"See with C","author":"Bryan"},
    "isbn2":{"title":"See with C#","author":"Barry"},
    "isbn3":{"title":"See with Go","author":"Beth"},
    "isbn4":{"title":"See with C++","author":"Bruce"},
};


router.get('/',function (req, res) {

    res.send(JSON.stringify({books}, null, 4));
     
});
     

router.get('/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
    
});
    

router.post("/",function (req,res){
   
    if (req.body.isbn){
        books[req.body.isbn] = {
            "title":req.body.title,
            "author":req.body.author,
    
            }
    }
    
res.send("The book with title" + (' ')+ (req.body.title) + " has been added!");
});

  
router.put("/:isbn", function (req, res) {
    const isbn = req.params.isbn;
   
    book = books[isbn] 
   
    if (book) {
        
        let title = req.body.title;
        let author = req.body.author;
        if(title) {
            book["title"] = title
        }
        if(author) {
            book["author"] = author
        }

        books[isbn]=book;

        res.send(`The book with ISBN ${isbn} has been updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });


router.delete("/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (isbn){
        delete books[isbn]

    }
    res.send(`The book with ISBN ${isbn} has been deleted.`);
});


module.exports=router;
