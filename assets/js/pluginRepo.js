// Here we can respond to the install, and uninstall requests of plugins

/*eslint-disable-next-line no-unused-vars */
function installPlugin(pluginUrl, pluginName) {
  pluginFetchWrapper(`/plugins/install?source=${pluginUrl}`);
}

/*eslint-disable-next-line no-unused-vars */
function uninstallPlugin(pluginName) {
  pluginFetchWrapper(`/plugins/uninstall?pluginName=${pluginName}`);
}

/*eslint-disable-next-line no-unused-vars */
function updatePlugin() {
  pluginFetchWrapper("/plugins/update");
}

function pluginFetchWrapper(target) {
  // This will attempt to combine the logic implemented within each fetch request into a single function

  fetch(target)
    .then((res) => {
      // since this may return error data not properly formated as a string, we need to have a backup to move to text
      try {
        JSON.parse(res);
        return res.json();
      } catch (err) {
        return res.text();
      }
    })
    .then((data) => {
      if (data.includes("Success!")) {
        modalResults(data, "Success!");
      } else {
        // error occured.
        // We can add error checking here to make it more human readable.
        if (data.includes("Err") && data.includes("32")) {
          var tmpData =
            "Golang Error 32: The process cannot access the file because it is being used by another process.";
          console.log(data);
          console.log(tmpData);
          modalResults(tmpData, "Failure");
        } else {
          console.log(data);
          modalResults(data, "Failure");
        }
      }
    })
    .catch((err) => {
      console.log(err);
      modalResults(err, "Failure");
    });
}

function modalResults(content, status) {
  var modal = document.getElementById("dynamicModal");

  // before being visible we want to build the content within the page,
  // and register any onclick handlers after inserting into the DOM
  // also we need to gather translations for the button text
  var buttonText = "";
  langHandler
    .ProvideStringRaw("i18n-generatedRepoButtonOkay")
    .then((resString) => {
      buttonText = resString;
      var formattedContent = formatModalContent(content);

      var insertHTML = `<div class="modal-content"> <h3>${status}</h3> <p>${formattedContent}</p> <button id="clearModal" class="simple-button btn-confirm">${buttonText}</button> </div>`;
      modal.innerHTML = insertHTML;

      var clearModal = document.getElementById("clearModal");
      clearModal.onclick = function () {
        modal.style.display = "none";
      };

      universe.ShowModal("dynamicModal");
    });
}

function formatModalContent(text) {
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
