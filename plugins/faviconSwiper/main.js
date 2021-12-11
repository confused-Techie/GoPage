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

    //checkDefined(itemURL)
      //.then(res => {
      //  console.log(res);
      //})
      //.catch(err => {
      //  console.log(err);
      //});

    //await favLogic2(itemURL)
      //.then(res => {
      //  elements[i].innerHTML = res;
      //})
      //.catch(err => {
        // Since if this fails I don't want to set a failed img preview as the favicon.
        // I will log and do nothing.
      //  console.log(`Unable to grab Favicon for: ${itemURL}`);
      //});
      await checkDefined(itemURL)
        .then(res => {
          elements[i].innerHTML = res;
        })
        .catch(err => {
          console.log(err);

          checkAPI(itemURL)
            .then(res => {
              elements[i].innerHTML = res;
            })
            .catch(err => {
              console.log(err);
              console.log(`Unable to grab Favicon for: ${itemURL}`);
            });
        });
  }
}

function checkAPI(url) {
  return new Promise(function (resolve, reject) {

    // Google CORS policy won't let me check the response. But even if I did, Google still reports
    // a fine response just providing a default not favicon icon for unknown sites.
    var tmpHtml = `<img src= 'https://s2.googleusercontent.com/s2/favicons?domain=${url}&sz=32' style="width: 32px; height: auto;"></img>`;
    resolve(tmpHtml);
  });
}

function checkDefined(url) {
  return new Promise(function (resolve, reject) {

    // This will allow the ability to quickly check many different locations for favicons.
    // And will use image preloading to avoid any cors errors
    var methodSrc = [
      `${url}/favicon.ico`,
      `${url}/web/favicon.ico`  // this was added especially for jellyfin instances
    ];

    methodSrc.forEach((element, index) => {
      var img = new Image();

      img.src = element;

      img.onload = function() {
        console.log(`Favicon Success: Method: ${element}; Url: ${url}`);
        var tmpHTML = `<img src= '${element}' style="width: 32px; height: auto;"></img>`;
        resolve(tmpHTML);
      }

      img.onerror = function() {
        //console.log(`Favicon Failed: Method: ${element}; Url: ${url}`);

        if (index = methodSrc.length -1) {
          // This will be needed to break if all methods fail
          reject(`Unable to find Favicon for ${url} with any defined methods;`);
        }
      }
    });

  });
}
