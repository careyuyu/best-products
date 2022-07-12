var axios = require('axios');
var cheerio = require('cheerio');
require('dotenv').config()
//puppeteer related
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin());
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')());
//
const utils = require('./utils')
const fs = require('fs');

const PARSE_URLS = "https://www.walmart.com/search?q="

/**
 * To get the url that request the target url from a proxy server using Scraper API.
 * @param {*} request_url is the target url to scrape
 * @returns the url to request the @request_url from the proxy server.
 */
function getProxyUrl(request_url) {
    return "http://api.scraperapi.com?api_key="+process.env.SCRAPERAPI_KEY+"&url="+request_url+"&country_code=us"
}
//******************************Walmart.com Parsers***************************************//
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

    //scrap walmart result page using axios
    await axios.get(url).then(res => {
        const $ = cheerio.load(res.data);
        var products = $("div.mb1.ph1.pa0-xl.bb.b--near-white.w-33")
        products.each((i,element)=>{
            let link = $(element).find("a").attr('href')
            if (link && link.charAt(0) === '/') {
                link = "https://www.walmart.com"+link
            } 
            const title = $(element).find("a").text() || ""
            const price_all = $(element).find("div.flex.flex-wrap.justify-start.items-center.lh-title.mb2.mb1-m span").text().replace("was", "").replace("current price ", "").split(" ");
            const price = price_all[0] || ""
            const prev_price = price_all[1] || ""
            const img_url = $(element).find("img").attr('src') || ""
            const review_all = $(element).find("div.mt2.flex.items-center span.w_Cl").text().replace(" reviews", "").split(". ") || ""
            const stars = review_all[0] || ""
            const reviews = review_all[1] || ""
            let labels = []
            const labels_div = $(element).find("div.mt2.mb2 span")
            labels_div.each((i, element)=>{
                labels.push($(element).text())
            })
            let discount = ""
            if(prev_price!=="" && price!=="") {
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
    const url = link
    console.log("walmart comment scraping start on "+link)
    //get the detail page of the product
    let result = []
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ],
        ignoreDefaultArgs: ['--disable-extensions']
    })
    const page = await browser.newPage();
    await page.goto(url);
    await utils.autoScroll(page)
    const res = await page.content();
    const $ = cheerio.load(res);
    const reviews = $('div.w_I.w_L div.w_K')
    result = []
    reviews.each((i, element)=>{
            const title = $(element).find("span.b.w_Au").text().replace(/[\r\n]/gm, '') || ""
            const detail = $(element).find("span.tl-m.db-m").text().replace(/[\r\n]/gm, '') || ""
            const stars = $(element).find("div.flex.flex-grow-1.mb3 div span").text().replace(' review', '') || ""
            const author = $(element).find("div.f6.gray.pr2").text() || ""
            result.push({title, detail, stars, author})
    })
    page.close()
    browser.close()
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
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: true,
        args: [
            "--disable-gpu",
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ],
        ignoreDefaultArgs: ['--disable-extensions']
    });
    const page = await browser.newPage();
    try {
        await page.goto(url);
        await page.waitForTimeout(1000);
        await utils.autoScroll(page)
        const res = await page.content();
        const $ = cheerio.load(res);
        var products = $("div.mb1.ph1.pa0-xl.bb.b--near-white")
        products.each((i,element)=>{
            const link = "https://www.walmart.com"+$(element).find("a").attr('href') || ""
            const title = $(element).find("a").text() || ""
            const price_all = $(element).find("div.flex.flex-wrap.justify-start span").text().replace("was", "").replace("current price ", "").split(" ");
            const price = price_all[0] || ""
            const prev_price = price_all[1] || ""
            const img_url = $(element).find("img").attr('src') || ""
            const review_all = $(element).find("div.mt2.flex.items-center span:not([aria-hidden])").text().replace(" reviews", "").split(". ") || ""
            const stars = review_all[0] || ""
            const reviews = review_all[1] || ""
            let labels = []
            const labels_div = $(element).find("div.mt2.mb2 span")
            labels_div.each((i, element)=>{
                labels.push($(element).text())
            })
            let discount = ""
            if(prev_price!=="" && price!=="") {
                const prev_price_num = parseFloat(prev_price.substring(1, prev_price.length).split(',').join(''))
                const current_price_num = parseFloat(price.substring(1, price.length).split(',').join(''))
                discount = parseInt(((prev_price_num-current_price_num)/prev_price_num)*100) + "%";
            }
        result.push({title, price, prev_price, link, img_url, labels, website:"walmart", discount, reviews, stars})
    })
    console.log("finished scraped walmart deal page")
    } catch (e) {
        console.log("walmart deal scraping ERROR: "+e.message);
        page.close();
        browser.close();
        return [];
    }
    
    page.close()
    browser.close()
    return result
}

module.exports = {getProducts, getComments, getDeals}
