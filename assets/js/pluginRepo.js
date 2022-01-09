
// Here we can respond to the install, and uninstall requests of plugins

/*eslint-disable-next-line no-unused-vars */
function installPlugin(pluginUrl, pluginName) {

  fetch(`/plugins/install?source=${pluginUrl}`)
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      //alert(data);
      if (data.includes("Success!")) {
        modalResults(data, "Success!");
      } else {
        modalResults(data, "Failure");
      }
    })
    .catch((err) => {
      console.log(err);
      modalResults(err, "Failure");
    });
}

/*eslint-disable-next-line no-unused-vars */
function uninstallPlugin(pluginName) {
  fetch(`/plugins/uninstall?pluginName=${pluginName}`)
    .then((res) => {
      // since this may return error data not properly formated as a string, we need to have a backup to move to text
      try {
        JSON.parse(res);
      } catch(err) {
        //console.log(err);
        return res.text();
      }
      return res.json();
    })
    .then((data) => {
      //console.log(data);
      if (data.includes("Success!")) {
        modalResults(data, "Success!");
      } else {
        // the most common err is that the file is being used. but the return data is not valid json
        if (data.includes("Err") && data.includes("32")) {
          var tmpData = "Golang Error 32: The process cannot access the file because it is being used by another process.";
          modalResults(tmpData, "Failure");
        } else {
          modalResults(data, "Failure");
        }
      }
    })
    .catch((err) => {
      //console.log(err);
      modalResults(err, "Failure");
    });
}

/*eslint-disable-next-line no-unused-vars */
function updatePlugin() {
  fetch("/plugins/update")
    .then((res) => res.json())
    .then((data) => {
      //console.log(data);
      // Check the status by looking for final success message, and provide status
      if (data.includes("Success!")) {
        modalResults(data, "Success!");
      } else {
        modalResults(data, "Failure");
      }
    })
    .catch((err) => {
      //console.log(err);
      modalResults(err, "Failure");
    });
}

function modalResults(content, status) {
  var modal = document.getElementById("dynamicModal");

  // before being visible we want to build the content within the page,
  // and register any onclick handlers after inserting into the DOM
  // also we need to gather translations for the button text
  var buttonText = "";
  langHandler.ProvideStringRaw("i18n-generatedRepoButtonOkay")
    .then((resString) => {

      buttonText = resString;
      var formattedContent = formatModalContent(content);

      var insertHTML = `<div class="modal-content"> <h3>${status}</h3> <p>${formattedContent}</p> <button id="clearModal" class="simple-button btn-confirm">${buttonText}</button> </div>`;
      modal.innerHTML = insertHTML;

      var clearModal = document.getElementById("clearModal");
      clearModal.onclick = function() {
        modal.style.display = "none";
      };

      // allow it to be visible
      modal.style.display = "block";
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
