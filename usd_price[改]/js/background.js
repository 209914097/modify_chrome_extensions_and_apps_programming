function httpRequest(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}

function updateAmount(amount, exchange){
    amount = Number(amount);
    if(isNaN(amount) || !amount){
        exchange([{
            'content': '$1 = ¥'+price,
            'description': '$1 = ¥'+price
        },{
            'content': '¥1 = $'+(1/price).toFixed(6),
            'description': '¥1 = $'+(1/price).toFixed(6)
        }]);
    }
    else{
        exchange([{
            'content': '$'+amount+' = ¥'+(amount*price).toFixed(2),
            'description': '$'+amount+' = ¥'+(amount*price).toFixed(2)
        },{
            'content': '¥'+amount+' = $'+(amount/price).toFixed(6),
            'description': '¥'+amount+' = $'+(amount/price).toFixed(6)
        }]);
    }
}

function gotoYahoo(text, disposition){
    window.open('http://finance.yahoo.com/q?s=USDCNY=X');
}

var url = 'https://query1.finance.yahoo.com/v8/finance/chart/USDCNY=X?range=1d&includePrePost=false&interval=2m&corsDomain=finance.yahoo.com&.tsrc=finance';
var price;

httpRequest(url, function(r){
    price = JSON.parse(r);
    price = price.chart.result[0].indicators.quote[0].open[667];
    price = Number(price);
});

chrome.omnibox.setDefaultSuggestion({'description':'Find current USD price.'});

chrome.omnibox.onInputChanged.addListener(updateAmount);

chrome.omnibox.onInputEntered.addListener(gotoYahoo);