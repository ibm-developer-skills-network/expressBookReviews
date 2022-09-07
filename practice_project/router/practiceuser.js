const express = require('express');

const router = express.Router();

var users = {
    "johnsmith@gamil.com": {"firstName": "John","lastName": "Doe","DOB":"22-12-1990"},
    "annasmith@gamil.com":{"firstName": "Anna","lastName": "smith","DOB":"02-07-1983"},
    "peterjones@gamil.com":{"firstName": "Peter","lastName": "Jones","DOB":"21-03-1989"}
};


router.get('/',function (req, res) {
    
//Update the code here
    
});

router.get('/:email',function (req, res) {
//Update the code here

});

router.post("/",function (req,res){
//Update the code here
});
  
router.put("/:email", function (req, res) {
//Update the code here
  });


  router.delete("/:email", (req, res) => {
//Update the code here
  });



  module.exports=router;
