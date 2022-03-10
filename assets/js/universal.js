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
  // This function is purely for making any updates as needed.

  // This first function should update the time shown every second.
  setInterval(loadTimeStamp, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
  //langHandler.DetermineLang().then(() => {
  // once this returns, we can start a lookup of the strings
  //langHandler.InsertLang();
  // Testing the new Metered connection to reduce network abuse
  //langHandler.InsertLangMetered();
  //});
  // with translations now part of templating, we no longer need to do a lookup at page load.
});

/*eslint-disable no-redeclare*/
/**
 * @desc Queries GoPage APIs to determine and set a background image if needed, injecting it into the DOM.
 * @memberof UniversalJS
 */
function checkCustomBackgroundImage() {
  /*eslint-enable no-redeclare*/
  // This will be used to see if a background image is set, and load it if it is
  fetch("/api/usersettings")
    .then((res) => res.json())
    .then((data) => {
      if (data.customBackground.set) {
        //var locString = `/assets/userImages/test.jpg`;
        var locString = `/assets/userImages/${data.customBackground.src}`;
        try {
          // It seems odly enough this wouldn't accept building this string as I normally would. But this does work
          document.body.style.backgroundImage = "url('" + locString + "')";
          // The rest of these values should be ignored in the future, and left up to CSS to ensure a responsive image design.
          // the rest of these values should be taken from the JSON data

          // Valid Values: repeat, repeat-x, repeat-y, no-repeat, initial, inherit :: https://www.w3schools.com/jsref/prop_style_backgroundrepeat.asp
          //document.body.style.backgroundRepeat = data.customBackground.repeat;

          // Valid Values: auto, length, percentage, cover, contain, initial, inherit :: https://www.w3schools.com/jsref/prop_style_backgroundsize.asp
          //document.body.style.backgroundSize = data.customBackground.size;
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
