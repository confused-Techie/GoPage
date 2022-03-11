// Stored only for functions used on every page or nearly every page

/**
 * @member {File} UniversalJS
 * @desc JavaScript file loaded with every single page for Universal Functions
 */

loadTimeStamp();
updaterTimeStamp();
checkCustomBackgroundImage();

/**
 * @desc Loads the TimeStamp and modifies the HTML to reflect the current time.
 * @memberof UniversalJS
 */
function loadTimeStamp() {
  if (document.getElementById("timeStamp") != null) {
    const dateToDisplay = new Date();
    document.getElementById(
      "timeStamp"
    ).innerHTML = `<h2>${dateToDisplay.toLocaleTimeString()} ${dateToDisplay.toLocaleDateString()}</h2>`;
  }
}

/**
 * @desc Uses `setInterval` to call `loadTimeStamp()` every 1000 milliseconds (1 Second)
 * @memberof UniversalJS
 * @implements {loadTimeStamp()}
 */
function updaterTimeStamp() {
  setInterval(loadTimeStamp, 1000);
}

/*eslint-disable no-redeclare*/
/**
 * @desc Queries GoPage APIs to determine and set a background image if needed, injecting it into the DOM.
 * @memberof UniversalJS
 */
function checkCustomBackgroundImage() {
  /*eslint-enable no-redeclare*/
  fetch("/api/usersettings")
    .then((res) => res.json())
    .then((data) => {
      if (data.customBackground.set) {
        var locString = `/assets/userImages/${data.customBackground.src}`;
        try {
          // It seems oddly enough this wouldn't accept building this string as I normally would. But this does work
          document.body.style.backgroundImage = "url('" + locString + "')";
        } catch (err) {
          console.log(err);
        }
      } else {
        // image is not set
        // but since this will be called to hotreload the visible background image, this will also remove any url there.
        try {
          document.body.style.backgroundImage = "";
        } catch (err) {
          console.log(err);
        }
      }
    });
}
