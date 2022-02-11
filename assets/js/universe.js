// This will be a namespace to handle common functions and features within GoPage
// Aimed at reducing complexity, and duplicity

// Since a global variable within eslint is defined here, we turn off the redeclare warning
/*eslint-disable-next-line no-redeclare, no-unused-vars*/
var universe = {
  SnackbarCommon: function (
    id,
    textToShow,
    callback,
    extraClass,
    img,
    alt,
    additionalDetails
  ) {
    // EXAMPLE:: universe.SnackbarCommon("homePageSnackbar", "Success", universe.ReloadCallback())
    // id = the div id of the snackbar to target, textToShow = the text that will appear within the div
    // callback is an optional function to execute after the snackbar has disappeared.
    // extraClass is an optional className to provide. Not needed to ever be set manually, with the snackbar Error function
    // additionally contains img, a relative path to an image icon to display alongside the text
    //    this is optional and will be set manually through use ot the SnackbarError
    // the alt is a arg that should be filled automatically, but insures an equal experience no matter the user.

    var snackbar = document.getElementById(id);

    var snackbarMsg = snackbar.getElementsByClassName("msg")[0];
    var snackbarIcon = snackbar.getElementsByClassName("icon")[0];

    snackbarMsg.innerText = textToShow;

    if (typeof img === "string") {
      snackbarIcon.querySelector("img").src = img;
      snackbarIcon.querySelector("img").alt = alt ? alt : ""; // protect the alt from an undeclared value just in case.
    } else {
      // ensure this is always set to default in case this page instance has multiple calls
      snackbarIcon.querySelector("img").src =
        "/assets/images/check-circle-white.svg";
      snackbarIcon.querySelector("img").alt =
        "Check Mark with a Cirle surrounded it.";
    }

    if (typeof additionalDetails === "string") {
      // If additional details have been specified, we want to then allow the icon to be clickable
      //
      var showModalTemplateHandler = () => {
        this.ShowTemplateModal(additionalDetails);
      };
      snackbarIcon.onclick = function () {
        showModalTemplateHandler();
      };
    }

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
  SnackbarError: function (id, textToShow, callback, details) {
    // A simple way to invoke SnackbarCommon while assigning the error class to the snackbar
    this.SnackbarCommon(
      id,
      textToShow,
      callback,
      " error",
      "/assets/images/info-white.svg",
      "White Informational 'i' Icon",
      details
    );
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
  ShowTemplateModal: function (text) {
    var modal = document.getElementById("modal");
    // since this is only for template modals, we can use a static ID
    var modalText = modal.querySelector(".msg").querySelector("p");

    modalText.innerText = text;

    var clearModalBtn = document.getElementById("clearModal");
    // assigning as an anonymous arrow function since it seems that the this context is defined during the onclick
    // handler rather than during initialization of the onclick, causing the this namespace to be undefined, or at least
    // have the CloseModal function undefined.
    var closeTemplateModal = () => {
      this.CloseModal("modal");
    };
    clearModalBtn.onclick = function () {
      closeTemplateModal();
    };

    this.ShowModal("modal");
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

    // TODO: This method is outdated
  },
  FindReturnsString: function (action, status) {
    // This requires that the returnsGlobalJS template is used.
    // this will use the global translated strings, to help find the right return action string
    // made especially for use with the snackbar.
    // Also note that likely anything returned here will be a composite string
    // Valid Values:
    //    action: delete, install, update
    //    status: pass, fail
    if (status != "pass" && status != "fail") {
      console.log(`universe.FindReturnString: Invalid status: ${status}`);
      return false;
    } else {
      if (action != "delete" && action != "install" && action != "update") {
        console.log(`universe.FindReturnString: Invalid action: ${action}`);
        return false;
      } else {
        if (action == "delete" && status == "pass") {
          return i18n_returnsSuccessDelete;
        } else if (action == "delete" && status == "fail") {
          return i18n_returnsFailureDelete;
        } else if (action == "install" && status == "pass") {
          return i18n_returnsSuccessInstall;
        } else if (action == "install" && status == "fail") {
          return i18n_returnsFailureInstall;
        } else if (action == "update" && status == "pass") {
          return i18n_returnsSuccessUpdate;
        } else if (action == "update" && status == "fail") {
          return i18n_returnsFailureUpdate;
        }
      }
    }
  },
  HotReload: function (elementID, url, callback, callbackArg) {
    // this is a function to add hot-reload capabilities to pages.
    // requiring both the ID of the element to replace, and the url to query
    // for the hot reload data.
    // now it also supports a callback if one is needed to initialize or reload parts of a page
    if (typeof elementID === "string" && typeof url === "string") {
      var newHeaders = new Headers();

      // append the custom hot-reload headers that go server will look for
      newHeaders.append("GoPage-Action", "hot-reload");

      var requestOptions = {
        headers: newHeaders,
      };

      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((data) => {
          var e = document.getElementById(elementID);
          e.innerHTML = data;

          if (typeof callback === "function") {
            if (typeof callbackArg === "string") {
              callback(callbackArg);
            } else {
              callback();
            }
          }
        })
        .catch((err) => {
          console.error(`universe.HotReload ERROR: ${err}`);
        });
    } else {
      console.error(
        `Invalid args passed to universe.HotReload! Element ID: ${elementID}, URL: ${url}`
      );
    }
  },
};
