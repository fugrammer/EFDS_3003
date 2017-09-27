var express = require("express"),
router = express.Router(),
bodyParser = require("body-parser"),
urlencodedParser = bodyParser.urlencoded({ extended: false });
fs = require('fs');

router.post("/orderHQ",urlencodedParser,function(req,res){
    res.send("thomas");
    res.json(req.body);
});

module.exports = router;
