// const books = require('../router/booksdb.js')
const {v4 : uuidv4 } = require('uuid')

function addOrUpdateReview(book,username,review){
            const reviews = book.reviews;

            if(reviews.hasOwnProperty(username)){
                reviews[username] = review
            }else{
                book.reviews = {
                    ...reviews,
                    reviewId: uuidv4(),
                    username: username,
                    review: review
                }
            }
        
}

module.exports.addOrUpdateReview = addOrUpdateReview;