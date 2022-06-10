var axios = require('axios');
var cheerio = require('cheerio');
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
//******************************Ebay.com Parsers***************************************//
/**
 * 
 * @param {*} product_name 
 * @returns 
 */
async function parseEbay(product_name) {
    //prepare headers for the request
    const url = getProxyUrl(PARSE_URLS["ebay"]+product_name)
    var result = []

    //scrap ebay result page using axios
    await axios.get(url).then(res => {
        let $ = cheerio.load(res.data);
        var items = $('div.srp-river-results.clearfix ul li.s-item.s-item__pl-on-bottom')
        items.each((i, element)=>{
            const title = $(element).find('h3.s-item__title').text()
            const price = $(element).find('span.s-item__price').text()
            var stars = $($(element).find('span.clipped')[1]).text()
            stars = stars.charAt(stars.length-1)=='.'?stars:null
            const reviews = $(element).find('span.s-item__reviews-count').children().first().text()
            //console.log(title)
            result.push({title, price, stars, reviews})
        })
    })
    
    //console.log(result);
    return result;
}

module.exports = {parseAmazon, parseEbay}
