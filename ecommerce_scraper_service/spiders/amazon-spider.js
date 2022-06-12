var axios = require('axios');
var cheerio = require('cheerio');
var Item = require('../models/item')
require('dotenv').config()

const PARSE_URLS = {
    "amazon": "https://www.amazon.com/s?k=",
    "ebay": "https://www.ebay.com/sch/i.html?_nkw="
}

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
    //prepare headers for the request
    const url = getProxyUrl(PARSE_URLS["amazon"]+product_name)

    //scrap amazon result page using axios
    await axios.get(url).then((res)=>{
        let $ = cheerio.load(res.data);
        var items = $('div.s-card-container.s-overflow-hidden.aok-relative.s-include-content-margin.s-latency-cf-section.s-card-border')
        result = []
        items.each((i, element)=>{
            const title = $(element).find('span.a-size-base-plus.a-color-base.a-text-normal, .a-size-medium.a-color-base.a-text-normal').text()
            const price = $(element).find('span.a-offscreen').first().text()
            var popularity_info = $($(element).find('div.a-row.a-size-small')[0]).children()
            const stars = $(popularity_info[0]).attr("aria-label")
            const reviews = $(popularity_info[1]).attr("aria-label")
            const link = "https://www.amazon.com/"+$(element).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href');
            const img_url = $(element).find('img').first().attr('src')
            result.push({title, price, stars, reviews, link, img_url, "website":"Amazon", "comments":[]})
        })
    }).catch((err) => {
        console.log(err)
        return err;
    })
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
            const date = $(element).find("span[data-hook='review-date']").text().replace(/[\r\n]/gm, '')
            const stars = $(element).find("a.a-link-normal").attr("title")
            const detail = $(element).find("div[data-hook='review-collapsed']").text().replace(/[\r\n]/gm, '')
            const author = $(element).find("span.a-profile-name").text()
            result.push({title, date, stars, detail, author})
        })
    }).catch((err) => {
        console.log(err)
        return err;
     })
    return result
}

module.exports = {getAmazonProducts, getAmazonComments}