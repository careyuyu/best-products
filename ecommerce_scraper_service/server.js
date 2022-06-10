var express = require('express');
var app = express();
const product_service = require('./services/product-service')



const hostname = 'localhost';
const port = process.env.PORT || 8000;

app.get("/product_search/:product_name", async function(req, res) {
    result = await product_service.getAmazonProducts(req.params["product_name"])
    res.send(result)
})

app.get("/comment_search/:website/:page_url", async function(req, res) {
    result = []
    if(req.params["website"]=="amazon") {
        result = await product_service.getAmazonComments(req.params["page_url"])
    }
    res.send(result)
})

app.listen(port);