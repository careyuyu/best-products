var axios = require('axios');
var cheerio = require('cheerio');
var Comment = require('./models/comment');
var Item = require('./models/item');
const fs = require('fs');

const PARSE_URLS = {
    "amazon": "https://www.amazon.com/s?k=",
    "ebay": "https://www.ebay.com/sch/i.html?_nkw="
}
const headers = {
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
}


//******************************Amazon.com Parsers***************************************//
/**
 * 
 * fetch product data from amazon.com
 * @param {*} product_name is the search keyword
 * @returns a list of product data scraped from Amazon.com
 */
async function parseAmazon(product_name) {
    //prepare headers for the request
    const url = PARSE_URLS["amazon"]+product_name

    //scrap amazon result page using axios
    const response = await axios.get(url, {headers:headers}).catch((err) => {
        console.log(err.code)
    })
    let $ = cheerio.load(response.data);
    var items = $('div.s-card-container.s-overflow-hidden.aok-relative.s-include-content-margin.s-latency-cf-section.s-card-border').toArray()
    const result = Promise.all(
        items.map(async (element)=> {
            const title = $(element).find('span.a-size-base-plus.a-color-base.a-text-normal').text()
            const price = $(element).find('span.a-offscreen').first().text()
            var popularity_info = $($(element).find('div.a-row.a-size-small')[0]).children()
            const stars = $(popularity_info[0]).attr("aria-label")
            const reviews = $(popularity_info[1]).attr("aria-label")
            const link = "https://www.amazon.com/"+$(element).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href');
            const img_url = $(element).find('img').first().attr('src')
            const comments = await getAmazonComments(link)
            return {title, price, stars, reviews, link, img_url, "website":"Amazon", comments}
        })
    )
    return result
}

/**
 * scrap comments of a product on Amazon.com
 * @param {*} link url to the product page on Amazon
 * @return the scraped comments data of product
 */async function getAmazonComments(link) {
    console.log("scrapying comments on "+link)
    //get the detail page of the product
    const response = await axios.get(link, {headers:headers}).catch((err) => { console.log(err.code) })
    let $ = cheerio.load(response.data);
    var reviews = $('div#cm-cr-dp-review-list').children().toArray()
    const result = Promise.all(
        reviews.map(element=>{
            const title = $(element).find("a[data-hook='review-title']").text().replace(/[\r\n]/gm, '')
            const date = $(element).find("span[data-hook='review-date']").text().replace(/[\r\n]/gm, '')
            const stars = $(element).find("a.a-link-normal").attr("title")
            const detail = $(element).find("div[data-hook='review-collapsed']").text().replace(/[\r\n]/gm, '')
            const author = $(element).find("span.a-profile-name").text()
            return {title, date, stars, detail, author}
        })
    )
    console.log("finishing scraping on "+link)
    return result
}

//******************************Ebay.com Parsers***************************************//
/**
 * 
 * @param {*} product_name 
 * @returns 
 */
async function parseEbay(product_name) {
    //prepare headers for the request
    const url = PARSE_URLS["ebay"]+product_name
    const headers = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'
    }
    var result = []

    //scrap ebay result page using axios
    await axios.get(url, {headers:headers}).then(res => {
        let $ = cheerio.load(res.data);
        var items = $('div.srp-river-results.clearfix ul li.s-item.s-item__pl-on-bottom')
        items.each((i, element)=>{
            const title = $(element).find('h3.s-item__title').text()
            const price = $(element).find('span.s-item__price').text()
            var stars = $($(element).find('span.clipped')[1]).text()
            stars = stars.charAt(stars.length-1)=='.'?stars:null
            const reviews = $(element).find('span.s-item__reviews-count').children().first().text()
            //console.log(title)
        })
    })
    
    //console.log(result);
    return result;
}

module.exports = {parseAmazon, parseEbay}
