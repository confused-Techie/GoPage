// Here we can respond to the install, and uninstall requests of plugins

/*eslint-disable-next-line no-unused-vars */
function installPlugin(pluginUrl, pluginName) {
  universe.Loader(true);

  pluginFetchWrapperNonBlocking(
    `/plugins/install?source=${pluginUrl}`,
    "install",
    pluginName
  );
}

/*eslint-disable-next-line no-unused-vars */
function uninstallPlugin(pluginName) {
  universe.Loader(true);

  pluginFetchWrapperNonBlocking(
    `/plugins/uninstall?pluginName=${pluginName}`,
    "delete",
    pluginName
  );
}

/*eslint-disable-next-line no-unused-vars */
function updatePlugin() {
  universe.Loader(true);

  pluginFetchWrapperNonBlocking(
    "/plugins/update",
    "update",
    i18n_returnValueAvailablePlugins
  );
}

function pluginFetchWrapperNonBlocking(target, action, targetItem) {
  // valid actions: delete, install, update
  // target is the name of the item being actioned against

  fetch(target)
    .then((res) => {
      // since this may return error data not properly formatted as json, we need to have a backup
      try {
        JSON.parse(res);
        return res.json();
      } catch (err) {
        return res.text();
      }
    })
    .then((data) => {
      if (data.includes("Success!")) {
        returnData(targetItem, action, "pass", formatModalContent(data));
      } else {
        // error of some sort occured.
        // We can add additional error checking here to make it more human readable.
        if (data.includes("Err") && data.includes("32")) {
          // we know this would indicate a golang error 32
          var tmpData =
            "Golang Error 32: The process cannot access the file because it is being used by another process.";
          console.log(tmpData);
          console.log(data);
          returnData(targetItem, action, "fail", tmpData);
        } else {
          // currently unhandled error occured.
          console.log(data);
          returnData(targetItem, action, "fail", formatModalContent(data));
        }
      }
    })
    .catch((err) => {
      console.log(err);
      returnData(targetItem, action, "fail", formatModalContent(err));
    });
}

function formatModalContent(text) {
  text = text.replace('"', '');
  var splitText = text.split("...");
  var newText = "";
  for (let i = 0; i < splitText.length; i++) {
    if (splitText[i].includes("\\n")) {
      // Using \\ here to escape the newline character
      var tmpString = splitText[i].replace("\\n", "");
      newText += tmpString + "<br>";
    } else {
      newText += splitText[i] + "<br>";
    }
  }
  return newText;
}

function returnData(itemName, action, status, details) {
  // This is made to work with the template modal & snackbar, using non-blocking design
  // itemName = The name of the Plugin or Item that has been affected (e.g. Available Plugins, Pihole API)
  // action = The explicit action taken (e.g. Deleted, Installed, Updated)
  // action !! valid values: delete, install, update
  // status = The status of the action (e.g. Successfully, Unsuccessfully)
  // status !! valid values: fail, pass
  // details = The long form details, this could be designed error codes, or raw returned data.

  // but first first, lets disbale any active loader
  universe.Loader(false);

  // first we will validate the multiple options
  if (status != "pass" && status != "fail") {
    console.error(`Invalid status passed to return data: ${status}`);
  } else {
    if (action != "delete" && action != "install" && action != "update") {
      console.error(`Invalid action passed to return data: ${action}`);
    } else {
      if (status == "pass") {
        // This will invoke the SnackbarCommon component of the universe Namespace, with the following values in order
        // "snackbar" the template imported snackbar with generic naming
        // The textToShow within the snackbar: Consisting of:
        //    UnicornComposite of the Proper String returned by findProperString, which grabs the translated string from global variables
        //    and the item name we are working with.
        // then SnackbarCommon: false - callback; false - extraClass; false - false - img; false - alt;
        // additionalDetails: Being the details passed here.
        universe.SnackbarCommon(
          "snackbar",
          langHandler.UnicornComposite(
            universe.FindReturnsString(action, status),
            itemName
          ),
          universe.HotReload("pluginList", "/pluginrepo"),
          false,
          false,
          false,
          details
        );
      } else if (status == "fail") {
        universe.SnackbarError(
          "snackbar",
          langHandler.UnicornComposite(
            universe.FindReturnsString(action, status),
            itemName
          ),
          false,
          details
        );
      } else {
        console.error(
          "Something went wrong processing the ReturnData() Request"
        );
      }
    }
  }
}
