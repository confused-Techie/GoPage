window.onload = function () {
  // This is being moved from HTML to JS to reduce global pollution, and other concerns, as well as remove ESLinter complaints

  homePageInit();

  firstTimeSetup();

  // Then functions to fill out data of the forms
  addFormCategory();

  // Functions to allow setting and changing Header Plugins
  headerPlugins();
};

function homePageInit(type) {
  // this is called during first page load and as a callback to template hot reloading

  filterSelection("all");

  var btnContainer = document.getElementById("btnContainer");
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }

  // now keeping in mind that once a hot-reload occurs all plugins will lose their references to the DOM.
  // so plugins must be reloaded, which can easily occur by reattaching thhem to the dom.
  // plugins do have the custom data-plugin-type="iitem" attached that we can use.
  if (typeof type === "string") {
    if (type == "reload") {
      reloadPluginJS();
    }
  }
}

function reloadPluginJS() {
  var pluginList = document.querySelectorAll("[data-plugin-type]");

  for (var i = 0; i < pluginList.length; i++) {
    var newScript = document.createElement("script");
    // pluginList[i].src returns the process src, as in the absoulte URL, to ensure that its identical, we will grab the relative
    newScript.src = pluginList[i].attributes.src.nodeValue;
    // but this still doesn't actual reload the script which may be a browser caching issue, we can add a cache buster
    if (newScript.src.includes("cachebuster")) {
      // added check for pre-existing cachebuster value, to only modify the exisitng one, rather than append endlessly
      newScript.src = newScript.src.replace(
        /[?]cachebuster=[0-9]+/,
        `?cachebuster=${new Date().getTime()}`
      );
    } else {
      newScript.src = `${newScript.src}?cachebuster=${new Date().getTime()}`;
    }
    newScript.type = pluginList[i].type;
    newScript.dataset.pluginType = pluginList[i].dataset.pluginType;

    // with the new script dom element created, remove the current one then append thhis one.
    pluginList[i].remove();
    document.body.appendChild(newScript);
  }
}

function filterSelection(c) {
  var filterDivElement = document.getElementsByClassName("filterDiv");

  if (c == "all") {
    c = "";
  }

  for (var i = 0; i < filterDivElement.length; i++) {
    removeClass(filterDivElement[i], "show");
    if (filterDivElement[i].className.indexOf(c) > -1) {
      addClass(filterDivElement[i], "show");
    }
  }
}

function removeClass(element, name) {
  var elementClasses = element.className.split(" ");
  var provNames = name.split(" ");
  for (var i = 0; i < provNames.length; i++) {
    while (elementClasses.indexOf(provNames[i]) > -1) {
      elementClasses.splice(elementClasses.indexOf(provNames[i]), 1);
    }
  }
  element.className = elementClasses.join(" ");
}

function addClass(element, name) {
  var elementClasses = element.className.split(" ");
  var provNames = name.split(" ");
  for (var i = 0; i < provNames.length; i++) {
    if (elementClasses.indexOf(provNames[i]) == -1) {
      element.className += " " + provNames[i];
    }
  }
}

function addPluginToFormV2() {
  var lastAddPluginItem = document.getElementsByClassName("add-plugin-link")[document.getElementsByClassName("add-plugin-link").length -1];
  // the last plugin should be the unexpanded plugin, until we change its display mode, and subsequently should have no information entered.

  var clonedParent = lastAddPluginItem.parentElement.cloneNode(true);
  lastAddPluginItem.parentElement.insertAdjacentElement("afterend", clonedParent);
  // the lastAddPluginItem is the text adjacent to the plugin form.
  // getting the parent allows us to have the full form-text div, which is what we want to duplicate and insert.

  // now to chagne the display mode of the descendent div
  var addInfoDescendent = lastAddPluginItem.parentElement.getElementsByClassName("additional_info")[0];
  addInfoDescendent.style.display = "block";
}

