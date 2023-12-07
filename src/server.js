const bodyParser = require("body-parser");
const express = require("express");
const port = 8080;

const app = express();
const routes = require("./routes.js");

app.disable("x-powered-by");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);


app.listen(port, () => {
  console.log(`Example app listening at :${port}`);
});
