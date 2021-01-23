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
    for (i = 0; i < response.bestMatches.length; i++) {
      if (response.bestMatches[i]["4. region"] === "United States") {
        console.log(response.bestMatches[i]);
      }
    }
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