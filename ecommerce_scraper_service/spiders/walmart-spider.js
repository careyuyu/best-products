var axios = require('axios');
var cheerio = require('cheerio');
require('dotenv').config()
const puppeteer = require('puppeteer')
const utils = require('./utils')

const PARSE_URLS = "https://www.walmart.com/search?q="

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
async function getProducts(product_name) {
    console.log("walmart request start on "+product_name)

    //prepare headers for the request
    const url = getProxyUrl(PARSE_URLS+product_name)
    var result = []

    //scrap ebay result page using axios
    await axios.get(url).then(res => {
        const $ = cheerio.load(res.data);
        var products = $("div.mb1.ph1.pa0-xl.bb.b--near-white.w-33")
        products.each((i,element)=>{
            let link = $(element).find("a").attr('href')
            if (link && link.charAt(0) === '/') {
                console.log(1)
                link = "https://www.walmart.com"+link
            } 
            const title = $(element).find("a").text()
            const price_all = $(element).find("div.flex.flex-wrap.justify-start.items-center.lh-title.mb2.mb1-m span.w_Cl").text().replace("was", "").replace("current price ", "").split(" ");
            const price = price_all[0]
            const prev_price = price_all[1]
            const img_url = $(element).find("img").attr('src')
            const review_all = $(element).find("div.mt2.flex.items-center span.w_Cl").text().replace(" reviews", "").split(". ")
            const stars = review_all[0] || ""
            const reviews = review_all[1] || ""
            let labels = []
            const labels_div = $(element).find("div.mt2.mb2 span")
            labels_div.each((i, element)=>{
                labels.push($(element).text())
            })
            let discount = ""
            if(prev_price && price) {
                const prev_price_num = parseFloat(prev_price.substring(1, prev_price.length).split(',').join(''))
                const current_price_num = parseFloat(price.substring(1, price.length).split(',').join(''))
                discount = parseInt(((prev_price_num-current_price_num)/prev_price_num)*100) + "%";
            }
            result.push({title, price, prev_price, link, img_url, labels, website:"walmart", discount, reviews, stars})
        })
    }).catch((err)=>{
        console.log(err)
        result = []
    })

    console.log("finished walmart request on "+product_name)
    return result;
}


/**
 * scrap comments of a product on Amazon.com
 * @param {*} link url to the product page on Amazon
 * @return the scraped comments data of product
 */async function getComments(link) {
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
    }).catch((err)=>{
        console.log(err)
        result = []
    })
    return result
}

/**
 * scrap "Daily Deal" page of Ebay.com using puppeteer and cheerio
 * @return the scraped products on today's deal page
 */
async function getDeals() {
    const url = "https://www.walmart.com/shop/deals"
    //get the detail page of the product
    var result = []
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(url, {"waitUntil": "networkidle0"});
    await utils.autoScroll(page)
    const res = await page.content();
    const $ = cheerio.load(res);
    var products = $("div.mb1.ph1.pa0-xl.bb.b--near-white.w-33")
    products.each((i,element)=>{
        const link = "https://www.walmart.com"+$(element).find("a").attr('href')
        const title = $(element).find("a").text()
        const price_all = $(element).find("div.flex.flex-wrap.justify-start.items-center.lh-title.mb2.mb1-m span.w_Cl").text().replace("was", "").replace("current price ", "").split(" ");
        const price = price_all[0]
        const prev_price = price_all[1]
        const img_url = $(element).find("img").attr('src')
        const review_all = $(element).find("div.mt2.flex.items-center span.w_Cl").text().replace(" reviews", "").split(". ")
        const stars = review_all[0] || ""
        const reviews = review_all[1] || ""
        let labels = []
        const labels_div = $(element).find("div.mt2.mb2 span")
        labels_div.each((i, element)=>{
            labels.push($(element).text())
        })
        let discount = ""
         if(prev_price && price) {
             const prev_price_num = parseFloat(prev_price.substring(1, prev_price.length).split(',').join(''))
             const current_price_num = parseFloat(price.substring(1, price.length).split(',').join(''))
             discount = parseInt(((prev_price_num-current_price_num)/prev_price_num)*100) + "%";
        }
        result.push({title, price, prev_price, link, img_url, labels, website:"walmart", discount, reviews, stars})
    })
    console.log("finished scraped walmart deal page")
    await browser.close()
    return result
}

module.exports = {getProducts, getComments, getDeals}
