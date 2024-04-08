const express = require("express");
const router = express.Router();


router.use(express.json());

router.get("/info", (req, res) =>{
    res.send("Sema");
});


router.post("/ID", (req, res) => {
    const data = req.body;
    console.log('Received data:', data);
    // let parameter = Object.keys(data);
    // console.log(parameter);
    res.json("success");
});

module.exports = router;
