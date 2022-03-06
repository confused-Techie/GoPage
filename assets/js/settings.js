/**
* @member {File} SettingsJS
* @desc The JavaScript file loaded with the Settings Page
*/
window.onload = function () {
  onclickHandlers();
};

/**
* @desc Registers `onclick` handlers wherever relavent within the page.
* @memberof SettingsJS
* @implements {universe.SnackbarCommon()}
* @implements {langHandler.UnicornComposite()}
* @implements {removeHeaderPlugin()}
* @implements {changeOptionsAPI()}
*/
function onclickHandlers() {
  var submitLangBtn = document.getElementById("submitLangBtn");
  var removeLeftHeaderPluginBtn = document.getElementById(
    "removeLeftHeaderPluginBtn"
  );
  var removeRightHheaderPluginBtn = document.getElementById(
    "removeRightHheaderPluginBtn"
  );
  var submitLoggingBtn = document.getElementById("submitLoggingBtn");
  var submitRobotsBtn = document.getElementById("submitRobotsBtn");

  submitLangBtn.onclick = function () {
    var chosenLang = document.getElementById("changeLangInput").value;
    fetch(`/api/changelang?lang=${chosenLang}`)
      .then((res) => res.json())
      .then((response) => {
        universe.SnackbarCommon(
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
  };

  removeLeftHeaderPluginBtn.onclick = function () {
    removeHeaderPlugin("left");
  };

  removeRightHheaderPluginBtn.onclick = function () {
    removeHeaderPlugin("right");
  };

  submitLoggingBtn.onclick = function () {
    var chosenLogging = document.getElementById("changeLoggingInput").value;
    changeOptionsAPI(i18n_returnValueLogging, chosenLogging);
  };

  submitRobotsBtn.onclick = function () {
    var chosenRobots = document.getElementById("changeRobotsInput").value;
    changeOptionsAPI(i18n_returnValueRobots, chosenRobots);
  };
}

/**
* @desc Simplifies removing a Header Plugin from User Settings using GoPage APIs
* @param {string} side Indicates the which Side the Header Plugin is being removed from.
* Valid Values: "right", "left"
* @memberof SettingsJS
* @implements {universe.CreateJSONPOSTHeaders()}
* @implements {universe.SnackbarCommon()}
* @implements {langHandler.UnicornComposite()}
* @implements {universe.SnackbarError()}
*/
function removeHeaderPlugin(side) {
  fetch("/api/usersettings")
    .then((res) => res.json())
    .then((data) => {
      data.headerPlugins[side].name = "";
      data.headerPlugins[side].options = "";

      var raw = JSON.stringify(data);

      fetch("/api/usersettingswrite", universe.CreateJSONPOSTHeaders(raw))
        .then((response) => response.json())
        .then((result) => {
          if (result == "Success") {
            universe.SnackbarCommon(
              "snackbar",
              langHandler.UnicornComposite(
                i18n_returnsSuccessUpdate,
                i18n_returnValueHeaderPlugin
              )
            );
          } else {
            universe.SnackbarError(
              "snackbar",
              i18n_returnValueGenericError,
              false,
              result
            );
          }
        });
    });
}

/**
* @desc Simplified method of making API Calls to GoPage API to change user settings.
* @param {string} item The Identifier of the Item being changed.
* @param {string} value The Value said Identifier is being changed to.
* @memberof SettingsJS
* @implements {doesJSONParse()}
* @implements {universe.SnackbarError()}
* @implements {universe.SnackbarCommon()}
* @implements {langHandler.UnicornComposite()}
*/
function changeOptionsAPI(item, value) {
  console.log(value);
  fetch(`/api/change?id=${item}&value=${value.trim()}`)
    .then((res) => {
      if (doesJSONParse(res)) {
        return res.json();
      } else {
        return res.text();
      }
    })
    .then((data) => {
      if (data.includes("Error")) {
        universe.SnackbarError(
          "snackbar",
          i18n_returnValueGenericError,
          false,
          data
        );
      } else {
        universe.SnackbarCommon(
          "snackbar",
          langHandler.UnicornComposite(i18n_returnsSuccessUpdate, item)
        );
      }
    });
}

/**
* @desc Method of checking if passed data will parse into JSON without any errors.
* @returns {boolean} True if successfully parsed, false if it fails to parse.
* @param {string} data The data to test against.
* @memberof SettingsJS
*/
function doesJSONParse(data) {
  try {
    JSON.parse(data);
    return true;
  } catch (err) {
    return false;
  }
}
