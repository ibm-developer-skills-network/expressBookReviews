let books = require("./router/booksdb.js");

const getBookByField = (field,value) =>{
    const booksArray = Object.values(books);
    const bookFound = booksArray.find(book=>book[field]===value)
    return bookFound
}

module.exports={getBookByField}