function getLinkItemForm() {
  // parseLinkItemForm will either return an object of JSON, or a string, containing an error message that is safe to display to the user.

  var returnJSONObj = {
    name: "",
    link: "",
    category: "",
    plugins: []
  };

  var fullFormDOM = document.getElementById("new-item-test-form");
  // since getElementById returns an element object, we need to ensure we only use methods available to access values.
  // but to make life slightly easier, for non-plugin data, we can use the FomrData Object Constructor
  var fullFormDATA = new FormData(document.getElementById("new-item-test-form"));
  var linkItemName$ = fullFormDATA.getAll("friendlyName");
  var linkItemLink$ = fullFormDATA.getAll("link");
  var linkItemCategory$ = fullFormDATA.getAll("category");

  returnJSONObj.name = linkItemName$[0];
  returnJSONObj.link = linkItemLink$[0];
  returnJSONObj.category = linkItemCategory$[0];

  // with the required elements, we can do a validation check now
  // first will be valid form data gathered check
  if (linkItemName$.length > 1 || linkItemLink$.length > 1 || linkItemCategory$.length > 1) {
    return "why so many values!";
  }
  // then check validity of entered values
  if (!stringValidityNotEmpty(returnJSONObj.name)) {
    return "name can't be empty";
  } else if (!stringValidityNotEmpty(returnJSONObj.link)) {
    return "link can't be empty";
  } else if (!stringValidityNotEmpty(returnJSONObj.category)) {
    return "cateogyr can't be empty";
  }

  // after checking the required data, we can use an element method querySelectorAll list to get an array of plugin form NodeList's
  var pluginNodeList = fullFormDOM.querySelectorAll(`[class="additional_info"]`);

  for (var i = 0; i < pluginNodeList.length; i++) {
    // with our []NodeLists we will first take the child section of pluginAddContainer
    var htmlCollectionPlugin = pluginNodeList[i].children[0];

    var pluginName$ = htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`);
    var pluginLocation$ = htmlCollectionPlugin.querySelectorAll(`[name="pluginLocation"]`);
    var pluginOptions$ = htmlCollectionPlugin.querySelectorAll(`[name="pluginOptions"]`);

    // check that only one item of this name is available
    if (pluginName$.length > 1 || pluginLocation$.length > 1 || pluginOptions$.length > 1) {
      return "why so many values!";
    }
    // check that it has a value, otherwise we know its empty and we can skip applying this plugin at all
    if (!stringValidityNotEmpty(pluginName$[0].value)) {
      continue;
    }
    // although if the name is valid, but hhas no location that should through an error
    if (!stringValidityNotEmpty(pluginLocation$[0].value)) {
      return "wheres the damn plugin location!";
    }

    // but if all is well we can create a temporary json object to push into the plugins array of the return json object
    var tmpPluginJSON = {
      name: pluginName$[0].value,
      location: pluginLocation$[0].value,
      options: !stringValidityNotEmpty(pluginOptions$[0].value) ? "" : pluginOptions$[0].value
    };

    returnJSONObj.plugins.push(tmpPluginJSON);
  }

  return returnJSONObj;

}

function setLinkItemForm(jsonObj) {
  // this expects a valid JSON object.
  // { name: 'linkItemName', link: 'linkItemLink', category: 'linkItemCategory', plugins: [ name: '', location: '', options: ''] }

  // for documentation on why methods are used, or the logic behind thhe scenes here, look at getLinkItemForm()
  try {
    var fullFormDOM = document.getElementById("new-item-test-form");

    //var fullFormDATA = new FormData(document.getElementById("new-item-test-form"));
    //fullFormDATA.set("friendlyName", jsonObj.name);
    //fullFormDATA.getAll("friendlyName")[0].value = jsonObj.name;
    //fullFormDATA.getAll("link")[0] = jsonObj.link;
    //fullFormDATA.getAll("category")[0] = jsonObj.category;
    fullFormDOM.querySelector(`[name="friendlyName"]`).value = jsonObj.name;
    fullFormDOM.querySelector(`[name="link"]`).value = jsonObj.link;
    fullFormDOM.querySelector(`[name="category"]`).value = jsonObj.category;


    for (var i = 0; i < jsonObj.plugins.length; i++) {
      // firstly create the plugin item
      addPluginToFormV2();
      var pluginNodeList = fullFormDOM.querySelectorAll(`[class="additional_info"]`);
      var htmlCollectionPlugin = pluginNodeList[i].children[0];

      htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`)[0].value = jsonObj.plugins[i].name;
      htmlCollectionPlugin.querySelectorAll(`[name="pluginLocation"]`)[0].value = jsonObj.plugins[i].location;
      htmlCollectionPlugin.querySelectorAll(`[name="pluginOptions"]`)[0].value = jsonObj.plugins[i].options;
    }
    return true;
    // return true at the end just in case to indicate valid data.

  } catch(err) {
    return err;
  }

}

