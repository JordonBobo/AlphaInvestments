$("#searchBtn").click(function () {
  var company = $("#companySearch").val();
  console.log(company);
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

    for (let [data] of Object.entries(response["Weekly Time Series"])) {
      console.log(data);
    }
  });
});
