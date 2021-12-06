// This is the first plugin written for GoPage
// It's simple and goal is to test weather a website is available or not.

var updateFrequency = 300000;


// This is used to call the function that starts the logic of the plugin
apiInit();

// The below lets each timeout be effected by how long the current load is.
var refreshFunc = function() {
  apiInit();
  setTimeout(refreshFunc, updateFrequency);
}
setTimeout(refreshFunc, updateFrequency);

// This is the main function for the plugin
async function apiInit() {
  console.log('apiInit Called...');


  // Calling returnPluginItems returns an HTML Collection of all Items that use your plugin
  //var elements = returnPluginItems('statusCheck');
  var elements = pluginAPI.ReturnItems('statusCheck');
  console.log(elements);

  // Since HTML Collection has no forEach Method, we use a standard for loop here
  for (var i = 0; i < elements.length; i++) {

    // Then to allow configuration options for an item.
    //elements[i].onclick = "statusCheckConfig();return false";
    //elements[i].setAttribute("onClick", "statusCheckConfig();return false");
    // Adding an event listener since plugins don't have access to the global namespace,
    // and will be unable to set onclick on ANY elements.
    elements[i].addEventListener('click', statusCheckConfig);

    // getAttribute('data-url') makes the URL of the item easily available for the plugin. Letting you operate on it as needed.
    var itemURL = elements[i].getAttribute('data-url');

    await statusCheckLogic(itemURL)
      .then(res => {
        elements[i].innerHTML = res;
      })
      .catch(err => {
        elements[i].innerHTML = err;
      });
  }
}

function statusCheckLogic(url) {
  return new Promise(function (resolve, reject) {
    try {
      console.log(`statusCheck Called: ${url}`);
      console.log(`/api/ping?url=${url}`);
      // Using the built in API of GoPage Ping
      // We are able to provide the query url and receive a statusCode back, and work with as needed
      // Here this is simply then returning green checkmark if 200 and red X for everything else
      fetch(`/api/ping?url=${url}`)
        .then(response => response.json())
        .then(data => {
          if (data == 200) {
            // successful status code
            resolve(`<span style="height: 25px; width: 25px; border-radius: 50%; display: inline-block; background-color: green; cursor: pointer;">&#10004;</span>`);
          } else {
            // unsuccessful status code
            resolve(`<span style="height: 25px; width: 25px; border-radius: 50%; display: inline-block; background-color: red; cursor: pointer">&#10006</span>`);
          }
        });
    } catch(err) {
      reject(err);
    }
  });
}

// This function has been attached as the onclick handler for the plugin
// And we will use it to provide the pluginAPI with our configuration values.


function statusCheckConfig() {
  var configJson = `{
    "title": "Status Check Options",
    "options": [
      {
      "text": "How often to update Staus?",
      "id": "statusCheckConfig-updateFrequency",
      "inputType": "number",
      "currentValue": ${updateFrequency}
      }
    ]
  }`;

  //createConfigMenu(configJson);
  pluginAPI.CreateConfigMenu(configJson);
}

document.addEventListener('pluginAPI.configSetEvt', function(event) {
  console.log("Status Check Event Fired from Namespace!");
  console.log(event.detail);

  // Here we want to check for any changes to our data. But since this is a global event
  // we also need to ensure its OUR data being saved.
  var tempEventDetail = JSON.parse(event.detail);
  console.log(tempEventDetail.id);
  try {
    if (tempEventDetail.id == "statusCheckConfig-updateFrequency") {
      updateFrequency = tempEventDetail.value;
      console.log(updateFrequency);
    } // else we can check for other config values of ours, or if the config value is not recognized, its not for us.
  } catch(err) {
    // An error can occur here if the format is not whats expected from us. Likely meaning the message
    // wasn't meant for us at all.
  }


});
