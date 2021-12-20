// Stored only for functions used on every page or nearly every page

loadTimeStamp();
updaterTimeStamp();

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
