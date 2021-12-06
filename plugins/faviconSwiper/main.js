// The second Plugin for GoPage
// Intended to use Googles public API to provide favicons for Items.

// Lets init the plugin

favInit();

async function favInit() {
  console.log('Favicon Swiper Started...');

  var elements = pluginAPI.ReturnItems('faviconSwiper');

  for (var i = 0; i < elements.length; i++) {

    // Since there is no config available for this item, we don't need to worry about
    // a click handler, or for that matter refreshing

    var itemURL = elements[i].getAttribute('data-url');

    await favLogic2(itemURL)
      .then(res => {
        elements[i].innerHTML = res;
      })
      .catch(err => {
        // Since if this fails I don't want to set a failed img preview as the favicon.
        // I will log and do nothing.
        console.log(`Unable to grab Favicon for: ${itemURL}`);
      });
  }
}

function favLogic(url) {
  return new Promise(function (resolve, reject) {
    try {

      // We will first try a fetch, to see if this is successful.
      fetch(`https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        .then(response => {
          if (!response.ok) {
            reject(response);
          } else {
            // Here we know the response is successful, and can return.
            var tmpHtml = `<img src= 'https://s2.googleusercontent.com/s2/favicons?domain=${url}'></img>`;
            resolve(tmpHtml);
          }
        });
    } catch(err) {
      reject(err);
    }
  });
}

function favLogic2(url) {
  return new Promise(function (resolve, reject) {

    // Google CORS policy won't let me check the response. But even if I did, Google still reports
    // a fine response just providing a default not favicon icon for unknown sites. 
    var tmpHtml = `<img src= 'https://s2.googleusercontent.com/s2/favicons?domain=${url}&sz=32' style="width: 32px; height: auto;"></img>`;
    resolve(tmpHtml);
  });
}
