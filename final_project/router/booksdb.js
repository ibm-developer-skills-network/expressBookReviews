
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

function search(db, column, part, results = []) {
    if ('isbn' === column)
        Object.keys(db)
            .filter(isbn => String(isbn).indexOf(part) > -1)
            .forEach(isbn => results.push(db[isbn]))
            ;
    else {
        for (const row in db) {
            if (Object.hasOwnProperty.call(db, row)) {
                if (String(db[row][column]).indexOf(part) > -1) {
                    results.push(db[row])
                }
            }
        }
    }
    return results.length ? results : null
}

module.exports.books = books;
module.exports.search = search;
