// This will be a namespace to handle common functions and features within GoPage
// Aimed at reducing complexity, and duplicity

// Since a global variable within eslint is defined here, we turn off the redeclare warning
/*eslint-disable-next-line no-redeclare, no-unused-vars*/
var universe = {
  SnackbarCommon: function (id, textToShow, callback, extraClass) {
    // EXAMPLE:: universe.SnackbarCommon("homePageSnackbar", "Success", universe.ReloadCallback())
    // id = the div id of the snackbar to target, textToShow = the text that will appear within the div
    // callback is an optional function to execute after the snackbar has disappeared.
    // extraClass is an optional className to provide. Not needed to ever be set manually, with the snackbar Error function

    var snackbar = document.getElementById(id);

    snackbar.innerText = textToShow;
    if (typeof extraClass === "string") {
      snackbar.className += extraClass;
    }
    snackbar.className += " show";

    setTimeout(function () {
      snackbar.className = snackbar.className.replace("show", "");
      if (typeof extraClass === "string") {
        snackbar.className = snackbar.className.replace(extraClass, "");
      }
      if (typeof callback === "function") {
        callback();
      }
    }, 3000);
  },
  SnackbarError: function (id, textToShow, callback) {
    // A simple way to invoke SnackbarCommon while assigning the error class to the snackbar
    this.SnackbarCommon(id, textToShow, callback, " error");
  },
  ReloadCallback: function () {
    // Since passing the standard location.reload() doesn't work within the callback as it losses the this scope
    // we can bind it to the window.location, but this is a tad verbose.
    // So defining it here as a return variable allows easy access, to pass this as a callback to the snackbar
    return window.location.reload.bind(window.location);
  },
  CreateJSONPOSTHeaders: function (data) {
    // This will take a JSON object and return the headers for a fetch request
    // with the method being post, and providing json
    var newHeaders = new Headers();

    newHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: newHeaders,
      body: data,
      redirect: "follow",
    };

    return requestOptions;
  },
  ShowModal: function (id) {
    // Used for displaying a modal, based on the provided id.
    var modal = document.getElementById(id);
    modal.style.display = "block";
  },
  CloseModal: function (id) {
    // Used to close a modal, based on the provided id
    var modal = document.getElementById(id);
    modal.style.display = "none";
  },
  WriteUserSettings: function (requestOptions, successCallback, errorCallback) {
    fetch("/api/usersettingswrite", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result == "Success") {
          successCallback();
        } else {
          // error occured
          errorCallback(result);
        }
      });
  },
  GenericErrorHandler: function (snackbar, msg) {
    // For a generic error we want to do two things.
    // Log the error to console, and then create the snackbar.
    console.log(msg);
    universe.SnackbarError(snackbar, `Error: ${msg}`);
  },
};
