var express = require("express"),
router = express.Router(),
bodyParser = require("body-parser"),
urlencodedParser = bodyParser.urlencoded({ extended: false });
jsonParser = bodyParser.json({limit:"500mb"});
fs = require('fs');

router.post("/orderHQ",[urlencodedParser,jsonParser],function(req,res){
    res.json(require("/Commons/response").success);
});

module.exports = router;
