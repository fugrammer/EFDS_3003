var express = require("express"),
  router = express.Router(),
  bodyParser = require('body-parser'),
  urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/", urlencodedParser, function(req, res) {
    console.log(req.body);
});

module.exports = router;
