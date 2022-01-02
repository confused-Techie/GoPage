// This will be the first venture into namespaces

// Since a global variable is the pluginAPI that is defined here, we turn off checking of redeclared variables to avoid errors here
/*eslint-disable-next-line no-redeclare: off*/
var pluginAPI = {
  ReturnItems: function ReturnItems(pluginName) {
    return document.getElementsByClassName(pluginName);
  },

  CreateConfigMenu: function CreateConfigMenu(configData) {
    //console.log("Plugin API CreateConfigMenu Created...");

    var configDataParse = JSON.parse(configData);
    var modalElement = document.getElementById("configModal");
    // allow it to be visible.
    modalElement.style.display = "block";

    var htmlToInsert = "";
    htmlToInsert += "<div class='modal-content'>";
    htmlToInsert += `<h3>${configDataParse.title}</h3>`;

    configDataParse.options.forEach((element) => {
      htmlToInsert += `<label>${element.text}</label>`;
      htmlToInsert += `<input id="${element.id}" type="${element.inputType}" value="${element.currentValue}"><br><br>`;
    });

    // then to add the buttons
    htmlToInsert += "<button id='save-modal' class='save'>Save</button>";
    htmlToInsert += "<button id='notSave-modal' class='notSave'>Nevermind</button>";
    htmlToInsert += "</div>";

    modalElement.innerHTML = htmlToInsert;

    // then attach click handlers
    var modalNotSave = document.getElementById("notSave-modal");
    var modalSave = document.getElementById("save-modal");

    modalNotSave.onclick = function() {
      modalElement.style.display = "none";
    };

    modalSave.onclick = function() {
      // now to take the data values from the form
      var dataToReturn = [];
      configDataParse.options.forEach((element) => {
        var tempObjReturn = `{ "id": "${element.id}", "value": ${document.getElementById(element.id).value} }`;
        dataToReturn.push(tempObjReturn);
      });
      // then disable the modal and return the data
      modalElement.style.display = "none";

      // Now we can create an event, and fire the save
      const configSetEvt = new CustomEvent("pluginAPI.configSetEvt", { detail: dataToReturn } );

      // TODO Actually save this data before firing the event
      document.dispatchEvent(configSetEvt);
    }
  },

  ReturnConfig: function ReturnConfig() {

  },

  SetConfig: function SetConfig() {

  },
  ParseConfig: function ParseConfig(rawConfig) {
    // Will parse the generic or otherwise Rev1 config or option data for plugins
    // option=value;

    // First we will break up the config into its different key value pairs
    var keyValue = rawConfig.split(';');
    // Then to add these keys with their declaration to the object
    var obj = {};
    for (let i = 0; i < keyValue.length; i++) {
      var keyOrValue = keyValue[i].split("=");
      if (keyOrValue[0] != "") {
        obj[keyOrValue[0]] = keyOrValue[1];
      }
    }
    return obj;
  },

};
