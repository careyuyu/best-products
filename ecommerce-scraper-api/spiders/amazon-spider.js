var axios = require('axios');
var cheerio = require('cheerio');
var Item = require('../models/item')
const fs = require('fs');
const puppeteer = require('puppeteer')
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
async function getProducts(product_name) {
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
            const title = $(element).find('span.a-size-base-plus.a-color-base.a-text-normal, .a-size-medium.a-color-base.a-text-normal').text() || ""
            const price_list = $(element).find('span.a-offscreen') || ""
            const price = $(price_list[0]).text() || ""
            const prev_price = $(price_list[1]).text() || ""
            var discount = $(element).find('span.a-size-extra-large.s-color-discount.s-light-weight-text').first().text() || ""
            discount = discount.substring(1, 100)
            var popularity_info = $($(element).find('div.a-row.a-size-small')[0]).children()
            const stars = $(popularity_info[0]).attr("aria-label") || ""
            const reviews = $(popularity_info[1]).attr("aria-label") || ""
            const link = "https://www.amazon.com/"+$(element).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href');
            const img_url = $(element).find('img').first().attr('src') || ""
            let labels = []
            const label1 = $(element).find("span[id^='BEST_DEAL_'][class='a-badge']").first().text()
            const label2 = $(element).find("span[class='s-coupon-unclipped']").first().text()
            if (label1 && label1!=="") {
                labels.push(label1)
            }
            if (label2 && label2!=="") {
                labels.push(label2)
            }
            result.push({title, price, stars, reviews, link, img_url, prev_price, discount, "website":"Amazon", labels: labels})
            // ...
        })
    }).catch((err) => {
        console.log(err)
        result = []
    })

    console.log("finished amazon request on "+product_name)
    return result;
}

/**
 * scrap comments of a product on Amazon.com
 * @param {*} link url to the product page on Amazon
 * @return the scraped comments data of product
 */async function getComments(link) {
    const url = getProxyUrl(link)
    //get the detail page of the product
    var result = []
    await axios.get(url).then((res)=>{
        let $ = cheerio.load(res.data);
        var reviews = $('div#cm-cr-dp-review-list').children()
        reviews.each((i,element)=>{
            const title = $(element).find("a[data-hook='review-title']").text().replace(/[\r\n]/gm, '') || ""
            const stars = $(element).find("a.a-link-normal").attr("title") || ""
            const detail = $(element).find("div[data-hook='review-collapsed']").text().replace(/[\r\n]/gm, '') || ""
            const author = $(element).find("span.a-profile-name").text() || ""
            result.push({title, stars, detail, author})
        })
    }).catch((err) => {
        console.log(err)
        result = []
     })
     console.log("finished amazon comment request")
    return result
}

/**
 * scrap "Today's Deal" page of Amazon.com
 * @return the scraped products on today's deal page
 */async function getDeals() {
    const url = "https://www.amazon.com/gp/goldbox/"
    //get the detail page of the product
    var result = []
    const browser = await puppeteer.launch({
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
    await page.goto(url);
    await page.waitForTimeout(1000);
    const res = await page.content();
    const $ = cheerio.load(res);
    var products = $("div[aria-label='Deals grid'] div div")
    let prev_title = ""
    products.each((i,element)=>{
        const title = $(element).find("div[class^='DealContent-module__truncate_']").first().text()
        if (title === prev_title) {
            return;
        }
        let price = $($(element).find("span.a-price-whole")[0]).text() || ""
        let prev_price = $($(element).find("span.a-price-whole")[1]).text() || ""
        if (price!="" && price.charAt(0)!='$') {
            price = "$"+price;
        }
        if (prev_price!="" && prev_price.charAt(0)!='$') {
            prev_price = "$"+prev_price;
        }
        const link = $(element).find('a.a-link-normal').first().attr("href")
        const img_url = $(element).find('img').attr('src')
        //calculate the discount percentage of the product
        let discount = ""
        if(prev_price!="" && price!="") {
            const prev_price_num = parseFloat(prev_price.substring(1, prev_price.length).split(',').join(''))
            const current_price_num = parseFloat(price.substring(1, price.length).split(',').join(''))
            discount = parseInt(((prev_price_num-current_price_num)/prev_price_num)*100) + "%";
        }
        let labels = []
        const label1 = $(element).find("div[class^='BadgeAutomatedLabel']").first().text()
        const label2 = $(element).find("div[class^='DealMessaging-module']").first().text()
        if (label1 && label1!=="") {
            labels.push(label1)
        }
        if (label2 && label2!=="") {
            labels.push(label2)
        }
        if (title && price && title !== "" && price !== "") {
            result.push({title, price, prev_price, link, img_url, labels:labels, website:"Amazon", discount, reviews:"", stars:""});
            prev_title = title;
        }
    })
     console.log("finished scraped amazon deal page")
    return result
}

module.exports = {getProducts, getComments, getDeals}