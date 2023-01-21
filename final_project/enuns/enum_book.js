// use it as module
const Enum = require('enum');

const bookEnum = new Enum(['author', 'title', 'isbn', 'reviews', "name", "comment", "note"])

module.exports=bookEnum;