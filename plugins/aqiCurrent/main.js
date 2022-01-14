init();

async function init() {
  console.log('AQI Current Started...');

  var elements = pluginAPI.ReturnItems('aqiCurrent');

  for (var i = 0; i < elements.length; i++) {
    var rawOptions = elements[i].getAttribute('data-options');

    var parseOptions = pluginAPI.ParseConfig(rawOptions);

    await mainLogic(parseOptions)
      .then(res => {
        elements[i].innerHTML = res;
      })
      .catch(err => {
        elements[i].innerHTML = err;
      });
  }
}

function mainLogic(options) {
  return new Promise(function (resolve, reject) {
    var apiKey = options.apikey;
    var zipCode = options.zipcode;

    try {
      fetch(`https://www.airnowapi.org/aq/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          // while we could care about the AQI levels in the ozone, we will focus on ground level amounts of PM2.5
          // O3: [0] - PM2.5: [1]
          resolve(data[1].AQI);
        });
    } catch(err) {
      reject(err);
    }
  });
}


// Example API Return Data (only [1] or PM2.5 data)
// https://docs.airnowapi.org/aq101
/*
AQI: int,
Category: {
  Number: int,
  Name: "string"
},
DateObserved: "string",
HourObserved: int,
Latitude: float,
LocalTimeZone: "string",
Longitude: int,
ParameterName: "PM2.5",
ReportingArea: "string (city)",
StateCode: "string (state)"
*/
