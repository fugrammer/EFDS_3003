var express = require("express"),
  router = express.Router(),
  bodyParser = require("body-parser"),
  urlencodedParser = bodyParser.urlencoded({ extended: false });
  fs = require('fs');

router.get("/", function(req, res) {
    console.log(123);
    fs.createReadStream(__dirname+'/updateCMO.html').pipe(res);
});

router.post("/updateCMO",urlencodedParser,function(req,res){
  res.json(req.body);
});

module.exports = router;
