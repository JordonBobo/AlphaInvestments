$("#searchBtn").click(function () {
  var vantageKey = "PPU2C3YN8OQAFVPV";
  var company = $("#companySearch").val();
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
    for (i = 0; i < response.bestMatches.length; i++) {
      if (response.bestMatches[i]["4. region"] === "United States") {
        console.log(response.bestMatches[i]["1. symbol"]);
      }
    }
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
    for (let data of Object.entries(response["Weekly Time Series"])) {
      console.log(data);
    }
  });
});
