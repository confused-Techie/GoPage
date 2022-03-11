/**
 * @member {File} UniverseJS
 * @desc Namespace of functions for easy access to repeatable actions. Aimed at reducing complexity, and duplicity.
 */

// Since a global variable within eslint is defined here, we turn off the redeclare warning
/*eslint-disable no-redeclare, no-unused-vars*/
/**
 * The namespace to access all internal functions.
 * @namespace
 * @memberof UniverseJS
 */
var universe = {
  /*eslint-enable no-redeclare, no-unused-vars*/
  /**
   * @desc Common method for creating Snackbars onscreen, usually not directly accessed, instead accessed through a higher level function.
   * @implements {ShowTemplateModal()}
   * @param {string} id Div ID of the Snackbar to target.
   * @param {string} textToShow The Text that will appear within the Snackbar.
   * @param {function} [callback] Optional function to execute after the Snackbar has disappeared.
   * @param {string} [extraClass] Optional className to provide. Not needed to be set when accessing from a higher function.
   * @param {string} [img] Optional Relative path to an Image Icon to display alongside the text.
   * @param {string} [alt] Optional ALT tag for the Image thats being displayed.
   * @param {string} [additionalDetails] Optional details that will show in a modal if the Snackbar image is clicked. Setting additional details also makes the Snackbar Image clickable.
   * @example
   * universe.SnackbarCommon("homePageSnackbar", "Success", universe.ReloadCallback());
   * @example <caption>A More Complex Example</caption>
   * universe.SnackbarCommon(
   *   "snackbar",
   *   langHandler.UnicornComposite(string, i18n_returnValueLinkItem),
   *   universe.HotReload("linkItemList", "/", homePageInit, "reload")
   *   );
   */
  SnackbarCommon: function (
    id,
    textToShow,
    callback,
    extraClass,
    img,
    alt,
    additionalDetails
  ) {
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

      snackbar.className += " clickable";

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

    var eleAnim = document.getElementsByClassName("snackbar")[0];
    // this will get the snackbar bby the class, assuming only one exists on the page
    // and will be used to hopefully sync the timeout of removing the element, and css animation

    eleAnim.addEventListener("animationend", function (event) {
      // since the snackbar uses snack-fadein, and snack-fadeout
      // we know we only want to exit when fadein finishes
      if (event.animationName == "snack-fadeout") {
        snackbar.className = snackbar.className.replace(" show", "");
        if (typeof extraClass === "string") {
          snackbar.className = snackbar.className.replace(extraClass, "");
        }
        // also remove the clickable class if the snackbar has extra details to show
        if (typeof additionalDetails === "string") {
          snackbar.className = snackbar.className.replace(" clickable", "");
        }
        if (typeof callback === "function") {
          callback();
        }
      }
    });
  },
  /**
   * @desc Simple way to create an Error Snackbar, defaulting many values passed to SnackbarCommon.
   * @implements {SnackbarCommon()}
   * @param {string} id Div ID of Snackbar to target.
   * @param {string} textToShow The Text that will appear within the Snackbar.
   * @param {function} [callback] Optional function to execute after the Snackbar has disappeared.
   * @param {string} [details] Optional details that will show in a modal if the Snackbar Image is clicked.
   */
  SnackbarError: function (id, textToShow, callback, details) {
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
  /**
   * @desc Provides a simple way to reload the page within callbacks. Since the standard `location.reload()` losses scope inside a callback.
   * @returns {function} Globally Scoped function to reload page: `window.location.reload.bind(window.location)`
   */
  ReloadCallback: function () {
    return window.location.reload.bind(window.location);
  },
  /**
   * @desc Provides a simple way to retreive POST JSON Headers for use with Fetch requests.
   * @returns {Object} Fetch Request Options with provided data.
   * @param {string} data JSON Object to set as the body of the Fetch details.
   */
  CreateJSONPOSTHeaders: function (data) {
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
  /**
   * @desc Sets a Modal's Display to "block" to show it on the page.
   * @param {string} id Is the DOM ID of the Modal to Display.
   */
  ShowModal: function (id) {
    var modal = document.getElementById(id);
    modal.style.display = "block";
  },
  /**
   * @desc Sets a Modal's Display to "none" to remove it from the page.
   * @param {string} id Is the DOM ID of the Modal to Remove.
   */
  CloseModal: function (id) {
    var modal = document.getElementById(id);
    modal.style.display = "none";
  },
  /**
   * @desc Will show an onscreen modal assuming the Template Modal Page is used. And will handle the closing of said modal.
   * @param {string} text Is the Text to show within the Modal.
   * @implements {CloseModal()}
   * @implements {ShowModal()}
   */
  ShowTemplateModal: function (text) {
    var modal = document.getElementById("modal");
    // since this is only for template modals, we can use a static ID
    var modalText = modal.querySelector(".msg").querySelector("p");

    //modalText.innerText = text;
    modalText.textContent = text;

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
  /**
   * @desc Uses GoPage APIs to set new UserSettings to the Server.
   * @param {string} requestOptions Will be the Request Options passed to Fetch for the request
   * @param {function} successCallback The function to execute if the query is successful.
   * @param {function} errorCallback The function to execute if the query fails. The error callback is **REQUIRED** to accept a JSON Object of the error.
   */
  WriteUserSettings: function (requestOptions, successCallback, errorCallback) {
    fetch("/api/usersettingswrite", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result == "Success") {
          successCallback();
        } else {
          errorCallback(result);
        }
      });
  },
  /**
   * @desc Intended to be a simple way to create an Error Snackbar that has now been superseded by SnackbarError.
   * @param {string} snackbar DOM ID of the Snackbar to Target.
   * @param {string} msg The Message to display in the text of the Snackbar and to output to the console.
   * @implements {SnackbarError()}
   * @todo Determine if this is still needed or in use.
   */
  GenericErrorHandler: function (snackbar, msg) {
    // For a generic error we want to do two things.
    // Log the error to console, and then create the snackbar.
    console.log(msg);
    universe.SnackbarError(snackbar, `Error: ${msg}`);

    // TODO: This method is outdated
  },
  /**
   * @desc Can be used to help determine the right translated message.
   * This does require that returnGlobalJS template is in use on the page.
   * This will use the Global Strings to attempt to return the right action that has been preformed.
   * @param {string} action Is the action that has occured. Valid values: "delete", "install", "update"
   * @param {string} status Is the status of said action. Valid Values: "pass", "fail"
   * @returns {string} The translated string needed, **Remember** this will likely be a Composite String and shouldn't be displayed as is.
   */
  FindReturnsString: function (action, status) {
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
  /**
   * @desc Adds an easy way to Hot-Reload pages that are capable of doing so server side.
   * @param {string} elementID The DOM ID of the element to replace in the Hot-Reload Action.
   * @param {string} url The URL to query for Hot-Reloading page data.
   * @param {function} callback Function to execute after the Hot-Reload is finished. Useful for calling any functions needed to add Event Handlers or process data on the page.
   * @param {string} callbackArg Arguments to pass to the callback function, useful if the callback needs to identify that its a callback.
   * @example
   * universe.HotReload("linkItemList", "/", homePageInit, "reload");
   */
  HotReload: function (elementID, url, callback, callbackArg) {
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
  /**
   * @desc Simple method of injecting a Loading animation onto the center of the page.
   * @param {boolean} shouldShow indicates if the loader is being turned off or on. True being on, and False being off.
   */
  Loader: function (shouldShow) {
    var loaderEle = document.getElementsByClassName("loader")[0];

    if (typeof shouldShow === "boolean") {
      if (shouldShow) {
        loaderEle.style.display = "flex";
      } else {
        loaderEle.style.display = "none";
      }
    } else {
      console.log(
        "Loader expects first argument Boolean of whether or not to show the loader."
      );
    }
  },
  /**
  * @desc Allowing easy universal access to the ChangeLangAPI, by just submitting the chosenLang
  * @param {string} chosenLang The two digit language code that the server should save
  */
  ChangeLangAPI: function(chosenLang) {
    fetch(`/api/changelang?lang=${chosenLang}`)
      .then((res) => res.json())
      .then((response) => {
        this.SnackbarCommon(
          "snackbar",
          langHandler.UnicornComposite(
            i18n_returnsSuccessUpdate,
            i18n_returnValueLanguage
          ),
          false,
          false,
          false,
          false,
          response
        );
      });
  },
};
