var axios = require('axios');
var cheerio = require('cheerio');
require('dotenv').config()

const PARSE_URLS = "https://www.ebay.com/sch/i.html?_nkw="

/**
 * To get the url that request the target url from a proxy server using Scraper API.
 * @param {*} request_url is the target url to scrape
 * @returns the url to request the @request_url from the proxy server.
 */
function getProxyUrl(request_url) {
    return "http://api.scraperapi.com?api_key="+process.env.SCRAPERAPI_KEY+"&url="+request_url+"&country_code=us"
}
//******************************Ebay.com Parsers***************************************//
/**
 * 
 * @param {*} product_name 
 * @returns 
 */
async function getEbayProducts(product_name) {
    console.log("ebay request start on "+product_name)

    //prepare headers for the request
    const url = getProxyUrl(PARSE_URLS+product_name)
    var result = []

    //scrap ebay result page using axios
    await axios.get(url).then(res => {
        let $ = cheerio.load(res.data);
        var items = $('div.srp-river-results.clearfix ul li.s-item.s-item__pl-on-bottom')
        items.each((i, element)=>{
            const title = $(element).find('h3.s-item__title').text()
            const price = $(element).find('span.s-item__price').first().text()
            const prev_price = $(element).find('span.s-item__trending-price span.STRIKETHROUGH').text()
            const discount = $(element).find('span.s-item__discount').text().split(" ")[0]
            var stars = $($(element).find('span.clipped')[1]).text()
            stars = stars.charAt(stars.length-1)=='.'?stars:null
            const reviews = $(element).find('span.s-item__reviews-count').children().first().text().split(" ")[0]
            const link = $(element).find('a.s-item__link').attr('href')
            const img_url = $(element).find('img.s-item__image-img').attr('src')

            //console.log(title)
            result.push({title, price, stars, reviews, link, img_url, prev_price, discount, "website":"ebay"})
        })
    })

    console.log("finished ebay request on "+product_name)
    
    //console.log(result);
    return result;
}


/**
 * scrap comments of a product on Amazon.com
 * @param {*} link url to the product page on Amazon
 * @return the scraped comments data of product
 */async function getEbayComments(link) {
    const url = getProxyUrl(link)
    console.log("ebay comment start")
    //get the detail page of the product
    var result = []
    await axios.get(url).then((res)=>{
        let $ = cheerio.load(res.data);
        var reviews = $('div.reviews div.ebay-review-section')
        reviews.each((i,element)=>{
            const title = $(element).find("p.review-item-title").text().replace(/[\r\n]/gm, '')
            const detail = $(element).find("p.review-item-content").text().replace(/[\r\n]/gm, '')
            const stars = $(element).find("div.ebay-star-rating").attr("aria-label")
            const author = $(element).find("a.review-item-author").text()
            result.push({title, detail, stars, author})
        })
    }).catch((err) => {
        console.log(err)
        return err;
     })
    return result
}


module.exports = {getEbayProducts, getEbayComments}
