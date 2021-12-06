// This will be the first venture into namespaces
var pluginAPI = {
  ReturnItems: function ReturnItems(pluginName) {
    return document.getElementsByClassName(pluginName);
  },

  CreateConfigMenu: function CreateConfigMenu(configData) {
    console.log('Plugin API CreateConfigMenu Created...');

    var configDataParse = JSON.parse(configData);
    var modalElement = document.getElementById("configModal");
    // allow it to be visible.
    modalElement.style.display = "block";

    htmlToInsert = '';
    htmlToInsert += '<div class="modal-content">';
    htmlToInsert += `<h3>${configDataParse.title}</h3>`;

    configDataParse.options.forEach((element, index) => {
      htmlToInsert += `<label>${element.text}</label>`;
      htmlToInsert += `<input id="${element.id}" type="${element.inputType}" value="${element.currentValue}"><br><br>`;
    });

    // then to add the buttons
    htmlToInsert += `<button id="save-modal" class="save">Save</button>`;
    htmlToInsert += `<button id="notSave-modal" class="notSave">Nevermind</button>`;
    htmlToInsert += '</div>';

    modalElement.innerHTML = htmlToInsert;

    // then attach click handlers
    var modalNotSave = document.getElementById("notSave-modal");
    var modalSave = document.getElementById("save-modal");

    modalNotSave.onclick = function() {
      modalElement.style.display = "none";
    }

    modalSave.onclick = function() {
      // now to take the data values from the form
      var dataToReturn = [];
      configDataParse.options.forEach((element, index) => {
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

  ReturnConfig: function ReturnConfig(pluginName) {

  },

  SetConfig: function SetConfig(pluginName, data) {

  },
  
}
