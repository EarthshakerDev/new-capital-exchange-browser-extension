//
// Exchange ticker API
const NewCapitalExchangeTicker = "https://api.new.capital/v1/ticker";
const NewCapitalExchangeInfo = "https://api.new.capital/v1/exchangeInfo";


// Get Exchange API data
var request = new XMLHttpRequest();

request.open("GET", NewCapitalExchangeTicker, true);
request.onload = function() {

    // Get JSON data
    var data = JSON.parse(request.response);

    if (request.status >= 200 && request.status < 400) {
        hideLoader();
        generateAssets(data);
    } else {
        alert('An error occured while trying to get Exchange data. Please try again!');
    }
};

request.send();



// Generate cryptocurrency assets information
function generateAssets (data) {

    // Get assets list element
    var assetsList = document.getElementById("nce-assets-list");

    // Assets pairs
    var pairs = ["TWINS", "BTC"];


    pairs.forEach( function(item){

        for (var i = 0; i < data.length; i++) {

            // Get basic values
            var symbol = data[i].symbol;
            var baseAsset = symbol.split('_')[0];
            var quoteAsset = symbol.split('_')[1];
            var assetFullName = getAssetFullName(baseAsset);
            var priceChangePercent = parseFloat(data[i].priceChangePercent).toFixed(2);
            var lastPrice = data[i].lastPrice;
            var highPrice = data[i].highPrice;
            var lowPrice = data[i].lowPrice;

            var priceChangeColor = "green";

            if (priceChangePercent < 0) {
                priceChangeColor = "red";
            }

            // Create an asset element
            if(quoteAsset == item){
                var html = `
                <li class="nce-asset">
                    <div class="nce-asset-info">
                        <img height="34" width="34" class="nce-asset-logo" src="/assets/images/${baseAsset}.svg" />
                        <div class="nce-asset-full-name">${assetFullName}</div>
                        <div><span class="nce-asset-symbol">${baseAsset}</span><span class="nce-asset-last-price">${lastPrice}</span><span class="nce-asset-change ${priceChangeColor}">${priceChangePercent}%</span></div>
                    </div>
                    <div class="nce-asset-24h-info">
                        <div>24h High: ${highPrice}</div>
                        <div>24h Low: ${lowPrice}</div>
                    </div>
                </li>`;

                // Add asset to the list
                assetsList.querySelector("[data-content-cc='" + item + "']").insertAdjacentHTML("beforeend", html);
            }

        };

    });



}


// Create asset full name from the base name
function getAssetFullName(base) {

    var assetFullName = "";

    switch (base) {
        case "BCH":
            assetFullName = "Bitcoin Cash";
            break;
        case "BTC":
            assetFullName = "Bitcoin";
            break;
        case "FIX":
            assetFullName = "Fix Coin";
            break;
        case "LTC":
            assetFullName = "Litecoin";
            break;
        case "XEM":
            assetFullName = "NEM";
            break;
        case "TWINS":
            assetFullName = "win.win";
            break;
        case "TRTT":
            assetFullName = "Trittium";
            break;
        case "DOGEC":
            assetFullName = "DogeCash";
            break;
        case "STREAM":
            assetFullName = "Streamit Coin";
            break;
    }

    return assetFullName;
}

// Hide loader
function hideLoader () {
    var loader = document.getElementById("nce-loader");
    loader.classList.add("hide");
}


// Switch tabs
var tabs = document.querySelectorAll('.nce-tab');

for (var i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function(e) {
      switchTabs(tabs, e.target);
  });
}

function switchTabs (tabs, element) {
    var tabData = element.dataset.tabCc;
    var tabContents = document.querySelectorAll('.nce-tab-content');

    // Set active class on tabs
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');

        element.classList.add('active');
    }

    // Set active class on tabs content
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');

        if(tabContents[i].dataset.contentCc == tabData) {
            tabContents[i].classList.add('active');
        }
    }
}
