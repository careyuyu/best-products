//this service is used to retrive and parse data from major ecommerce-website
//Currently Support: Amazon, Ebay
const redis = require('redis')
const AmazonParser = require('../spiders/amazon-spider')
const EbayParser = require('../spiders/ebay-spider')
const redis_client = redis.createClient({port:6379, host:'redis'})
redis_client.connect()

//get the product search result page data
async function getAmazonProducts(product_name) {
    //check if the search result is in redis
    result = await redis_client.GET("amazon_"+product_name)
    if(result) {
        return JSON.parse(result);
    }
    else {
        //get the result using web scrapper, and store in redis
        result = await AmazonParser.getAmazonProducts(product_name)
        if (result != null && result.length > 0) {
            result = JSON.stringify(result)
            redis_client.SET("amazon_"+product_name, result)
        }
        return JSON.parse(result);
    }
}


async function getEbayProducts(product_name) {
    result = await redis_client.GET("ebay_"+product_name)
    if (result) {
        return JSON.parse(result)
    }
    else {
        result = await EbayParser.getEbayProducts(product_name)
        if (result != null && result.length > 0) {
            result = JSON.stringify(result)
            redis_client.SET("ebay_"+product_name, result, "EX", 5)
        }
        return JSON.parse(result);
    }
}


//get the comment data for a product
async function getAmazonComments(page_url) {
    result = await redis_client.HGET("Amazon_Comments", page_url)
    if (result) {
        return result;
    }
    else {
        result = await AmazonParser.getAmazonComments(page_url)
        result = JSON.stringify(result)
        redis_client.HSET("Amazon_Comments", page_url, result)
        return result;
    }
}


async function getEbayComments(url) {
    result = await EbayParser.getEbayComments(url)
    result = JSON.stringify(result)
    return JSON.parse(result)
}

module.exports = {getAmazonProducts, getAmazonComments, getEbayProducts, getEbayComments}