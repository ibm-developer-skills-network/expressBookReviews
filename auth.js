const router = require("express").Router();
// const jwt = require("jsonwebtoken");

//REGISTER a new user
router.post("/register", async (req, res) => {
    if (req.body.id){
        users[req.body.id] = {
            "firstName":req.body.firstName,
            "lastName":req.body.lastName
    
            }
    }
res.send("The user with first name" + (' ')+ (req.body.firstName) + " has been added!");

});

//LOGIN as an existing user with password '12345'

router.post('/login', async (req, res) => {

    if (req.query.password !== "12345") {
        return res.status(402).send("This user cannot login ");    
    }
    console.log('Time:', Date.now())
    next()
    

});

module.exports = router;
