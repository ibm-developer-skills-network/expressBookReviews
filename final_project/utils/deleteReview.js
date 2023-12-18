

function deleteReview(username,book){
    let reviews = book.reviews;
    console.log('in dletefn', reviews,username)
    if(reviews.hasOwnProperty(username)){
        delete reviews[username]
        
    }else{
        console.log('cannot delete others reviews')
    }
}

module.exports.deleteReview = deleteReview