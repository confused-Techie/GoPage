
window.onload = function() {
  // This is being moved from HTML to JS to reduce global pollution, and other concerns, as well as remove ESLinter complaints

  onPageLoad();

  firstTimeSetup();

  // Then functions to fill out data of the forms
  addFormCategory();

  // Functions to allow setting and changing Header Plugins
  headerPlugins();
};

// ADD onclick Handlers
document.getElementById("ShowAllCategorySelector").onclick = function() {
  filterSelection('all');
}

function onPageLoad() {
  // first in the onload we can use the built in api call to get all json objects, to then create the other filter buttons

  fetch("/api/items")
    .then((response) => response.json())
    .then((data) => {
      var assignedBtns = [];
      // then to loop through all the data
      data.forEach((element) => {
        // now we want to add this item as a button
        // while ensuring we don't add the same button twice

        if (assignedBtns.indexOf(element.category) == -1) {
          let btn = document.createElement("button");
          btn.innerHTML = `${element.category}`;
          btn.onclick = function() {
            filterSelection(`${element.category}`);
          };
          btn.className = "btn";

          // since the normal method to detect the active button isn't working on these generated ones, we can add it manually
          btn.addEventListener("click", generatedEventListener, false);
          document.getElementById("btnContainer").appendChild(btn);

          //then add this button to the list of assignedBtns
          assignedBtns.push(element.category);
        } // else the button has already been assigned and is ignored

      });
    });

    // this provides a default
    filterSelection("all");

}

function filterSelection(c) {
  var filterDivElement = document.getElementsByClassName("filterDiv");

  if (c == "all") { c = ""; }

  for (let i = 0; i < filterDivElement.length; i++) {
    removeClass(filterDivElement[i], "show");
    if (filterDivElement[i].className.indexOf(c) > -1) { addClass(filterDivElement[i], "show"); }
  }
}

function removeClass(element, name) {
  let elementClasses = element.className.split(" ");
  let provNames = name.split(" ");
  for (let i = 0; i < provNames.length; i++) {
    while (elementClasses.indexOf(provNames[i]) > -1) {
      elementClasses.splice(elementClasses.indexOf(provNames[i]), 1);
    }
  }
  element.className = elementClasses.join(" ");
}

function addClass(element, name) {
  let elementClasses = element.className.split(" ");
  let provNames = name.split(" ");
  for (let i = 0; i < provNames.length; i++) {
    if (elementClasses.indexOf(provNames[i]) == -1) {
      element.className += " " + provNames[i];
    }
  }
}

// init adding class to currently active button
//generatedEventListener();
var btnContainer = document.getElementById("btnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

function generatedEventListener(event) {
  var btnContainer = document.getElementById("btnContainer");
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  }
}

function firstTimeSetup() {
  // this will check for any saved items, and if there are none, will display a helpful modal of options to get started.
  fetch("/api/items")
    .then((res) => res.json())
    .then(response => {
      if (response.length == 0) {
        var modal = document.getElementById("firstTimeModal");
        modal.style.display = "block";

        // once visible we want to register an onclick handler with the now visible close button
        var modalClose = document.getElementById("closeFirstTimeModal");

        // and another onclick handler for the submit language
        var modalChangeLang = document.getElementById("firstTimeModalLangSubmit");

        modalClose.onclick = function() {
          modal.style.display = "none";
        };

        modalChangeLang.onclick = function() {
          var modalChosenLang = document.getElementById("changeLang");
          var chosenLang = modalChosenLang.value;
          fetch(`/api/changelang?lang=${chosenLang}`)
            .then((res) => res.json())
            .then(response => {
              console.log(response);

              // once it has been queried push the data into the homepage snackbar
              var snack = document.getElementById("homePageSnackbar");
              snack.innerText = response;
              snack.className += " show";

              setTimeout(function(){ snack.className = snack.className.replace("show", ""); }, 3000);
            });
        };
      }
    });
}

// Form Based JS

