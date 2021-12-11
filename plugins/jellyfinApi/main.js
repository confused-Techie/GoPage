apiInit();

async function apiInit() {
  console.log('Jellyfin API Started...');

  var elements = pluginAPI.ReturnItems('jellyfinApi');
  for (var i=0; i<elements.length; i++) {
    var itemURL = elements[i].getAttribute('data-url');

    // now we need to retreive our config data for this item, via the attribute
    var rawOptions = elements[i].getAttribute('data-options');

    // once we have the raw config, we can use the built in API to parse it
    var parseOptions = pluginAPI.ParseConfig(rawOptions);
    // now we can pass the parsed config data to the main function

    await jellyfinApiLogic(itemURL, parseOptions)
      .then(res => {
        elements[i].innerHTML = res;
      })
      .catch(err => {
        elements[i].innerHTML = err;
      });
  }
}


function jellyfinApiLogic(url, options) {
  return new Promise(function (resolve, reject) {

    // Need to find a better way to store this data securely.
    var jellyfinPluginUrl = options.url;
    var apiKey = options.apiKey;

    try {
      var newHeader = new Headers();
      newHeader.append("X-MediaBrowser-Token", apiKey);

      var requestOptions = {
        method: 'GET',
        headers: newHeader,
        redirect: 'follow'
      };

      var jellyfinAPIURL = `${jellyfinPluginUrl}/Items/Counts`;

      fetch(jellyfinAPIURL, requestOptions)
        //.then(response => console.log(response));
        .then(response => {
          return response.json();
        })
        //.then(response => response.json())
        .then(data => {
          var returnData = `<p>Movies: ${data.MovieCount}</p><p>Episodes: ${data.EpisodeCount}</p>`;
          resolve(returnData);
        });
    }
    catch(err) {
      reject(err);
    }
  });
}
