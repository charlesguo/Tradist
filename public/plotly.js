// var data2 = [
//   {
//     "Counter": "AAPL",
//     "Name": "Apple",
//     "Mkt Cap": 609.85,
//     "3_mth_vol": 42702133,
//     "3_mth_pchg": "3.46%",
//     "6_mth_vol": 46946250,
//     "6_mth_pchg": "4.89%",
//     "1_yr_vol": 51374077,
//     "1_yr_pchg": "5.48%",
//     "3_yr_vol": 68097754,
//     "3_yr_pchg": "7.37%",
//     "5_yr_vol": 94045497,
//     "5_yr_pchg": "7.10%"
//   },
//   {
//     "Counter": "BP",
//     "Name": "British Petroleum",
//     "Mkt Cap": 99.1,
//     "3_mth_vol": 11972500,
//     "3_mth_pchg": "4.44%",
//     "6_mth_vol": 10404267,
//     "6_mth_pchg": "5.96%",
//     "1_yr_vol": 8635862,
//     "1_yr_pchg": "6.04%",
//     "3_yr_vol": 7001922,
//     "3_yr_pchg": "4.75%",
//     "5_yr_vol": 7301836,
//     "5_yr_pchg": "4.96%"
//   },
//   {
//     "Counter": "SBUX",
//     "Name": "Starbucks",
//     "Mkt Cap": 90.19,
//     "3_mth_vol": 12922300,
//     "3_mth_pchg": "4.26%",
//     "6_mth_vol": 11507067,
//     "6_mth_pchg": "4.08%",
//     "1_yr_vol": 10060631,
//     "1_yr_pchg": "5.52%",
//     "3_yr_vol": 9882154,
//     "3_yr_pchg": "5.32%",
//     "5_yr_vol": 11992849,
//     "5_yr_pchg": "5.43%"
//   }
// ];

$(document).ready(function() {
    $.get('/bubbles?token=' + window.localStorage.getItem('token'), function(stocks) {

      var data = [];
      feedData();

      function feedData() {
          for (var i=0; i<stocks.length; i++) {
              var current = {
                  name: stocks[i]["counter"],
                  text: [stocks[i]["name"]],
                  marker: {
                    sizemode: "area",
                    sizeref: 0.1,
                    size : [stocks[i]["mkt_cap"]]
                  },
                  mode: "markers",
                  y: [stocks[i]["vol_3_mth"]],
                  x: [stocks[i]["pchg_3_mth"]]
              };
              data.push(current);
          }
      };

      var layout = {
        xaxis: {
          title: 'Average Monthly Price Change (%)'
        },
        yaxis: {
          title: 'Volume'
        },
        margin: {
          t: 30
        },
        hovermode: 'closest'
      };

      Plotly.plot('tester', data, layout);
    });
  });

//
//
//
// var data = [{
//   name: data2[0]["Counter"],
//   text: [data2[0]["Name"]],
//   marker: {
//     sizemode: "area",
//     sizeref: 0.1,
//     size : [data2[0]["Mkt Cap"]]
//   },
//   mode: "markers",
//   y: [data2[0]["3_mth_vol"]],
//   x: [data2[0]["3_mth_pchg"]]
// },
// {
//   name: data2[1]["Counter"],
//   text: [data2[1]["Name"]],
//   marker: {
//     sizemode: "area",
//     sizeref: 0.1,
//     size: [data2[1]["Mkt Cap"]]
//   },
//   mode: "markers",
//   y: [data2[1]["3_mth_vol"]],
//   x: [data2[1]["3_mth_pchg"]],
//   uid: "9d3ba4"
// },
// {
//   name: data2[2]["Counter"],
//   text: data2[2]["Name"],
//   marker: {
//     sizemode: "area",
//     sizeref: 0.1,
//     size: [data2[2]["Mkt Cap"]]
//   },
//   mode: "markers",
//   y: [data2[2]["3_mth_vol"]],
//   x: [data2[1]["3_mth_pchg"]],
//   uid: "f9fb74"
// }];