function addFormCategory() {
  // first we need the list of all categories from the api
  fetch("/api/items")
    .then((response) => response.json())
    .then((data) => {
      var categoryListToInsert;
      var categoryListToCheck = [];
      data.forEach((element) => {
        if (!categoryListToCheck.includes(element.category)) {
          categoryListToInsert += `<option value='${element.category}'>`;
          categoryListToCheck.push(element.category);
        }
      });
      document.getElementById('new-current-category').innerHTML = categoryListToInsert;
      document.getElementById('edit-current-category').innerHTML = categoryListToInsert;
    });

    // Handle the installed plugins datalist, via API
    fetch("/plugins/installedPlugins.json")
      .then((response) => response.json())
      .then((data) => {
        var pluginListToInsert;

        data.forEach((element) => {
          if (element.type == "item") {
            pluginListToInsert += `<option value='${element.name}'>`;
          }
        });
        document.getElementById('new-available-plugins').innerHTML = pluginListToInsert;
        document.getElementById('edit-available-plugins').innerHTML = pluginListToInsert;
      });
}

/*eslint disable-next-line no-unused-vars*/
function dataListInputV2(ele, caller) {
  fetch("/plugins/installedPlugins.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        if (ele.value == element.name) {
          if (element.config) {
            if (ele.getAttribute('name') == 'plugin-name1' || ele.getAttribute('name') == 'edit-plugin-name1') {
              if (caller == "new") {
                dataListInputCaller('plugin-label1', 'plugin-example1', 'plugin-options1', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-plugin-label1', 'edit-plugin-example1', 'edit-plugin-options1', element.options.explain, element.options.autofill);
              }
            } else if (ele.getAttribute('name') == 'plugin-name2' || ele.getAttribute('name') == 'edit-plugin-name2') {
              if (caller == "new") {
                dataListInputCaller('plugin-label2', 'plugin-example2', 'plugin-options2', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-plugin-label2', 'edit-plugin-example2', 'edit-plugin-options2', element.options.explain, element.options.autofill);
              }
            } else if (ele.getAttribute('name') == 'plugin-name3' || ele.getAttribute('name') == 'edit-plugin-name3') {
              if (caller == "new") {
                dataListInputCaller('plugin-label3', 'plugin-example3', 'plugin-options3', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-plugin-label3', 'edit-plugin-example3', 'edit-plugin-options3', element.options.explain, element.options.autofill);
              }
            } else if (ele.getAttribute('name') == 'plugin-name4' || ele.getAttribute('name') == 'edit-plugin-name4') {
              if (caller == "new") {
                dataListInputCaller('plugin-label4', 'plugin-example4', 'plugin-options4', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-plugin-label4', 'edit-plugin-example4', 'edit-plugin-options4', element.options.explain, element.options.autofill);
              }
            } else if (ele.getAttribute('name') == 'plugin-name5' || ele.getAttribute('name') == 'edit-plugin-name5') {
              if (caller == "new") {
                dataListInputCaller('plugin-label5', 'plugin-example5', 'plugin-options5', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-plugin-label5', 'edit-plugin-example5', 'edit-plugin-options5', element.options.explain, element.options.autofill);
              }
            } else if (ele.getAttribute('name') == 'plugin-name6' || ele.getAttribute('name') == 'edit-plugin-name6') {
              if (caller == "new") {
                dataListInputCaller('plugin-label6', 'plugin-example6', 'plugin-options6', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-plugin-label6', 'edit-plugin-example6', 'edit-plugin-options6', element.options.explain, element.options.autofill);
              }
            }// 7
          }
        }
      });
    });
}

function dataListInputCaller(view, explain, autofill, explainData, autofillData) {
  dataListInputChangeView(view);
  dataListInputChangeExplain(explain, explainData);
  dataListInputChangeAutofill(autofill, autofillData);
}

function dataListInputChangeView(eleName) {
  var ele = document.getElementById(eleName);
  ele.classList.remove('readonly_id');
}

function dataListInputChangeExplain(eleName, explain) {
  var ele = document.getElementById(eleName);
  ele.innerHTML = explain;
}

function dataListInputChangeAutofill(eleName, autofill) {
  var ele = document.getElementById(eleName);
  ele.classList.remove('readonly_id');
  ele.removeAttribute('readonly');
  ele.value = autofill;
}

// Modal based JS

// Previous links to delete in HTML: <div class="deleteItem"> <a href="/delete/{{.Id}}"> <img src="/assets/images/trash-2.svg"> </a> </div>
/*eslint-disable-next-line no-unused-vars*/
function modalDelete(id) {
  // this should be called when the delete button is hit
  var modal = document.getElementById("deleteModal");

  // allow it to be visible.
  modal.style.display = "block";

  // Once visible we want to register an onclick handler with the now visible confirm delete button.
  var modalNotDeleteBtn = document.getElementById("notDelete-modal");

  var modalDeleteBtn = document.getElementById("delete-modal");

  modalDeleteBtn.onclick = function() {
    //window.location.href = `/delete/${id}`;
    // Instead of changing the window location to the delete post handler,
    // we will use the new api to delete this item

    fetch(`/api/deletelink/${id}`)
      .then((res) => res.json())
      .then(response => {
        if (response == "Success") {
          modal.style.display = "none";

          var snack = document.getElementById("homePageSnackbar");
          snack.innerText = "Successfully Deleted Link Item. Reloading Page...";
          snack.className += " show";
          setTimeout(function(){ snack.className = snack.className.replace("show", ""); location.reload(); }, 3000);
        } else {
          // an error occured during deletion
        }
      });
  };

  modalNotDeleteBtn.onclick = function() {
    modal.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

/*eslint-disable-next-line no-unused-vars*/
function newItemModal() {
  var modal = document.getElementById("newItemModal");
  modal.style.display = "block";

  // once visible we want to register an onclick ahndler with the now visible buttons
  var modalNotNewBtn = document.getElementById("new-form-goBack");
  var modalSubmit = document.getElementById("new-form-submit");

  modalNotNewBtn.onclick = function() {
    modal.style.display = "none";
  };

  modalSubmit.onclick = function() {
    // Here we will want to handle all validation features in the future
    // such as ensuring that no plugin location is chosen twice and so on.
    // TODO:: Error Handling for the data submitted

    var form = document.getElementById("new-item-form");

    // and we will take the form data turning it into an object
    var rawObj = {
      friendlyName: form.friendlyName.value,
      link: form.link.value,
      category: form.category.value,
      plugins: []
    };

    // now to build the plugin portion of the object

    // while only 6 options exist this is 7 to account for starting at 1
    for (var i = 1; i < 7; i++) {
      var elements = document.getElementsByName(`plugin-name${i}`);
      var tmpObj = { name: "", options: "", location: "" };
      if (elements.length == 1) {
        if (elements[0].value) {
          // this would indicate its a truthy value and we can add it
          tmpObj.name = elements[0].value;
          tmpObj.options = document.getElementById(`plugin-options${i}`).value;
          tmpObj.location = document.getElementById(`plugin-loc${i}`).value;
          rawObj.plugins.push(tmpObj);
        }
      } else {
        console.log('Something unexpected happened reading your data.');
      }
    }

    // now with the object built we can post it to the api endpoint
    var newHeaders = new Headers();
    newHeaders.append("Content-Type", "application/json");

    var rawJSON = JSON.stringify(rawObj);

    var requestOptions = {
      method: "POST",
      headers: newHeaders,
      body: rawJSON,
      redirect: "follow"
    };

    fetch("/api/new/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result == "Success") {
          //console.log("Successfully Saved new Item.");
          modal.style.display = "none";

          // TODO:: Probably a good idea to go ahead and move the snackbar functions to a new universal JS class
          var snackbar = document.getElementById("homePageSnackbar");
          snackbar.innerText = "Successfully Added New Link Item. Refreshing...";
          snackbar.className += " show";

          setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); location.reload(); }, 3000);
        } else {
          // error occured sending data
          console.log(`Error: ${result}`);
        }
      })
  };
}



