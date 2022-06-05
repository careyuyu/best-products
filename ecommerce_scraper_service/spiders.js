var axios = require('axios');
var cheerio = require('cheerio');

const PARSE_URLS = {
    "amazon": "https://www.amazon.com/s?k=",
    "ebay": "https://www.ebay.com/sch/i.html?_nkw="
}

//fetch product data from amazon.com
async function parseAmazon(product_name) {
    //prepare headers for the request
    const url = PARSE_URLS["amazon"]+product_name
    const headers = {
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36'
    }
    var result = []

    //scrap amazon result page using axios
    await axios.get(url, {headers:headers}).then(res => {
        let $ = cheerio.load(res.data);
        var items = $('div.s-card-container.s-overflow-hidden.aok-relative.s-expand-height.s-include-content-margin.s-latency-cf-section.s-card-border')
        items.each((i, element)=>{
            const title = $(element).find('span.a-size-base-plus.a-color-base.a-text-normal').text()
            const price = $(element).find('span.a-offscreen').first().text()
            var popularity_info = $($(element).find('div.a-row.a-size-small')[0]).children()
            const stars = $(popularity_info[0]).attr("aria-label")
            const reviews = $(popularity_info[1]).attr("aria-label")
            const link = "https://www.amazon.com/"+$(element).find('a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style.a-text-normal').attr('href');
            const img_url = $(element).find('img').first().attr('src')

            result.push({title, price, stars, reviews, link, img_url, "website":"amazon"})
        })
    })
    
    //console.log(result);
    return result;
}

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
            console.log(title+"  "+price+"  "+stars)
        })
    })
    
    //console.log(result);
    return result;
}

module.exports = {parseAmazon, parseEbay}
