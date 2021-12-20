
// Here we can respond to the install, and uninstall requests of plugins

function installPlugin(pluginUrl, pluginName) {
  console.log(`INSTALL CALLED: ${pluginName}`)

  fetch(`/plugins/install?source=${pluginUrl}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      //alert(data);
      if (data.includes("Success!")) {
        modalResults(data, "Success!");
      } else {
        modalResults(data, "Failure");
      }
    })
    .catch(err => {
      console.log(err);
      modalResults(err, "Failure");
    });
}

function uninstallPlugin(pluginName) {
  fetch(`/plugins/uninstall?pluginName=${pluginName}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      //alert(data);
      if (data.includes("Success!")) {
        modalResults(data, "Success!");
      } else {
        modalResults(data, "Failure");
      }
    })
    .catch(err => {
      console.log(err);
      modalResults(err, "Failure");
    });
}

function updatePlugin() {
  fetch(`/plugins/update`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      //alert(data);
      // Check the status by looking for final success message, and provide status
      if (data.includes("Success!")) {
        modalResults(data, "Success!");
      } else {
        modalResults(data, "Failure");
      }
    })
    .catch(err => {
      console.log(err);
      modalResults(err, "Failure");
    });
}

function modalResults(content, status) {
  var modal = document.getElementById("dynamicModal");

  // before being visible we want to build the content within the page,
  // and register any onclick handlers after inserting into the DOM
  var insertHTML = `<div class="modal-content"> <h3>${status}</h3> <p>${content}</p> <button id="clearModal" class="clearModal">Okay</button> </div>`;
  modal.innerHTML = insertHTML;

  var clearModal = document.getElementById("clearModal");
  clearModal.onclick = function() {
    modal.style.display = "none";
  }

  // allow it to be visible
  modal.style.display = "block";
}
