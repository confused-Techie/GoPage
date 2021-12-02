// This is the first plugin written for GoPage
// It's simple and goal is to test weather a website is available or not.

// This is used to call the function that starts the logic of the plugin
apiInit();

// This is the main function for the plugin
async function apiInit() {
  console.log('apiInit Called...');


  // Calling returnPluginItems returns an HTML Collection of all Items that use your plugin
  var elements = returnPluginItems('statusCheck');
  console.log(elements);

  // Since HTML Collection has no forEach Method, we use a standard for loop here
  for (var i = 0; i < elements.length; i++) {

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

function statusCheckMain(data) {
  return `Plugin Says: ${data}`;
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
            resolve(`<span style="height: 25px; width: 25px; border-radius: 50%; display: inline-block; background-color: green;">&#10004;</span>`);
          } else {
            // unsuccessful status code
            resolve(`<span style="height: 25px; width: 25px; border-radius: 50%; display: inline-block; background-color: red;">&#10006</span>`);
          }
        });
    } catch(err) {
      reject(err);
    }
  });
}
