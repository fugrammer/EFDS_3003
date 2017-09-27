var express = require("express"),
router = express.Router(),
bodyParser = require("body-parser"),
urlencodedParser = bodyParser.urlencoded({ extended: false });
fs = require('fs');

router.post("/orderHQ",urlencodedParser,function(req,res){
    res.send(JSON.stringify(req.body));
});

module.exports = router;
