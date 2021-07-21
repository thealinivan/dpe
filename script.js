//API header information
const HOST = "amazon-price1.p.rapidapi.com";
const KEY = config.amazonAPIKey;
const MARKETPLACE = "GB";

//get http reference for the required elements
let searchField = document.getElementById("search");
let render = document.getElementById("render");
let list = document.createElement("ul");
let searchBtn = document.getElementById("btn");
let carousel = document.getElementById("carousel");
let categories = document.getElementById("categories");
let cat = document.querySelectorAll('.category');
let priceControl = document.getElementById("price-control");
priceControl.style.display = "none";

//simulated target Ecommerce pricing data
//in case of a real integration the array will contain data retrieved from the target ecommerce platform database
//data in this array be generated in respect of the data returned from searching through Amazon API call..
//..using a random method within a range. This is done to facilitate proof of concept demonstration
let targetEcommPrices = [];

//interest factors that ensures minimum profit and where posibile discount in comparison to Amazon prices
//in case of real integration factors should be stored in the database and modified via admin page for increased price control
//min 10% interest ensured
const minInterestFactor = 10;
//max interest ensuring price is set 5%
const maxInterestFactor = 20;



//button onclick handler
searchBtn.addEventListener('click', () => {
    //set value before the api call
    searchBtn.setAttribute("disabled", true);
    list.setAttribute("id", "list");
    render.innerHTML = "";
    const TEXT = searchField.value;
    const FETCH_URL = "https://amazon-price1.p.rapidapi.com/search?marketplace=" + MARKETPLACE + "&keywords=" + TEXT;
    //call api and render
    fetchAPI(FETCH_URL, KEY, HOST);
    searchField.value = "";
})

//PRICE CONTROL buttons
document.getElementById("decrease-btn").addEventListener("click", () => {
    let ups = document.querySelectorAll(".priceUp");
    let downs = document.querySelectorAll(".priceDown");
    ups.forEach(up => { up.style.display = "none" });
    downs.forEach(down => { down.style.display = "block" });
})
document.getElementById("increase-btn").addEventListener("click", () => {
    let ups = document.querySelectorAll(".priceUp");
    let downs = document.querySelectorAll(".priceDown");
    ups.forEach(up => { up.style.display = "block" });
    downs.forEach(down => { down.style.display = "none" });
})
document.getElementById("reset-btn").addEventListener("click", () => {
    let ups = document.querySelectorAll(".priceUp");
    let downs = document.querySelectorAll(".priceDown");
    ups.forEach(up => { up.style.display = "none" });
    downs.forEach(down => { down.style.display = "none" });
})


for (let i = 0; i < cat.length; i++) {
    cat[i].addEventListener('click', () => {
        const SEARCH = cat[i].alt;
        const FETCH_URL = "https://amazon-price1.p.rapidapi.com/search?marketplace=" + MARKETPLACE + "&keywords=" + SEARCH;
        //call api and render
        fetchAPI(FETCH_URL, KEY, HOST);
    })
}

//fetch api and render
function fetchAPI(_url, _key, _host) {
    fetch(_url, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": _key,
            "x-rapidapi-host": _host
        }
    })
        .then(response => response.json())
        .then(data => {
            setTargetEcommPrices(data);
            renderData(data);
        })
        // catch error if api call fails
        .catch(err => {
            console.error(err);
            // finally enable the search button
        }).finally(() => {
            carousel.style.setProperty("display", "none");
            categories.style.setProperty("display", "none");
            searchBtn.removeAttribute("disabled");
        });
}

//generate random pricing for a simulated target Ecommerce platform
//targetEcommerce prices simulates target Ecommerce platform pricing data.
function setTargetEcommPrices(data) {
    data.forEach(product => {
        const floatAmazonPrice = Number(parseFloat(((product.price).substring(1)).replace(",", "")));
        const min = floatAmazonPrice - floatAmazonPrice / 20;
        const max = floatAmazonPrice + (floatAmazonPrice / 4);
        const targetEcommSalePrice = Math.random() * (max - min) + min;
        targetEcommPrices.push({
            ASIN: product.ASIN,
            aquisitionPrice: (targetEcommSalePrice - targetEcommSalePrice / 5),
            salePrice: targetEcommSalePrice
        });
    });
}

//get dynamic price considering item price from both amazon and target eCommerce platform
//generate a better price than competition (-5%) provided minimum 10% interest is achieved
function calculateDynamicPrice(amazonPrice, localAquisitionPrice, localSalePrice) {
    console.log(`AMAZON sale price: ${amazonPrice.toFixed(2)}`)
    console.log(`Local aquisition price: ${localAquisitionPrice.toFixed(2)}`)
    console.log(`Local sale price ${localSalePrice.toFixed(2)}`)
    //check for products that Amazon has better price
    if (amazonPrice < localSalePrice) {
        //set limit to target Ecommerce aquisition price with 10% interest
        if (amazonPrice > (localAquisitionPrice + localAquisitionPrice / minInterestFactor)) {
            //update price setting it to 5% less than Amazon listing
            const maxPrice = amazonPrice - amazonPrice / maxInterestFactor;
            const min10Percent = localAquisitionPrice + localAquisitionPrice / minInterestFactor;
            //ensure maximised updated dynamic price situates above 10% interest and return
            if (maxPrice > min10Percent) {
                console.log(`Update local sale price (max -5% comparing to Amazon): ${maxPrice.toFixed(2)}`)
                console.log("-----------------------")
                return maxPrice;
            } else {
                //update price setting only 10% interest
                const minPrice = localAquisitionPrice + localAquisitionPrice / minInterestFactor;
                console.log(`Update local sale price (min 10% interest): ${minPrice.toFixed(2)}`);
                console.log("-----------------------")
                return minPrice;
            }
        } else {
            //update price setting only 10% interest
            const minPrice = localAquisitionPrice + localAquisitionPrice / minInterestFactor;
            console.log(`Update local sale price (min 10% interest): ${minPrice.toFixed(2)}`);
            console.log("-----------------------")
            return minPrice;
        }
    } else {
        //keep the same price as it is already competitive (lower than Amazon)
        console.log(`Keep the same local sale price (25% interest): ${localSalePrice.toFixed(2)}`);
        console.log("-----------------------")
        return localSalePrice;
    }

}

