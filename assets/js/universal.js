// Stored only for functions used on every page or nearly every page

loadTimeStamp();
updaterTimeStamp();

function loadTimeStamp() {
  const dateToDisplay = new Date();
  document.getElementById("timeStamp").innerHTML = `<h2>${dateToDisplay.toLocaleTimeString()} ${dateToDisplay.toLocaleDateString()}</h2>`;
}

function updaterTimeStamp() {
  // This function is purely for making any updates as needed.

  // This first function should update the time shown every second.
  setInterval(loadTimeStamp, 1000);
}