/*eslint-disable-next-line no-unused-vars*/
function editItemModalV2(oldId, oldFriendlyName, oldLink, oldCategory, oldPlugins) {
  // We first want to fill in all the values from the existing item

  document.getElementById("edit-id").value = oldId;
  document.getElementById("edit-friendlyName").value = oldFriendlyName;
  document.getElementById("edit-link").value = oldLink;
  document.getElementById("edit-category").value = oldCategory;

  for (var i = 0; i < oldPlugins.length; i++) {
    document.getElementById(`edit-plugin-name${i+1}`).value = oldPlugins[i].name;
    document.getElementById(`edit-plugin-loc${i+1}`).value = oldPlugins[i].location;
    if (typeof oldPlugins[i].options != null && typeof oldPlugins[i].options != undefined && typeof oldPlugins[i].options != "") {
      // we want to assign the values and make them visible
      dataListInputChangeView(`edit-plugin-label${i+1}`);
      dataListInputChangeAutofill(`edit-plugin-options${i+1}`, oldPlugins[i].options);
    }
  }

  var modal = document.getElementById("editItemModal");
  modal.style.display = "block";

  // then to attach handlers to the buttons
  var modalNotEditBtn = document.getElementById("edit-form-goBack");
  var modalSubmit = document.getElementById("edit-form-submit");

  modalNotEditBtn.onclick = function() {
    modal.style.display = "none";
  };

  modalSubmit.onclick = function() {
    // TODO:: Here we will want to add validation

    var form = document.getElementById("edit-item-form");

    // and we will take the form data turning ti into an object
    // parsing int here since if passed as string go will fail to unmarshal into json properly
    var rawObj = {
      id: parseInt(form.id.value),
      friendlyName: form.friendlyName.value,
      link: form.link.value,
      category: form.category.value,
      plugins: []
    };

    // now to build teh plugin portion of the object

    //while only 6 options exist this is 7 to account for starting at 1
    for (var i = 1; i < 7; i++) {
      var elements = document.getElementsByName(`edit-plugin-name${i}`);
      var tmpObj = { name: "", options: "", location: "" };
      if (elements.length == 1) {
        if (elements[0].value) {
          // this would indicate its a truthy value and we can add it
          tmpObj.name = elements[0].value;
          tmpObj.options = document.getElementById(`edit-plugin-options${i}`).value;
          tmpObj.location = document.getElementById(`edit-plugin-loc${i}`).value;
          rawObj.plugins.push(tmpObj);
        }
      } else {
        console.log("Something unexpected happend reading your data.");
      }
    }

    // now with the object build we can post it to the api endpoint
    var newHeaders = new Headers();
    newHeaders.append("Content-Type", "application/json");

    var rawJSON = JSON.stringify(rawObj);

    var requestOptions = {
      method: "POST",
      headers: newHeaders,
      body: rawJSON,
      redirect: "follow"
    };


    fetch("/api/edit/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result == "Success") {
          modal.style.display = "none";

          // TODO:: probably a good idea to go ahead and move the snackbar functions to a new universal JS class
          var snackbar = document.getElementById("homePageSnackbar");
          snackbar.innerText = "Successfully Modified exisiting Link Item. Refreshing...";
          snackbar.className += " show";

          setTimeout(function() { snackbar.className = snackbar.className.replace("show", ""); location.reload(); }, 3000);
        } else {
          console.log(`Error: ${result}`);
        }
      });
  }
}

function headerPlugins() {
  // first assign onclick handlers

  var headerPluginLeft = document.getElementById("headerPluginLeft");
  var headerPluginRight = document.getElementById("headerPluginRight");


  headerPluginLeft.onclick = function() {

  };

  headerPluginRight.onclick = function() {

  };

}
