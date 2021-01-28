$("#searchBtn").click(function () {
  var company = $("#companySearch").val();
  console.log(company);

  // searching company name and gathering stock abbreviation

  var symbolSearch =
    "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
    company +
    "&apikey=HJSI78XPL8KLZ1JA";

  $.ajax({
    url: symbolSearch,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    company = selectOneStock(response.bestMatches);

  });

  // ajax calls for stock information

  var overviewUrl =
    "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" +
    company +
    "&apikey=HJSI78XPL8KLZ1JA";

  $.ajax({
    url: overviewUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });

  var stockUrl =
    "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" +
    company +
    "&apikey=HJSI78XPL8KLZ1JA";

  $.ajax({
    url: stockUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    for (let data of Object.entries(response["Weekly Time Series"])) {
      console.log(data);
    }
  });
});


function selectOneStock(arrBestMatches) {
  $("#stockList").empty();
  if (arrBestMatches.length == 0) {
    alert('The company does not have a stock symbol');
    return (usMatches[0].symbol);
  };

  var usMatches = [];
  var maxMatches = arrBestMatches.length;
  if (maxMatches > 75) {
    maxMatches = 75;
  }
  for (i = 0; i < maxMatches; i++) {
    if (arrBestMatches[i]["4. region"] === "United States") {
      var objComp = {
        symbol: arrBestMatches[i]["1. symbol"],
        name: arrBestMatches[i]["2. name"]
      };
      usMatches.push(objComp);
    };
  };

  if (usMatches.length == 1) {
    alert(usMatches[0].symbol);
    return (usMatches[0].symbol);
  };

  for (var i = 0; i < usMatches.length; i++) {
    var bStk = $("<button>")
      .attr("type", "submit")
      .text(usMatches[i].symbol + " " + usMatches[i].name)
      .attr("id", usMatches[i].symbol)
      .click(function () {
        alert("Symbol " + this.id + " has been selected")
        return (this.id);
      });
    $("#stockList").append(bStk);
  }

}

