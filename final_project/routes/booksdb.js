const express = require('express');
const router = express.Router();

let books = {
      1: {"author": "Chinua Achebe","title": "Things Fall Apart", "copies":10, "reviews": {} },
      2: {"author": "Hans Christian Andersen","title": "Fairy tales", "copies":10, "reviews": {} },
      3: {"author": "Dante Alighieri","title": "The Divine Comedy", "copies":10, "review": {} },
      4: {"author": "Unknown","title": "The Epic Of Gilgamesh","copies":10, "review": {} },
      5: {"author": "Unknown","title": "The Book Of Job","copies":10, "review": {} },
      6: {"author": "Unknown","title": "One Thousand and One Nights","copies":10, "review": {} },
      7: {"author": "Unknown","title": "Nj\u00e1l's Saga","copies":10, "review": {} },
      8: {"author": "Jane Austen","title": "Pride and Prejudice","copies":10, "review": {} },
      9: {"author": "Honor\u00e9 de Balzac","title": "Le P\u00e8re Goriot","copies":10, "review": {} },
      10: {"author": "Samuel Beckett","title": "Molloy, Malone Dies, The Unnamable, the trilogy","copies":10, "review": {} }
}

module.exports=books;

