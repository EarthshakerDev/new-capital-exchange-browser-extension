//
// Exchange ticker API
const NewCapitalExchangeTicker = "https://api.new.capital/v1/ticker";
const NewCapitalExchangeInfo = "https://api.new.capital/v1/exchangeInfo";
const CoinGeckoAssetInfo = "https://api.coingecko.com/api/v3/coins/";

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
    var pairs = ["TWINS", "BTC", "XEM"];


    // Get Exchange API data for prices
    var request2 = new XMLHttpRequest();

    request2.open("GET", NewCapitalExchangeInfo, true);
    request2.onload = function() {


        // Get JSON data
        var data2 = JSON.parse(request2.response);
        var btcUsd = data2.usd_price.BTC;
        var twinsUsd = data2.usd_price.TWINS;

        if (request2.status >= 200 && request2.status < 400) {

            pairs.forEach( function(item){

                for (var i = 0; i < data.length; i++) {

                    // Get basic values
                    var symbol = data[i].symbol;
                    var baseAsset = symbol.split('_')[0];
                    var quoteAsset = symbol.split('_')[1];
                    var assetFullName = getAssetFullName(baseAsset, data2);
                    var priceChangePercent = parseFloat(data[i].priceChangePercent).toFixed(2);
                    var lastPrice = data[i].lastPrice;
                    var highPrice = data[i].highPrice;
                    var lowPrice = data[i].lowPrice;

                    if(quoteAsset == "BTC"){
                        var lastPriceUsd = lastPrice * btcUsd;
                        var highPriceUsd = highPrice * btcUsd;
                        var lowPriceUsd = lowPrice * btcUsd;

                        // Satoshi emphasis
                        var lastPrice = btcSatoshi(lastPrice);
                        var highPrice = btcSatoshi(highPrice);
                        var lowPrice = btcSatoshi(lowPrice);
                    }

                    if(quoteAsset == "TWINS"){
                        var lastPriceUsd = lastPrice * twinsUsd;
                        var highPriceUsd = highPrice * twinsUsd;
                        var lowPriceUsd = lowPrice * twinsUsd;
                    }

                    var priceChangeColor = "green";

                    if (priceChangePercent < 0) {
                        priceChangeColor = "red";
                    }

                    // Create an asset element
                    if(quoteAsset == item){
                        var html = `
                        <li class="nce-asset" data-asset="${baseAsset}">
                            <div class="nce-asset-exchange-info">
                                <div class="nce-asset-info">
                                    <img height="34" width="34" class="nce-asset-logo" src="/assets/images/${baseAsset}.svg" />
                                    <div class="nce-asset-full-name">${assetFullName}<span class="nce-stats-btn"></span></div>
                                    <div><span class="nce-asset-symbol">${baseAsset}</span><span class="nce-asset-last-price"><span class="normal-price">${lastPrice}</span><span class="usd-price">${lastPriceUsd.toFixed(5)}$</span></span><span class="nce-asset-change ${priceChangeColor}">${priceChangePercent}%</span></div>
                                </div>
                                <div class="nce-asset-24h-info">
                                    <div>24h High: <span class="normal-price">${highPrice}</span><span class="usd-price">${highPriceUsd.toFixed(5)}$</span></div>
                                    <div>24h Low: <span class="normal-price">${lowPrice}</span><span class="usd-price">${lowPriceUsd.toFixed(5)}$</span></div>
                                </div>
                            </div>
                            <div class="nce-asset-global-info">
                                <div class="nce-asset-stats">
                                    <div>Market cap: <span class="nce-stat-value nce-stats-mc"></span></div>
                                    <div>Circulating supply: <span class="nce-stat-value nce-stats-cs"></span></div>
                                    <div>Max supply: <span class="nce-stat-value nce-stats-ms"></span></div>

                                    <div>Website: <span class="nce-stat-value nce-stats-web"></span></div>
                                    <div>Explorer: <span class="nce-stat-value nce-stats-exp"></span></div>
                                </div>
                            </div>
                        </li>`;

                        // Add asset to the list
                        assetsList.querySelector("[data-content-cc='" + item + "']").insertAdjacentHTML("beforeend", html);
                    }
                };
            });

        } else {
            alert('An error occured while trying to get Exchange data. Please try again!');
        }
    };

    request2.send();

}


