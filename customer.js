const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

users = {};

//UPDATE a user by ID
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const id = req.params.id
   
    user = users[id] 
   
    if (user) {
        
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        if(firstName) {
            user["firstName"] = firstName
        }
        if(lastName) {
            user["lastName"] = lastName
        }
        users[id]=user;

        res.send(`User with the ID  ${id} updated.`);
    }
    else{
        res.send("Unable to find user!");
    }

});

//DELETE a user by ID
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {

    const id = req.params.id;
    if (id){
        delete users[id]

    }
    res.send(`User with the ID  ${id} deleted.`);

});

//GET USER by ID
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {

    const email = req.params.id;
    res.send(users[id])

});

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {

    res.send(JSON.stringify({users}, null, 4));
});


module.exports = router;