function stringValidityNotEmpty(string) {
  // this returns true if the passed string seems to be valid, false otherwise
  try {
    if (typeof string === "string") {
      if (string == "") {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch(err) {
    return false;
  }
}

function disablePluginLocation(element) {
  document.getElementById("plugin-location-list").querySelector(`[value=${element.value}]`).setAttribute("disabled", "");
}

function firstTimeSetup() {
  // this will check for any saved items, and if there are none, will display a helpful modal of options to get started.
  fetch("/api/items")
    .then((res) => res.json())
    .then((response) => {
      if (response.length === 0) {
        universe.ShowModal("firstTimeModal");

        // once visible we want to register an onclick handler with the now visible close button
        var modalClose = document.getElementById("closeFirstTimeModal");

        // and another onclick handler for the submit language
        var modalChangeLang = document.getElementById(
          "firstTimeModalLangSubmit"
        );

        modalClose.onclick = function () {
          universe.CloseModal("firstTimeModal");
        };

        modalChangeLang.onclick = function () {
          var modalChosenLang = document.getElementById("changeLang");
          var chosenLang = modalChosenLang.value;
          fetch(`/api/changelang?lang=${chosenLang}`)
            .then((res) => res.json())
            .then((response) => {
              universe.SnackbarCommon(
                "snackbar",
                langHandler.UnicornComposite(
                  i18n_returnsSuccessUpdate,
                  i18n_returnValueLangauge
                ),
                false,
                false,
                false,
                false,
                response
              );
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
      document.getElementById("new-current-category").innerHTML =
        categoryListToInsert;
      document.getElementById("edit-current-category").innerHTML =
        categoryListToInsert;
    });

  // Handle the installed plugins datalist, via API
  fetch("/plugins/installedPlugins.json")
    .then((response) => response.json())
    .then((data) => {
      var pluginListToInsertITEM, pluginListToInsertHEADER;

      data.forEach((element) => {
        if (element.type == "item") {
          pluginListToInsertITEM += `<option value='${element.name}'>`;
        } else if (element.type == "header") {
          pluginListToInsertHEADER += `<option value='${element.name}'>`;
        }
      });
      document.getElementById("new-available-plugins").innerHTML =
        pluginListToInsertITEM;
      document.getElementById("edit-available-plugins").innerHTML =
        pluginListToInsertITEM;
      document.getElementById("header-plugin-list").innerHTML =
        pluginListToInsertHEADER;
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
            if (
              ele.getAttribute("name") == "plugin-name1" ||
              ele.getAttribute("name") == "edit-plugin-name1"
            ) {
              if (caller == "new") {
                dataListInputCaller(
                  "plugin-label1",
                  "plugin-example1",
                  "plugin-options1",
                  element.options.explain,
                  element.options.autofill
                );
              } else if (caller == "edit") {
                dataListInputCaller(
                  "edit-plugin-label1",
                  "edit-plugin-example1",
                  "edit-plugin-options1",
                  element.options.explain,
                  element.options.autofill
                );
              }
            } else if (
              ele.getAttribute("name") == "plugin-name2" ||
              ele.getAttribute("name") == "edit-plugin-name2"
            ) {
              if (caller == "new") {
                dataListInputCaller(
                  "plugin-label2",
                  "plugin-example2",
                  "plugin-options2",
                  element.options.explain,
                  element.options.autofill
                );
              } else if (caller == "edit") {
                dataListInputCaller(
                  "edit-plugin-label2",
                  "edit-plugin-example2",
                  "edit-plugin-options2",
                  element.options.explain,
                  element.options.autofill
                );
              }
            } else if (
              ele.getAttribute("name") == "plugin-name3" ||
              ele.getAttribute("name") == "edit-plugin-name3"
            ) {
              if (caller == "new") {
                dataListInputCaller(
                  "plugin-label3",
                  "plugin-example3",
                  "plugin-options3",
                  element.options.explain,
                  element.options.autofill
                );
              } else if (caller == "edit") {
                dataListInputCaller(
                  "edit-plugin-label3",
                  "edit-plugin-example3",
                  "edit-plugin-options3",
                  element.options.explain,
                  element.options.autofill
                );
              }
            } else if (
              ele.getAttribute("name") == "plugin-name4" ||
              ele.getAttribute("name") == "edit-plugin-name4"
            ) {
              if (caller == "new") {
                dataListInputCaller(
                  "plugin-label4",
                  "plugin-example4",
                  "plugin-options4",
                  element.options.explain,
                  element.options.autofill
                );
              } else if (caller == "edit") {
                dataListInputCaller(
                  "edit-plugin-label4",
                  "edit-plugin-example4",
                  "edit-plugin-options4",
                  element.options.explain,
                  element.options.autofill
                );
              }
            } else if (
              ele.getAttribute("name") == "plugin-name5" ||
              ele.getAttribute("name") == "edit-plugin-name5"
            ) {
              if (caller == "new") {
                dataListInputCaller(
                  "plugin-label5",
                  "plugin-example5",
                  "plugin-options5",
                  element.options.explain,
                  element.options.autofill
                );
              } else if (caller == "edit") {
                dataListInputCaller(
                  "edit-plugin-label5",
                  "edit-plugin-example5",
                  "edit-plugin-options5",
                  element.options.explain,
                  element.options.autofill
                );
              }
            } else if (
              ele.getAttribute("name") == "plugin-name6" ||
              ele.getAttribute("name") == "edit-plugin-name6"
            ) {
              if (caller == "new") {
                dataListInputCaller(
                  "plugin-label6",
                  "plugin-example6",
                  "plugin-options6",
                  element.options.explain,
                  element.options.autofill
                );
              } else if (caller == "edit") {
                dataListInputCaller(
                  "edit-plugin-label6",
                  "edit-plugin-example6",
                  "edit-plugin-options6",
                  element.options.explain,
                  element.options.autofill
                );
              }
            } // 7
          }
        }
      });
    });
}

/*eslint disable-next-lin no-unused-vars*/
function dataListInputHeader(ele) {
  fetch("/plugins/installedPlugins.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        if (ele.value == element.name) {
          if (element.config) {
            // since the header modal only allows modifying a signle item at once, we don't need any checking of the element
            dataListInputCaller(
              "header-plugin-label",
              "header-plugin-example",
              "header-plugin-options",
              element.options.explain,
              element.options.autofill
            );
          }
        }
      });
    });
}

