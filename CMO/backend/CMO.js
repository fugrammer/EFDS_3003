var express = require("express"),
  router = express.Router(),
  bodyParser = require("body-parser"),
  urlencodedParser = bodyParser.urlencoded({ extended: false }),
  jsonParser = bodyParser.json({ limit: "500mb" }),
  app = express(),
  router = express.Router(),
  http = require("http").Server(app),
  io = require("socket.io")(http);

router.post("/orderHQ", [urlencodedParser, jsonParser], function(req, res) {
  res.json(require("../../Commons/js/response").success);
  io.emit("executiveorder", "message from cmo");
});

module.exports = router;
