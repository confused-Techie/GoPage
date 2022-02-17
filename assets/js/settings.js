window.onload = function () {
  onclickHandlers();
};

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
    changeOptionsAPI("logging", chosenLogging);
  };

  submitRobotsBtn.onclick = function () {
    var chosenRobots = document.getElementById("changeRobotsInput").value;
    changeOptionsAPI("robots", chosenRobots);
  };
}

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

function doesJSONParse(data) {
  try {
    JSON.parse(data);
    return true;
  } catch (err) {
    return false;
  }
}
