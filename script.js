

  //Universal variables and placeholders that need to be unversal scope
var weeklyValue = [];
var weeklyDate = [];
var vantageKey = "PPU2C3YN8OQAFVPV";        //stock api key
var newsApiKey = "mucdpZxSaLprDSOXjHQmG9skw5jyQeci";
var currentCompany = "";
var currentSymbol = "";



            //==================PART I === Search Bar ==============\\
$("#searchBtn2").click(function () {
  var tempCompany = $("#companySearch2").val();   //form to get user search input
                      // URL that searches best matches for possible company symbol
  var getSymbol =
    "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" +
    tempCompany +
    "&apikey=" +
    vantageKey;
      // API Call that gets the symbol from the user and esablishes the currentCompany
  $.ajax({
    url: getSymbol,
    method: "GET",
  }).then(function (response) {
    currentCompany = selectOneStock(response.bestMatches);
    
    console.log(currentCompany)
          // function for deciding which stock the user wants
function selectOneStock(arrBestMatches) {
  
  $("#stockList").empty();

  if (arrBestMatches.length == 0) {
    alert("The company does not have a stock symbol");
    $("#stockList").text("0 results found");
   return;
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
      //console.log(objComp);
    }
  }

  if (usMatches.length == 1) {
    currentSymbol = usMatches[0].symbol;        
    currentCompany = usMatches[0].name;         
    weeklyDate = [];
    weeklyValue = [];
    buildCompanyInfo();
    buildStockInfo();
    buildNewsInfo();
    localStorage.setItem("key1", stockSymbol)
    return;
  }

  for (var i = 0; i < usMatches.length; i++) {
    var bStk = $("<button>")
      .attr("type", "submit")
      .attr("name", usMatches[i].name)
      .attr("class", "btnColor")
      .attr("id", usMatches[i].symbol)
      .text(usMatches[i].symbol + " " + usMatches[i].name)
      .click(function generatePage () {
        currentSymbol = this.id;        
        currentCompany = this.name;         
        weeklyDate = [];
        weeklyValue = [];
        buildCompanyInfo();
        buildStockInfo();
        buildNewsInfo();
        localStorage.setItem("key1", stockSymbol);
        // alert("Symbol " + this.id + " has been selected");
        // return this.id;
      });
    $("#stockList").append(bStk);
  }
}   //end of select one stock function, then updates unverisal variable with symbol
}); //end of api call that decides our comany
}); // end of function that occurs when user clicks search

        //===========END OF PART I ======================================\\
        //==========PART II=== Company INFO=========\\
function buildCompanyInfo() {


        // new url that takes the comany as a symbol not user input
        var companySearch =
        "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" +
        currentSymbol +
        "&apikey=" +
        vantageKey;
    
          //API call to use symbol to call company info
      $.ajax({
        url: companySearch,
        method: "GET",
      }).then(function (response) {
          return response;


      });
              // END of UseSycompany info API

  
} //end of function that build company info

        //===========END OF PART II==========================\\
        //===========PART III===Stock Performance=============\\
function buildStockInfo() {

          // URL to call API for the STOCK INFO
          var stockUrl =
          "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=" +
          currentSymbol +
          "&apikey=" +
          vantageKey;
            // API CALL for the STOCK INFO in order to build chart and display high low etc
        $.ajax({
          url: stockUrl,
          method: "GET",
        }).then(function (response) {


              //Assembles the data that is inserted into the chart
          for (let i = 0; i < 52; i++) {
            var priceDate = Object.keys(response["Weekly Time Series"])[i];
            // console.log(response["Weekly Time Series"][priceDate]["4. close"]);
            weeklyValue.unshift(
              response["Weekly Time Series"][priceDate]["4. close"]
            );
            weeklyDate.unshift(priceDate);
          }
          visualData();
      
              //function the builds the chart into the page on the canvas element
                  //source: chartjs.org  
          function visualData() {
            var ctx = document.getElementById("chart").getContext("2d");
            Chart.defaults.global.defaultFontColor = 'black';
            var myChart = new Chart(ctx, {
              type: "line",
              data: {
                labels: weeklyDate, //what is listed as the x axis value
                datasets: [
                  {
                    label: currentCompany,
                    data: weeklyValue,
                    backgroundColor: "rgba(0, 0, 0, 1)",
                    borderColor: "rgba(0, 0, 0, 1)",
                    borderWidth: 3,
                    fill: false,
                  }
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
          }  //End of the stuff the builds the chart on the canvas element
        }); //END of STOCK API
  } //end of build page function
  

        //==========END OF PART III=================\\
        //==========PART IV======NEWS===========\\
function buildNewsInfo() {
                //URL for calling the news API
          var newsCompany =
            "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" +
            currentCompany +
            "&api-key=" + 
            newsApiKey;

        $.ajax({
          url: newsCompany,
          method: "GET",
        }).then(function (response) {
            // return response;
            var headLine = response.response.docs[0].headline.main;
            var snippet = response.response.docs[0].snippet;
            // var newsUrl = response.response.docs[0].web_url;
            newsAppended();
            function newsAppended() {
              $("#newsHeadLine").text(headLine);
              $("#newsSnippet").text(snippet);
              console.log(headLine);
            }

            
        })  //end of NEWS API stuff
}// end of buildNewsInfo


        //==========END OF PART IV=================\\








    //    Local storage stuff
   

    var storedInfo = localStorage.getItem("key1");
    function displayLastSearch() {
      if (storedInfo !== undefined && storedInfo !== null) {
        currentSymbol = storedInfo;
        buildCompanyInfo();
        buildStockInfo();
        buildNewsInfo();
      }
    }
    $(document).ready(displayLastSearch());

    