function dataListInputCaller(
  view,
  explain,
  autofill,
  explainData,
  autofillData
) {
  dataListInputChangeView(view);
  dataListInputChangeExplain(explain, explainData);
  dataListInputChangeAutofill(autofill, autofillData);
}

function dataListInputChangeView(eleName) {
  var ele = document.getElementById(eleName);
  ele.classList.remove("readonly_id");
}

function dataListInputChangeExplain(eleName, explain) {
  var ele = document.getElementById(eleName);
  ele.innerHTML = explain;
}

function dataListInputChangeAutofill(eleName, autofill) {
  var ele = document.getElementById(eleName);
  ele.classList.remove("readonly_id");
  ele.removeAttribute("readonly");
  ele.value = autofill;
}

// Modal based JS

// Previous links to delete in HTML: <div class="deleteItem"> <a href="/delete/{{.Id}}"> <img src="/assets/images/trash-2.svg"> </a> </div>
/*eslint-disable-next-line no-unused-vars*/
function modalDelete(id) {
  // this should be called when the delete button is hit
  universe.ShowModal("deleteModal");

  // Once visible we want to register an onclick handler with the now visible confirm delete button.
  var modalNotDeleteBtn = document.getElementById("notDelete-modal");

  var modalDeleteBtn = document.getElementById("delete-modal");

  modalDeleteBtn.onclick = function () {
    //window.location.href = `/delete/${id}`;
    // Instead of changing the window location to the delete post handler,
    // we will use the new api to delete this item

    fetch(`/api/deletelink/${id}`)
      .then((res) => res.json())
      .then((response) => {
        if (response == "Success") {
          universe.CloseModal("deleteModal");

          universe.SnackbarCommon(
            "snackbar",
            langHandler.UnicornComposite(
              i18n_returnsSuccessDelete,
              i18n_returnValueLinkItem
            ),
            universe.HotReload("linkItemList", "/", homePageInit, "reload")
          );
        } else {
          // an error occured during deletion
          universe.SnackbarError(
            "snackbar",
            langHandler.UnicornComposite(
              i18n_returnsFailureDelete,
              "Link Item"
            ),
            false,
            response
          );
        }
      });
  };

  modalNotDeleteBtn.onclick = function () {
    universe.CloseModal("deleteModal");
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      universe.CloseModal("deleteModal");
    }
  };
}

