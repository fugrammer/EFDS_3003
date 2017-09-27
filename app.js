var express = require("express"),
  app = express(),
  router = express.Router();
  port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

router.use("/HQ",require('./HQ/HQ'));

app.use(router);

app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});
