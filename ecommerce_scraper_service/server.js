var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors())
const product_service = require('./services/product-service')



const hostname = 'localhost';
const port = process.env.PORT || 8000;

app.get("/product_search/:product_name", async function(req, res) {
    console.log("got product_search request on: "+req.params["product_name"])

    result = await product_service.getAmazonProducts(req.params["product_name"])
    res.send(result)
})

app.get("/comment_search/:website/:page_url", async function(req, res) {
    console.log("got comment_search request on:"+req.params["page_url"])
    result = []
    if(req.params["website"]=="Amazon") {
        result = await product_service.getAmazonComments(req.params["page_url"])
    }
    res.send(result)
})

app.listen(port);