/*eslint-disable-next-line no-unused-vars*/
function newItemModal() {
  universe.ShowModal("newItemModal");

  // once visible we want to register an onclick ahndler with the now visible buttons
  var modalNotNewBtn = document.getElementById("new-form-goBack");
  var modalSubmit = document.getElementById("new-form-submit");

  modalNotNewBtn.onclick = function () {
    universe.CloseModal("newItemModal");
  };

  modalSubmit.onclick = function () {
    // Here we will want to handle all validation features in the future
    // such as ensuring that no plugin location is chosen twice and so on.
    var form = document.getElementById("new-item-form");

    validateLinkItemData(form).then((validateAnswer) => {
      if (validateAnswer.valid) {
        // and we will take the form data turning it into an object
        var rawObj = {
          friendlyName: form.friendlyName.value,
          link: form.link.value,
          category: form.category.value,
          plugins: [],
        };

        // now to build the plugin portion of the object

        // while only 6 options exist this is 7 to account for starting at 1
        for (var i = 1; i < 7; i++) {
          var elements = document.getElementsByName(`plugin-name${i}`);
          var tmpObj = { name: "", options: "", location: "" };
          if (elements.length === 1) {
            // since getElementsByName returns a list of items, but we only care about the one that exists we use 0 to point at that one
            if (elements[0].value) {
              // this would indicate its a truthy value and we can add it
              tmpObj.name = elements[0].value;
              tmpObj.options = document.getElementById(
                `plugin-options${i}`
              ).value;
              tmpObj.location = document.getElementById(`plugin-loc${i}`).value;
              rawObj.plugins.push(tmpObj);
            }
          } else {
            universe.SnackbarError(
              "snackbar",
              i18n_returnValueGenericError,
              false,
              "Something unexpected happened reading your data."
            );
          }
        }

        // now with the object built we can post it to the api endpoint
        var rawJSON = JSON.stringify(rawObj);

        var requestOptions = universe.CreateJSONPOSTHeaders(rawJSON);

        fetch("/api/new/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result == "Success") {
              universe.CloseModal("newItemModal");

              universe.SnackbarCommon(
                "snackbar",
                langHandler.UnicornComposite(
                  i18n_returnsSuccessAdd,
                  i18n_returnValueLinkItem
                ),
                universe.HotReload("linkItemList", "/", homePageInit, "reload")
              );
            } else {
              // error occured sending data
              console.log(`Error: ${result}`);
              universe.SnackbarError(
                "snackbar",
                i18n_returnValueGenericError,
                false,
                result
              );
            }
          });
      } else {
        // validate data fails
        universe.SnackbarError("snackbar", validateAnswer.msg);
      }
    });
  };
}

