var axios = require('axios');
var cheerio = require('cheerio');
var Item = require('../models/item')
require('dotenv').config()

const PARSE_URLS = "https://www.amazon.com/s?k="

/**
 * To get the url that request the target url from a proxy server using Scraper API.
 * @param {*} request_url is the target url to scrape
 * @returns the url to request the @request_url from the proxy server.
 */
function getProxyUrl(request_url) {
    return "http://api.scraperapi.com?api_key="+process.env.SCRAPERAPI_KEY+"&url="+request_url
}



//******************************Amazon.com Parsers***************************************//
/**
 * 
 * fetch product data from amazon.com
 * @param {*} product_name is the search keyword
 * @returns a list of product data scraped from Amazon.com
 */
async function getAmazonProducts(product_name) {
    console.log("amazon request start on "+product_name)
    const startTime = Date.now();

    //prepare headers for the request
    const url = getProxyUrl(PARSE_URLS+product_name)
    //scrap amazon result page using axios
    await axios.get(url).then((res)=>{
        let $ = cheerio.load(res.data);
        var items = $('div.s-card-container.s-overflow-hidden.aok-relative.s-include-content-margin.s-latency-cf-section.s-card-border')
        result = []
        items.each((i, element)=>{
            const title = $(element).find('span.a-size-base-plus.a-color-base.a-text-normal, .a-size-medium.a-color-base.a-text-normal').text()
            const price_list = $(element).find('span.a-offscreen')
            const price = $(price_list[0]).text()
            const prev_price = $(price_list[1]).text()
            var discount = $(element).find('span.a-size-extra-large.s-color-discount.s-light-weight-text').text()
            discount = discount.substring(1, 100)
            var popularity_info = $($(element).find('div.a-row.a-size-small')[0]).children()
            const stars = $(popularity_info[0]).attr("aria-label")
            const reviews = $(popularity_info[1]).attr("aria-label")
            const link = "https://www.amazon.com/"+$(element).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href');
            const img_url = $(element).find('img').first().attr('src')
            result.push({title, price, stars, reviews, link, img_url, prev_price, discount, "website":"Amazon"})
            // ...
        })
    }).catch((err) => {
        console.log(err)
        return err;
    })

    console.log("finished amazon request on "+product_name)
    return result;
}

/**
 * scrap comments of a product on Amazon.com
 * @param {*} link url to the product page on Amazon
 * @return the scraped comments data of product
 */async function getAmazonComments(link) {
    const url = getProxyUrl(link)
    //get the detail page of the product
    var result = []
    await axios.get(url).then((res)=>{
        let $ = cheerio.load(res.data);
        var reviews = $('div#cm-cr-dp-review-list').children()
        reviews.each((i,element)=>{
            const title = $(element).find("a[data-hook='review-title']").text().replace(/[\r\n]/gm, '')
            const stars = $(element).find("a.a-link-normal").attr("title")
            const detail = $(element).find("div[data-hook='review-collapsed']").text().replace(/[\r\n]/gm, '')
            const author = $(element).find("span.a-profile-name").text()
            result.push({title, stars, detail, author})
        })
    }).catch((err) => {
        console.log(err)
        return err;
     })
     console.log("finished amazon comment request")
    return result
}

module.exports = {getAmazonProducts, getAmazonComments}