
window.onload = function() {
  // This is being moved from HTML to JS to reduce global pollution, and other concerns, as well as remove ESLinter complaints

  onPageLoad();

  firstTimeSetup();

  // Then functions to fill out data of the forms
  addFormCategory();
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
function dataListInput(ele, caller) {
  fetch("/plugins/installedPlugins.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        if (ele.value == element.name) {
          if (element.config) {
            if (ele.getAttribute('name') == 'leftPlugin') {
              if (caller == "new") {
                dataListInputCaller('leftPluginLabel', 'left-plugin-example', 'leftPluginOptions', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-leftPluginLabel', 'edit-left-plugin-example', 'edit-leftPluginOptions', element.options.explain, element.options.autofill);
              }
            } else if (ele.getAttribute('name') == 'centerPlugin') {
              if (caller == "new") {
                dataListInputCaller('centerPluginLabel', 'center-plugin-example', 'centerPluginOptions', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-centerPluginLabel', 'edit-center-plugin-example', 'edit-centerPluginOptions', element.options.explain, element.options.autofill);
              }
            } else if (ele.getAttribute('name') == 'rightPlugin') {
              if (caller == "new") {
                dataListInputCaller('rightPluginLabel', 'right-plugin-example', 'rightPluginOptions', element.options.explain, element.options.autofill);
              } else if (caller == "edit") {
                dataListInputCaller('edit-rightPluginLabel', 'edit-right-plugin-example', 'edit-rightPluginOptions', element.options.explain, element.options.autofill);
              }
            } else {
              console.log(`Unknown Parent calling dataListInput: ${ele.getAttribute('name')}`);
            }
          } // else there is no configuration to this item
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

  modalNotNewBtn.onclick = function() {
    modal.style.display = "none";
  }
}

/*eslint-disable-next-line no-unused-vars*/
function editItemModal(oldId, oldLink, oldName, oldCategory, oldLeftPlugin, oldLeftPluginOptions, oldCenterPlugin, oldCenterPluginOptions, oldRightPlugin, oldRightPluginOptions) {
  // before making this item visible, we will fill in all the old details
  document.getElementById("edit-id").value = oldId;
  document.getElementById("edit-link").value = oldLink;
  document.getElementById("edit-category").value = oldCategory;
  document.getElementById("edit-friendlyName").value = oldName;

  document.getElementById("edit-leftPlugin").value = oldLeftPlugin;
  if (typeof oldLeftPluginOptions != null && typeof oldLeftPluginOptions != undefined && oldLeftPluginOptions != "") {
    console.log(typeof oldLeftPluginOptions)
    dataListInputChangeView('edit-leftPluginLabel');
    dataListInputChangeAutofill('edit-leftPluginOptions', oldLeftPluginOptions);
  }

  document.getElementById("edit-centerPlugin").value = oldCenterPlugin;
  if (typeof oldCenterPluginOptions != null && typeof oldCenterPluginOptions != undefined && oldCenterPluginOptions != "") {
    dataListInputChangeView('edit-centerPluginLabel');
    dataListInputChangeAutofill('edit-centerPluginOptions', oldCenterPluginOptions);
  }

  document.getElementById("edit-rightPlugin").value = oldRightPlugin;
  if (typeof oldRightPluginOptions != null && typeof oldRightPluginOptions != undefined && oldRightPluginOptions != "") {
    dataListInputChangeView('edit-rightPluginLabel');
    dataListInputChangeAutofill('edit-rightPluginOptions', oldRightPluginOptions);
  }

  var modal = document.getElementById("editItemModal");
  modal.style.display = "block";

  // once visible we want to register an onclick handler with the now visible buttons
  var modalNotEditBtn = document.getElementById("edit-form-goBack");

  modalNotEditBtn.onclick = function() {
    modal.style.display = "none";
  }
}