function validateLinkItemData(form) {
  // TODO:: Validate the use of Plugin Locations
  return new Promise(function (resolve, reject) {
    // this will just check the required data to see if it is valid
    var checkString = function (string) {
      if (typeof string === "string" && string.length > 1) {
        return true;
      } else {
        return false;
      }
    };

    // The required alements of a form:
    // FriendlyName
    // Link
    // Category

    var tmpValidObject = { valid: false, msg: "" };

    var buildValidObj = function (bool, string) {
      tmpValidObject.valid = bool;
      tmpValidObject.msg = string;
      return tmpValidObject;
    };

    if (checkString(form.friendlyName.value)) {
      if (checkString(form.link.value)) {
        if (checkString(form.category.value)) {
          resolve(buildValidObj(true, ""));
        } else {
          // bad category value
          resolve(buildValidObj(false, i18n_validateCategory));
        }
      } else {
        // bad link value
        resolve(buildValidObj(false, i18n_validateLink));
      }
    } else {
      // bad friendly name
      resolve(buildValidObj(false, i18n_validateName));
    }
  });
}

/*eslint-disable-next-line no-unused-vars*/
function editItemModalV2(
  oldId,
  oldFriendlyName,
  oldLink,
  oldCategory,
  oldPlugins
) {
  // We first want to fill in all the values from the existing item

  document.getElementById("edit-id").value = oldId;
  document.getElementById("edit-friendlyName").value = oldFriendlyName;
  document.getElementById("edit-link").value = oldLink;
  document.getElementById("edit-category").value = oldCategory;

  // added check in case plugins aren't assigned at all, to avoid reading length of null item
  if (oldPlugins) {
    for (var i = 0; i < oldPlugins.length; i++) {
      document.getElementById(`edit-plugin-name${i + 1}`).value =
        oldPlugins[i].name;
      document.getElementById(`edit-plugin-loc${i + 1}`).value =
        oldPlugins[i].location;
      if (
        typeof oldPlugins[i].options != null &&
        typeof oldPlugins[i].options != undefined &&
        typeof oldPlugins[i].options != ""
      ) {
        // we want to assign the values and make them visible
        dataListInputChangeView(`edit-plugin-label${i + 1}`);
        dataListInputChangeAutofill(
          `edit-plugin-options${i + 1}`,
          oldPlugins[i].options
        );
      }
    }
  }

  universe.ShowModal("editItemModal");

  // then to attach handlers to the buttons
  var modalNotEditBtn = document.getElementById("edit-form-goBack");
  var modalSubmit = document.getElementById("edit-form-submit");

  modalNotEditBtn.onclick = function () {
    universe.CloseModal("editItemModal");
  };

  modalSubmit.onclick = function () {
    var form = document.getElementById("edit-item-form");

    validateLinkItemData(form).then((validData) => {
      if (validData.valid) {
        // and we will take the form data turning ti into an object
        // parsing int here since if passed as string go will fail to unmarshal into json properly
        var rawObj = {
          id: parseInt(form.id.value),
          friendlyName: form.friendlyName.value,
          link: form.link.value,
          category: form.category.value,
          plugins: [],
        };

        // now to build teh plugin portion of the object

        //while only 6 options exist this is 7 to account for starting at 1
        for (var i = 1; i < 7; i++) {
          var elements = document.getElementsByName(`edit-plugin-name${i}`);
          var tmpObj = { name: "", options: "", location: "" };
          if (elements.length === 1) {
            if (elements[0].value) {
              // this would indicate its a truthy value and we can add it
              tmpObj.name = elements[0].value;
              tmpObj.options = document.getElementById(
                `edit-plugin-options${i}`
              ).value;
              tmpObj.location = document.getElementById(
                `edit-plugin-loc${i}`
              ).value;
              rawObj.plugins.push(tmpObj);
            }
          } else {
            console.log("Something unexpected happend reading your data.");
            universe.SnackbarError("snackbar", i18n_returnValueGenericError);
          }
        }

        // now with the object build we can post it to the api endpoint

        var rawJSON = JSON.stringify(rawObj);

        fetch("/api/edit/", universe.CreateJSONPOSTHeaders(rawJSON))
          .then((response) => response.json())
          .then((result) => {
            if (result == "Success") {
              universe.CloseModal("editItemModal");

              universe.SnackbarCommon(
                "snackbar",
                langHandler.UnicornComposite(
                  i18n_returnsSuccessUpdate,
                  i18n_returnValueLinkItem
                ),
                universe.HotReload("linkItemList", "/", homePageInit, "reload")
              );
            } else {
              console.log(`Error: ${result}`);
              universe.SnackbarError(
                "snackbar",
                i18n_returnValueGenericError,
                false,
                result
              );
            }
          });
      } else {
        // data is not valid
        universe.SnackbarError("snackbar", validData.msg);
      }
    });
  };
}

