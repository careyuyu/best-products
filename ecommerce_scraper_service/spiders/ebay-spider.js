var axios = require('axios');
var cheerio = require('cheerio');
require('dotenv').config()
const puppeteer = require('puppeteer')

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
async function getProducts(product_name) {
    console.log("ebay request start on "+product_name)

    //prepare headers for the request
    const url = getProxyUrl(PARSE_URLS+product_name)
    var result = []

    //scrap ebay result page using axios
    await axios.get(url).then(res => {
        let $ = cheerio.load(res.data);
        var items = $('div.srp-river-results.clearfix ul li.s-item.s-item__pl-on-bottom')
        items.each((i, element)=>{
            const title = $(element).find('h3.s-item__title').text() || ""
            const price = $(element).find('span.s-item__price').first().text() || ""
            const prev_price = $(element).find('span.s-item__trending-price span.STRIKETHROUGH').text() || ""
            const discount = $(element).find('span.s-item__discount').text().split(" ")[0] || ""
            var stars = $($(element).find('span.clipped')[1]).text()
            stars = stars.charAt(stars.length-1)=='.'?stars:null
            const reviews = $(element).find('span.s-item__reviews-count').children().first().text().split(" ")[0] || ""
            const link = $(element).find('a.s-item__link').attr('href') || ""
            const img_url = $(element).find('img.s-item__image-img').attr('src')
            let labels = []
            const label1 = $(element).find("span.BOLD.NEGATIVE").text()
            if (label1 && label1!=="") {
                labels.push(label1)
            }
            //console.log(title)
            result.push({title, price, stars, reviews, link, img_url, prev_price, discount, "website":"ebay", labels})
        })
    }).catch((err)=>{
        console.log(err)
        result = []
    })

    console.log("finished ebay request on "+product_name)
    
    //console.log(result);
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
            const title = $(element).find("p.review-item-title").text().replace(/[\r\n]/gm, '') || ""
            const detail = $(element).find("p.review-item-content").text().replace(/[\r\n]/gm, '') || ""
            const stars = $(element).find("div.ebay-star-rating").attr("aria-label") || ""
            const author = $(element).find("a.review-item-author").text() || ""
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
 */async function getDeals() {
    const url = "https://www.ebay.com/deals"
    //get the detail page of the product
    var result = []
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(1000);
    const res = await page.content();
    const $ = cheerio.load(res);
    var products = $("div.ebayui-dne-item-featured-card.ebayui-dne-item-featured-card div.row div.col")
    products.each((i,element)=>{
        const detail = $(element).find('div.dne-itemtile-detail')
        const link = $(detail).find("a[itemprop='url']").attr('href')
        const title = $(detail).find("span[itemprop='name']").text()
        const price = $(detail).find("span[itemprop='price']").text().replace(' ', '');
        const prev_price =$(detail).find("span.itemtile-price-strikethrough").text().replace(' ', '');
        const img_url = $(element).find("img").attr('src')
        const labels = $(detail).find("span.itemtile-price-bold").text()
        let discount = ""
        if(prev_price!="" && price!="") {
            const prev_price_num = parseFloat(prev_price.substring(1, prev_price.length).split(',').join(''))
            const current_price_num = parseFloat(price.substring(1, price.length).split(',').join(''))
            discount = parseInt(((prev_price_num-current_price_num)/prev_price_num)*100) + "%";
        }
        result.push({title, price, prev_price, link, img_url, labels:[labels], website:"ebay", discount, reviews:"", stars:""})
    })
     console.log("finished scraped ebay deal page")
    return result
}


module.exports = {getProducts, getComments, getDeals}
