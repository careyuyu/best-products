var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors())
const schedule = require('node-schedule');
const product_service = require('./services/product-service')



const port = process.env.PORT || 8000;

//controller for getting product list
app.get("/product_search/:product_name", async function(req, res) {
    console.log("got product_search request on: "+req.params["product_name"])
    const productName = req.params["product_name"].toLowerCase()
    Promise.all([product_service.getAmazonProducts(productName), 
                product_service.getEbayProducts(productName)]).then((values)=>{
                    res.send(values.flat());
    });
});

//controller for getting comments
app.get("/comment_search/:website/:page_url", async function(req, res) {
    console.log("got comment_search request on:"+req.params["page_url"])
    const website = req.params["website"]
    const url = req.params["page_url"]
    result = []
    if(website==="Amazon") {
        result = await product_service.getAmazonComments(url)
    }
    else if(website==="ebay") {
        result = await product_service.getEbayComments(url)
    }
    res.send(result)
});

//routes for testing
app.get("/test_ebay/:url", async function(req, res) {
    result = await product_service.getEbayProducts(req.params["url"])
    res.send(result)
});

app.get("/test_ama/:url", async function(req, res) {
    result = await product_service.getAmazonProducts(req.params["url"])
    res.send(result)
});

app.get("/get_deal", async function(req, res) {
    result = await product_service.getDeals()
    res.send(result)
});

app.get("/test_update_deal", async function(req,res) {
    await product_service.updateDeals()
    res.send("")
})

app.listen(port, function() {
    //schedule the job for scraping daily deals
    let rule = new schedule.RecurrenceRule();
    rule.minute = 37;
    rule.second =0;
    let job = schedule.scheduleJob(rule, () => {
        console.log(new Date());
        product_service.updateDeals()
      });
});