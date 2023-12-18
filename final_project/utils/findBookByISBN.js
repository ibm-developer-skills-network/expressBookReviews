
const books = require('../router/booksdb.js')

function findBookByISBN(isbn) {
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId)) {
      const book = books[bookId];
      if (book.isbn === isbn) {
        return book;
      }
    }
  }
  return null;
}
module.exports.findBookByISBN = findBookByISBN;

// if (books.hasOwnProperty(bookId)) {
//     let book = books[bookId];
//     if (book.isbn === isbn) {
//       console.log(book);
//       isbnBook = book;
//       if(book.reviews.length > 0){
//        if(book.reviews.hasOwnProperty(curUser)){
//         book.reviews[curUser].review = userReview
//        }else{
//         let newId = uuidv4();
//         book.reviews = {
//           ...book.reviews,
//           reviewId: newId,
//           review: userReview,
//           username: curUser
//         }
//        }
//       }else{
//         let newId = uuidv4();
//         // let review = {
//         //   reviewId: newId,
//         //   review: userReview,
//         //   username: curUser
//         // }
//         book.reviews = {
//           reviewId: newId,
//           review: userReview,
//           username: curUser
//         }
//       }
//     }
//   }
//   if (isbnBook !== null) {
//     return res
//       .status(200)
//       .json({ message: req.session.authorization.username, books: books});
//   } else {
//     return res
//       .status(404)
//       .json({ message: 'No book with ' + isbn + ' found!' });
//   }