function headerPlugins() {
  var headerPluginLeft = document.getElementById("headerPluginLeft");
  var headerPluginRight = document.getElementById("headerPluginRight");

  const changeHeaderSettings = function (
    side,
    pluginName,
    pluginOptions,
    modal
  ) {
    fetch("/api/usersettings")
      .then((res) => res.json())
      .then((data) => {
        // now with the current user settings, we can modify what we need to
        data.headerPlugins[side].name = pluginName;
        data.headerPlugins[side].options = pluginOptions;

        // then to post this data back to GoPage

        var raw = JSON.stringify(data);

        fetch("/api/usersettingswrite", universe.CreateJSONPOSTHeaders(raw))
          .then((response) => response.json())
          .then((result) => {
            if (result == "Success") {
              universe.CloseModal("headerPluginModal");

              universe.SnackbarCommon(
                "snackbar",
                langHandler.UnicornComposite(
                  i18n_returnsSuccessUpdate,
                  i18n_returnValueHeaderPlugin
                ),
                universe.HotReload("linkItemList", "/", homePageInit, "reload")
              );
            } else {
              // error occured
              console.log(result);
              universe.SnackbarError(
                "snackbar",
                i18n_returnValueGenericError,
                false,
                result
              );
            }
          });
      });
  };

  const handlePluginHeader = function (side) {
    universe.ShowModal("headerPluginModal");

    var backBtn = document.getElementById("headerPlugin-goBack");
    backBtn.onclick = function () {
      universe.CloseModal("headerPluginModal");
    };

    var submitBtn = document.getElementById("headerPlugin-submit");

    submitBtn.onclick = function () {
      changeHeaderSettings(
        side,
        document.getElementById("header-plugin-name").value,
        document.getElementById("header-plugin-options").value,
        modal
      );
    };
  };

  headerPluginLeft.onclick = function () {
    handlePluginHeader("left");
  };

  headerPluginRight.onclick = function () {
    handlePluginHeader("right");
  };
}
