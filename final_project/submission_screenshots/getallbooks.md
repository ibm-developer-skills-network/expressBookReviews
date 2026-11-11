# Task 1: Get the List of Books Available in the Shop

## cURL Command
```bash
curl -s http://localhost:5001/
```

## API Endpoint
GET http://localhost:5001/

## HTTP Status: 200 OK

## Actual Output
```json
{
    "1": {
        "author": "Chinua Achebe",
        "title": "Things Fall Apart",
        "reviews": {}
    },
    "2": {
        "author": "Hans Christian Andersen",
        "title": "Fairy tales",
        "reviews": {}
    },
    "3": {
        "author": "Dante Alighieri",
        "title": "The Divine Comedy",
        "reviews": {}
    },
    "4": {
        "author": "Unknown",
        "title": "The Epic Of Gilgamesh",
        "reviews": {}
    },
    "5": {
        "author": "Unknown",
        "title": "The Book Of Job",
        "reviews": {}
    },
    "6": {
        "author": "Unknown",
        "title": "One Thousand and One Nights",
        "reviews": {}
    },
    "7": {
        "author": "Unknown",
        "title": "Njál's Saga",
        "reviews": {}
    },
    "8": {
        "author": "Jane Austen",
        "title": "Pride and Prejudice",
        "reviews": {}
    },
    "9": {
        "author": "Honoré de Balzac",
        "title": "Le Père Goriot",
        "reviews": {}
    },
    "10": {
        "author": "Samuel Beckett",
        "title": "Molloy, Malone Dies, The Unnamable, the trilogy",
        "reviews": {}
    }
}
```

## Implementation (general.js)
Route uses a Promise-based async approach (Task 1 / Task 10 combined):
```javascript
function getBookList() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

public_users.get('/', function (req, res) {
    getBookList()
        .then((bookList) => res.status(200).send(JSON.stringify(bookList, null, 4)))
        .catch((error) => res.status(500).json({ message: "Error fetching book list", error: error.message }));
});
```
