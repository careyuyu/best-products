var express = require('express');
var app = express();
var spiders = require('./spiders');


const hostname = 'localhost';
const port = process.env.PORT || 8000;

app.get('/amazon/:product', async function(req, res) {
    result = await spiders.parseAmazon(req.params["product"]);
    result2 = await spiders.parseEbay(req.params["product"]);
    res.send(result)
});

app.listen(port);