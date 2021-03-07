const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.json());

app.use("/api", require("./routes/api"));

app.listen(process.env.port || 4000, function () {
  console.log("now listening for requests");
});