// Create asset full name from the base name
function getAssetFullName(base, data) {

    var assetFullName = "";
    var assetsData = data.symbols;;

    for (var i = 0; i < assetsData.length; i++) {

        var symbolFromData = assetsData[i].symbol;
        var baseAssetFromData = symbolFromData.split('_')[0];

        if(base == baseAssetFromData) {
            assetFullName = assetsData[i].baseAssetName;
        }
    }

    return assetFullName;
}


// BTC price with satoshi emphasis
function btcSatoshi(value) {

    var splitValue = value.split('.');

    var firstPart = splitValue[0];
    var secondPart = splitValue[1];

    var satoshi = secondPart.substr(0, 8);
    var subSatoshi = '<span class="nce-saubsatoshi">' + secondPart.substr(8, 20) + '</span>';

    var newValue = firstPart + '.' + satoshi + subSatoshi;

    return newValue;
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


// Show price in usd
var showUsdBtn = document.querySelector('.nce-show-usd');

showUsdBtn.addEventListener("click", function(e) {
    var assetsContainer = document.querySelector('.nce-container');
    assetsContainer.classList.toggle('usd-price-display');
});



// Display asset additional information
document.addEventListener('click',function(e){
   if(e.target.classList.contains('nce-stats-btn')){

        var asset = e.target.closest('.nce-asset');
        asset.classList.toggle('stats-opened');

        var assetName = asset.dataset.asset;

        var assetMC = asset.querySelector('.nce-stats-mc');
        var assetCS = asset.querySelector('.nce-stats-cs');
        var assetMS = asset.querySelector('.nce-stats-ms');
        var assetWEB = asset.querySelector('.nce-stats-web');
        var assetEXP = asset.querySelector('.nce-stats-exp');

        var param = "";

        // CoinGecko API asset names
        switch(assetName) {
          case "BTC":
            param = "bitcoin";
            break;
          case "DOGEC":
            param = "dogecash";
            break;
          case "FIX":
            param = "fix";
            break;
          case "STREAM":
            param = "streamit-coin";
            break;
          case "TRTT":
            param = "trittium";
            break;
          case "TWINS":
            param = "win-win";
            break;
          case "XEM":
            param = "nem";
            break;
        }


        if(asset.classList.contains('stats-opened')){
          // Get CoinGecko API data for assets info
          var request3 = new XMLHttpRequest();

          request3.open("GET", CoinGeckoAssetInfo + param, true);
          request3.onload = function() {


              // Get JSON data
              var data3 = JSON.parse(request3.response);

              if (request3.status >= 200 && request3.status < 400) {

                  assetMC.innerHTML = data3['market_data']['market_cap']['usd'].toLocaleString() + " USD";
                  assetCS.innerHTML = data3['market_data']['circulating_supply'].toLocaleString() + " " + assetName;
                  assetMS.innerHTML = data3['market_data']['total_supply'].toLocaleString() + " " + assetName;
                  assetWEB.innerHTML = '<a target="_blank" href="' + data3['links']['homepage'][0] + '">' + data3['links']['homepage'][0] + '<a/>';;
                  assetEXP.innerHTML = '<a target="_blank" href="' + data3['links']['blockchain_site'][0] + '">' + data3['links']['blockchain_site'][0] + '<a/>';

              } else {
                  assetMC.innerHTML = "Information unavailable.";
                  assetCS.innerHTML = "Information unavailable.";
                  assetMS.innerHTML = "Information unavailable.";
                  assetWEB.innerHTML = "Information unavailable.";
                  assetEXP.innerHTML = "Information unavailable.";
              }
          };

          request3.send();
        }

    }
});