//render data to DOM
function renderData(data) {
    priceControl.style.display = "block";
    data.forEach((product, key) => {

        //create article http elements
        let container = document.createElement("div")
        let article = document.createElement("div");
        let artImg = document.createElement("div");
        let artTitle = document.createElement("div");
        let artPrice = document.createElement("div");
        let img = document.createElement("img");
        let title = document.createElement("p");
        let price = document.createElement("p");
        let dynamicPrice = document.createElement("p");

        //create elements for dynamic price labels
        let priceUp = document.createElement("div");
        let priceUp10 = document.createElement("p");
        let priceUpPercent = document.createElement("p");

        let priceDown = document.createElement("div");
        let priceDown10 = document.createElement("p");
        let priceDownPercent = document.createElement("p");

        //set http elements attributes used to style the article
        container.setAttribute("class", "container");
        container.setAttribute("class", "ct");
        article.setAttribute("class", "row");
        artImg.setAttribute("class", "col-sm-12 col-md-2 col-lg-2");
        artTitle.setAttribute("class", "col-sm-12 col-md-7 col-lg-7");
        artPrice.setAttribute("class", "artPrice col-sm-12 col-md-3 col-lg-3");
        img.setAttribute("class", "el");
        img.setAttribute("id", "art-img");
        title.setAttribute("class", "el");
        title.setAttribute("id", "art-title");
        title.style.fontWeight = "bold";
        price.setAttribute("class", "el");
        price.setAttribute("id", "art-price");
        dynamicPrice.setAttribute("class", "el");
        dynamicPrice.setAttribute("id", "art-dynamic-price");


        priceUp.setAttribute("class", "priceUp");
        priceDown.setAttribute("class", "priceDown");

        priceUp10.setAttribute("class", "price-up");
        priceUpPercent.setAttribute("class", "price-up");
        priceDown10.setAttribute("class", "price-down");
        priceDownPercent.setAttribute("class", "price-down");

        //assign object values to elments
        container.setAttribute("href", product.detailPageURL);
        container.setAttribute("target", "_blank");
        title.innerHTML = product.title;
        img.setAttribute("src", product.imageUrl);

        // PROCESS PRICE
        //currency
        const c = "£";

        //remove commas and symbols from price
        let amzPrice = parseFloat(((product.price).substring(1)).replace(",", ""));

        //set amazon price on the DOM
        price.innerHTML = "<b>Amazon</b> | " + c + Number(amzPrice).toFixed(2);

        //update and set dynamic price for MarketPlace
        let updatedPrice = calculateDynamicPrice(amzPrice,
            targetEcommPrices[key].aquisitionPrice,
            targetEcommPrices[key].salePrice);
        dynamicPrice.innerHTML = "<b>MarketPlace</b> | " + c + Number(updatedPrice).toFixed(2);

        //calculate prices for price control
        let plus10 = amzPrice + 10;
        let plus10Percent = amzPrice + (amzPrice / 10);
        let minus10 = amzPrice - 10;
        let minus10Percent = amzPrice - (amzPrice / 10);

        //set price for price control to the DOM
        priceUp10.innerHTML = "<b>+£10</b> | " + c + Number(plus10).toFixed(2);
        priceUpPercent.innerHTML = "<b>+10%</b> | " + c + Number(plus10Percent).toFixed(2);
        priceDown10.innerHTML = "<b>-£10</b> | " + c + Number(minus10).toFixed(2);
        priceDownPercent.innerHTML = "<b>-10%</b> | " + c + Number(minus10Percent).toFixed(2);

        //append price control
        priceUp.appendChild(priceUp10);
        priceUp.appendChild(priceUpPercent);
        priceDown.appendChild(priceDown10);
        priceDown.appendChild(priceDownPercent);

        //append elements to the article
        artImg.appendChild(img);
        artTitle.appendChild(title);
        artPrice.appendChild(dynamicPrice);
        artPrice.appendChild(price);
        artPrice.appendChild(priceUp);
        artPrice.appendChild(priceDown);
        article.appendChild(artImg);
        article.appendChild(artTitle);
        article.appendChild(artPrice);
        container.appendChild(article);

        //make default view for calculated prices as hidden
        priceUp.style.display = "none";
        priceDown.style.display = "none";

        //append article to the list
        render.appendChild(container);

    })


}