//    add as univerisal variables in JS ================================
var closingValue1 = [];
var stock1 = "";
var closingValue2 = [];
var stock2 = "";
var closingDate = [];
var newsCompany = "";

//    add as univerisal variables in JS ================================

$("#searchBtn2").click(function () {
  var vantageKey = "PPU2C3YN8OQAFVPV";
  var company = $("#companySearch2").val();
  console.log(company);

  // searching company name and gathering stock abbreviation

  var symbolSearch =
    "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
    company +
    "&apikey=" +
    vantageKey;

  $.ajax({
    url: symbolSearch,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    company = selectOneStock(response.bestMatches);
  });

  // COMPANY OVERVIEW API CALL

  var overviewUrl =
    "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" +
    company +
    "&apikey=" +
    vantageKey;

  $.ajax({
    url: overviewUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    // NEWS SEARCH API CALL
    var newsCompany = response.Name;

    var newsUrl =
      "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
      newsCompany +
      "&api-key=mucdpZxSaLprDSOXjHQmG9skw5jyQeci";

    $.ajax({
      url: newsUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response.response.docs[0]);
    });
  });

  // STOCK DATA API CALL

  var stockUrl =
    "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" +
    company +
    "&apikey=" +
    vantageKey;

  $.ajax({
    url: stockUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    //  MAKE SURE TO CLEAR THE DATA ONCLICK EVENT SO IT DOESN"T TACK THEM ON !!!!!!
    // My stuff to add =============================================================
    //source: chartjs.org
    stock1 = response["Meta Data"][Symbol];

    for (let i = 0; i < 52; i++) {
      var priceDate = Object.keys(response["Weekly Time Series"])[i];
      // console.log(response["Weekly Time Series"][priceDate]["4. close"]);
      closingValue1.unshift(
        response["Weekly Time Series"][priceDate]["4. close"]
      );
      closingDate.unshift(priceDate);
    }

    visualData();
    function visualData() {
      var ctx = document.getElementById("chart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: closingDate, //what is listed as the x axis value
          datasets: [
            {
              label: stock1,
              data: closingValue1,
              backgroundColor: "rgba(0, 0, 0, 1)",
              borderColor: "rgba(0, 0, 0, 1)",
              borderWidth: 3,
              fill: false,
            },
            {
              label: stock2,
              data: closingValue2,
              backgroundColor: "rgba(150, 150, 150, 1)",
              borderColor: "rgba(150, 150, 150, 1)",
              borderWidth: 3,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  // beginAtZero: true
                  callback: function (value, index, values) {
                    return "$" + value;
                  },
                },
              },
            ],
          },
        },
      });
    }

    //    Local storage stuff
    var stockSymbol = "tsla";
    localStorage.setItem("key1", stockSymbol);

    var storedInfo = localStorage.getItem("key1");
    function displayLastSearch() {
      if (storedInfo !== undefined && storedInfo !== null) {
        stockSymbol = storedInfo;
      }
    }

    $("#searchBtn2").click(addsecond());

    function addsecond() {
      for (let i = 0; i < 52; i++) {
        closingValue2.unshift(i * 20);
      }
      visualData();
    }

    // End of my stuff to add =============================================================

    for (let data of Object.entries(response["Weekly Time Series"])) {
      // console.log(data);
    }
  });
});

// Other data

// These don't yet exist on the page, but we can add easily
// High and low price in the last year
$("#high").text(high);
var testArray = [1, 6, 8, 9, 9];
var high =
  "$" +
  testArray.reduce(function (a, b) {
    return Math.max(a, b);
  });
var low =
  "$" +
  testArray.reduce(function (a, b) {
    return Math.min(a, b);
  });



function selectOneStock(arrBestMatches) {
  
  $("#stockList").empty();

  if (arrBestMatches.length == 0) {
    alert("The company does not have a stock symbol");
    return usMatches[0].symbol;
  }

  var usMatches = [];
  var maxMatches = arrBestMatches.length;
  if (maxMatches > 75) {
    maxMatches = 75;
  }
  for (i = 0; i < maxMatches; i++) {
    if (arrBestMatches[i]["4. region"] === "United States") {
      var objComp = {
        symbol: arrBestMatches[i]["1. symbol"],
        name: arrBestMatches[i]["2. name"],
      };
      usMatches.push(objComp);
    }
  }

  if (usMatches.length == 1) {
    alert(usMatches[0].symbol);
    return usMatches[0].symbol;
  }

  for (var i = 0; i < usMatches.length; i++) {
    var bStk = $("<button>")
      .attr("type", "submit")
      .text(usMatches[i].symbol + " " + usMatches[i].name)
      .attr("id", usMatches[i].symbol)
      .attr("class","waves-effect waves-light btn")
      .click(function () {
        alert("Symbol " + this.id + " has been selected");
        return this.id;
      });
    $("#stockList").append(bStk);
  }
}

//price has gone up or down since last week, color change as well
var testCurrentDay = 75.31;
var testPreviousDay = 76.82;
function percentageChange(current, previous) {
  var change = current - previous;
  return (change / previous) * 100;
}
var changeStock = percentageChange(testCurrentDay, testPreviousDay);
if (changeStock > 0) {
  $("#percent").attr("class", "green");
} else if (changeStock < 0) {
  $("#percent").attr("class", "red");
} else {
  $("#percent").attr("class", "black");
}
console.log();
