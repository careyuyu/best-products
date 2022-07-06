//this service is used to retrive and parse data from major ecommerce-website
//Currently Support: Amazon, Ebay
const redis = require('redis')
const AmazonParser = require('../spiders/amazon-spider')
const EbayParser = require('../spiders/ebay-spider')
const WalmartParser = require('../spiders/walmart-spider')
const redis_client = redis.createClient({
    url: process.env.REDIS_SERVER
})
redis_client.connect()


async function getDeals() {
    result = await redis_client.GET("todays_deal")
    if (result) {
        return JSON.parse(result);
    }
    return [];
}

async function updateDeals() {
    console.log("updating top deals")
    // [EbayParser.getDeals(), AmazonParser.getDeals(), WalmartParser.getDeals()]
    Promise.all([EbayParser.getDeals(), AmazonParser.getDeals(), WalmartParser.getDeals()]).then((values)=>{
        result = values.flat()
        redis_client.SET("todays_deal", JSON.stringify(result))
    }).catch((err)=>{console.log(err)})
}

//get the product search result page data
async function getAmazonProducts(product_name) {
    //check if the search result is in redis
    result = await redis_client.GET("amazon_"+product_name)
    if(result) {
        return JSON.parse(result);
    }
    else {
        //get the result using web scrapper, and store in redis
        result = await AmazonParser.getProducts(product_name)
        if (result != null && result.length > 0) {
            result = JSON.stringify(result)
            redis_client.SET("amazon_"+product_name, result)
        }
        try{return JSON.parse(result)} 
        catch (e) {return []}
    }
}


async function getEbayProducts(product_name) {
    result = await redis_client.GET("ebay_"+product_name)
    if (result) {
        return JSON.parse(result)
    }
    else {
        result = await EbayParser.getProducts(product_name)
        if (result != null && result.length > 0) {
            result = JSON.stringify(result)
            redis_client.SET("ebay_"+product_name, result, "EX", 5)
        }
        try{return JSON.parse(result)} 
        catch (e) {return []}
    }
}

async function getWalmartProducts(product_name) {
    result = await redis_client.GET("walmart_"+product_name)
    if (result) {
        return JSON.parse(result)
    }
    else {
        result = await WalmartParser.getProducts(product_name)
        if (result != null && result.length > 0) {
            result = JSON.stringify(result)
            redis_client.SET("walmart_"+product_name, result, "EX", 5)
        }
        try{return JSON.parse(result)} 
        catch (e) {return []}
    }
}


//get the comment data for a product
async function getAmazonComments(page_url) {
    result = await redis_client.HGET("Amazon_Comments", page_url)
    if (result) {
        return result;
    }
    else {
        result = await AmazonParser.getComments(page_url)
        result = JSON.stringify(result)
        redis_client.HSET("Amazon_Comments", page_url, result)
        try{return JSON.parse(result)} 
        catch (e) {return []}
    }
}


async function getEbayComments(page_url) {
    result = await redis_client.HGET("Ebay_Comments", page_url)
    if (result) {
        return result;
    }
    else {
        result = await EbayParser.getComments(page_url)
        result = JSON.stringify(result)
        redis_client.HSET("Ebay_Comments", page_url, result)
        try{return JSON.parse(result)} 
        catch (e) {return []}
    }
}

async function getWalmartComments(page_url) {
    result = await redis_client.HGET("Walmart_Comments", page_url)
    if (result) {
        return result;
    }
    else {
        result = await WalmartParser.getComments(page_url)
        result = JSON.stringify(result)
        redis_client.HSET("Walmart_Comments", page_url, result)
        try{return JSON.parse(result)} 
        catch (e) {return []}
    }
}



module.exports = {getAmazonProducts, getAmazonComments, getEbayProducts, getEbayComments, getDeals, updateDeals, getWalmartProducts, getWalmartComments}