// This is a complete rebuild of main.js from the previous instance
// After the methodolagy of the plugins has been worked out this can be refined
// and allow better configuration

// This is used to start the function essentially.
apiInit();

var updateFrequency = 300000;

async function apiInit() {
  console.log('Status Check Started...');

  // Here we can use the built in ReturnItems API,
  // This returns an HTML Collection of all Items that use this plugin
  var elements = pluginAPI.ReturnItems('statusCheck');

  // Since HTML Collection has no forEach Method, we will use a standard for loop
  for (var i = 0; i < elements.length; i++) {

    // Now we are able to grab any attribute available for our plugin
    // data-url is the url of the item we are attached to
    var itemURL = elements[i].getAttribute('data-url');
    // data-options is the raw value of the options available for our plugin
    // This will be in the exact format of options.autofill
    var rawOptions = elements[i].getAttribute('data-options');
    // But we can use another buit in method to turn this into JSON data
    var parseOptions = pluginAPI.ParseConfig(rawOptions);

    // now we can spawn our main function giving it this data
    await statusCheckLogic(itemURL, parseOptions)
      .then(res => {
        elements[i].innerHTML = res;
      })
      .catch(err => {
        elements[i].innerHTML = err;
      });
  }
}

function statusCheckLogic(url, config) {
  return new Promise(function(resolve, reject) {
    try {
      // Here we will let the available status codes be an easily accessed index
      // while accounting for the possiblity of this being blank and reverting to default.
      var acceptedStatusCode = [ 200 ];
      var tempAcceptedStatusCode = config.statusCodes ? config.statusCodes : [ 200 ];
      // But we can't stop here. Since this data is a string, this leaves it as a string. Making indexOf return partial matches.
      // We will need to conver this to an array.
      var splitCodes = tempAcceptedStatusCode.split(',');
      var acceptedStatusCode = [];
      splitCodes.forEach((element, index) =>{
        // Then we want to remove the normal brackets.
        // conver the item to an int, since we don't want to push a string to the array,
        // and finally add that to the array for checking
        var eleRem1 = element.replace('[', '');
        var eleRem2 = eleRem1.replace(']', '');
        var eleInt = parseInt(eleRem2);
        acceptedStatusCode.push(eleInt);
      });

      fetch(`/api/ping?url=${url}`)
        .then(response => response.json())
        .then(data => {
          // This lets the user per item define acceptible status codes.
          if (acceptedStatusCode.indexOf(data) != -1) {
            resolve(`<span style="height: 25px; width: 25px; border-radius: 50%; display: inline-block; background-color: green; cursor: pointer;">&#10004;</span>`);

          } else {
            resolve(`<span style="height: 25px; width: 25px; border-radius: 50%; display: inline-block; background-color: red; cursor: pointer">&#10006</span>`);
          }
        });
    } catch(err) {
      reject(err);
    }
  });
}

// This below will ensure after the first time run to run again after the updateTime,
// Then within refreshFunc it asks it to refresh again after the updateTime
// Ensuring every 5 minutes this is updated 
var refreshFunc = function() {
  apiInit();
  setTimeout(refreshFunc, updateFrequency);
};
setTimeout(refreshFunc, updateFrequency);
