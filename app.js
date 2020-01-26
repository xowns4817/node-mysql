let express = require("express");
let app = express();
let movies = require("./movie");
let bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:false})); // urlendcode
app.use(bodyParser.json()); // json

app.use("/movie", movies);

app.listen(3000, function(){
    console.log("server Connect!");
});


