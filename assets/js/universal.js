// Stored only for functions used on every page or nearly every page

loadTimeStamp();
updaterTimeStamp();
checkCustomBackgroundImage();

function loadTimeStamp() {
  if (document.getElementById("timeStamp") != null) {
    const dateToDisplay = new Date();
    document.getElementById("timeStamp").innerHTML = `<h2>${dateToDisplay.toLocaleTimeString()} ${dateToDisplay.toLocaleDateString()}</h2>`;
  }

}

function updaterTimeStamp() {
  // This function is purely for making any updates as needed.

  // This first function should update the time shown every second.
  setInterval(loadTimeStamp, 1000);
}

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  langHandler.DetermineLang()
    .then(res => {
      // once this returns, we can start a lookup of the strings
      langHandler.InsertLang();
    });
});

function checkCustomBackgroundImage() {
  // This will be used to see if a background image is set, and load it if it is
  fetch('/api/usersettings')
    .then(res => res.json())
    .then(data => {
      if (data.customBackground.set) {
        //var locString = `/assets/userImages/test.jpg`;
        var locString = `/assets/userImages/${data.customBackground.src}`;
        try {
          // It seems odly enough this wouldn't accept building this string as I normally would. But this does work
          document.body.style.backgroundImage = "url('" + locString + "')";
          // the rest of these values should be taken from the JSON data

          // Valid Values: repeat, repeat-x, repeat-y, no-repeat, initial, inherit :: https://www.w3schools.com/jsref/prop_style_backgroundrepeat.asp
          document.body.style.backgroundRepeat = data.customBackground.repeat;

          // Valid Values: auto, length, percentage, cover, contain, initial, inherit :: https://www.w3schools.com/jsref/prop_style_backgroundsize.asp
          document.body.style.backgroundSize = data.customBackground.size;
        } catch(err) {
          console.log(err);
        }
      } // else image is not set
    });
}
