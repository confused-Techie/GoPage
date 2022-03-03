window.onload = function () {
  // This is being moved from HTML to JS to reduce global pollution, and other concerns, as well as remove ESLinter complaints

  homePageInit();

  firstTimeSetup();

  // Then functions to fill out data of the forms
  //addFormCategory();
  initInstalledPluginListToForm();

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
  var lastAddPluginItem =
    document.getElementsByClassName("add-plugin-link")[
      document.getElementsByClassName("add-plugin-link").length - 1
    ];
  // the last plugin should be the unexpanded plugin, until we change its display mode, and subsequently should have no information entered.

  var clonedParent = lastAddPluginItem.parentElement.cloneNode(true);
  lastAddPluginItem.parentElement.insertAdjacentElement(
    "afterend",
    clonedParent
  );
  // the lastAddPluginItem is the text adjacent to the plugin form.
  // getting the parent allows us to have the full form-text div, which is what we want to duplicate and insert.

  // now to chagne the display mode of the descendent div
  var addInfoDescendent =
    lastAddPluginItem.parentElement.getElementsByClassName(
      "additional_info"
    )[0];
  addInfoDescendent.style.display = "block";
}

function getLinkItemForm() {
  // parseLinkItemForm will either return an object of JSON, or a string, containing an error message that is safe to display to the user.

  var returnJSONObj = {
    id: 0,
    friendlyName: "",
    link: "",
    category: "",
    colour: "",
    style: "",
    plugins: [],
  };

  var fullFormDOM = document.getElementById("link-item-form");
  // since getElementById returns an element object, we need to ensure we only use methods available to access values.
  // but to make life slightly easier, for non-plugin data, we can use the FomrData Object Constructor
  var fullFormDATA = new FormData(document.getElementById("link-item-form"));
  var staticID$ = fullFormDATA.getAll("staticID");
  var linkItemName$ = fullFormDATA.getAll("friendlyName");
  var linkItemLink$ = fullFormDATA.getAll("link");
  var linkItemCategory$ = fullFormDATA.getAll("category");
  var linkItemColour$ = fullFormDATA.getAll("colour");
  var linkItemStyle$ = fullFormDATA.getAll("style");

  returnJSONObj.id = staticID$[0];
  returnJSONObj.friendlyName = linkItemName$[0];
  returnJSONObj.link = linkItemLink$[0];
  returnJSONObj.category = linkItemCategory$[0];
  returnJSONObj.colour = linkItemColour$[0];
  returnJSONObj.style = linkItemStyle$[0];

  // with the required elements, we can do a validation check now
  // first will be valid form data gathered check
  if (
    linkItemName$.length > 1 ||
    linkItemLink$.length > 1 ||
    linkItemCategory$.length > 1
  ) {
    // Why so many values
    return i18n_returnValueGenericError;
  }
  // then check validity of entered values
  // TODO fix the returns here
  if (!stringValidityNotEmpty(returnJSONObj.friendlyName)) {
    return i18n_validateName;
  } else if (!stringValidityNotEmpty(returnJSONObj.link)) {
    return i18n_validateLink;
  } else if (!stringValidityNotEmpty(returnJSONObj.category)) {
    return i18n_validateCategory;
  }

  // after checking the required data, we can use an element method querySelectorAll list to get an array of plugin form NodeList's
  var pluginNodeList = fullFormDOM.querySelectorAll(
    `[class="additional_info"]`
  );

  for (var i = 0; i < pluginNodeList.length; i++) {
    // with our []NodeLists we will first take the child section of pluginAddContainer
    var htmlCollectionPlugin = pluginNodeList[i].children[0];

    var pluginName$ =
      htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`);
    var pluginLocation$ = htmlCollectionPlugin.querySelectorAll(
      `[name="pluginLocation"]`
    );
    var pluginOptions$ = htmlCollectionPlugin.querySelectorAll(
      `[name="pluginOptions"]`
    );

    // check that only one item of this name is available
    if (
      pluginName$.length > 1 ||
      pluginLocation$.length > 1 ||
      pluginOptions$.length > 1
    ) {
      console.log("To many values retreived from DOM");
      return i18n_returnValueGenericError;
    }
    // check that it has a value, otherwise we know its empty and we can skip applying this plugin at all
    if (!stringValidityNotEmpty(pluginName$[0].value)) {
      continue;
    }
    // although if the name is valid, but hhas no location that should through an error
    if (!stringValidityNotEmpty(pluginLocation$[0].value)) {
      return i18n_validatePluginLocation;
    }

    // but if all is well we can create a temporary json object to push into the plugins array of the return json object
    var tmpPluginJSON = {
      name: pluginName$[0].value,
      location: pluginLocation$[0].value,
      options: !stringValidityNotEmpty(pluginOptions$[0].value)
        ? ""
        : pluginOptions$[0].value,
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
    var fullFormDOM = document.getElementById("link-item-form");

    fullFormDOM.querySelector(`[name="staticID"]`).value = jsonObj.id;
    fullFormDOM.querySelector(`[name="friendlyName"]`).value =
      jsonObj.friendlyName;
    fullFormDOM.querySelector(`[name="link"]`).value = jsonObj.link;
    fullFormDOM.querySelector(`[name="category"]`).value = jsonObj.category;
    fullFormDOM.querySelector(`[name="colour"]`).value = jsonObj.colour;
    fullFormDOM.querySelector(`[name="style"]`).value = jsonObj.style;

    for (var i = 0; i < jsonObj.plugins.length; i++) {
      // firstly create the plugin item
      addPluginToFormV2();
      var pluginNodeList = fullFormDOM.querySelectorAll(
        `[class="additional_info"]`
      );
      var htmlCollectionPlugin = pluginNodeList[i].children[0];

      htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`)[0].value =
        jsonObj.plugins[i].name;
      htmlCollectionPlugin.querySelectorAll(
        `[name="pluginLocation"]`
      )[0].value = jsonObj.plugins[i].location;
      htmlCollectionPlugin.querySelectorAll(`[name="pluginOptions"]`)[0].value =
        jsonObj.plugins[i].options;
    }
    return true;
    // return true at the end just in case to indicate valid data.
  } catch (err) {
    return err;
  }
}

function clearLinkItemForm() {
  try {
    var fullFormDOM = document.getElementById("link-item-form");

    fullFormDOM.querySelector(`[name="staticID"]`).value = "";
    fullFormDOM.querySelector(`[name="friendlyName"]`).value = "";
    fullFormDOM.querySelector(`[name="link"]`).value = "";
    fullFormDOM.querySelector(`[name="category"]`).value = "";
    fullFormDOM.querySelector(`[name="colour"]`).value = "";
    fullFormDOM.querySelector(`[name="style"]`).value = "";

    while (document.getElementsByClassName("add-plugin-link").length > 1) {
      try {
        document
          .getElementsByClassName("add-plugin-link")
          [
            document.getElementsByClassName("add-plugin-link").length - 1
          ].parentNode.remove();
      } catch (err) {
        console.log(err);
      }
    }
    // ^^ The above while loop, will run until only 1 element remains for the add-plugin-link dom element
    // each loop gets the HTMLCollection of the element, grabbing only the last one, then selects its parentNode (form-text)
    // and removes it. Thiis should leave only the last dom element to add plugins as intended

    // Now we just need to remove any data still present in that last element, and change its display

    var htmlCollectionPlugin = fullFormDOM.querySelectorAll(
      `[class="additional_info"]`
    )[0].children[0];
    htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`)[0].value = "";
    htmlCollectionPlugin.querySelectorAll(`[name="pluginLocation"]`)[0].value =
      "";
    htmlCollectionPlugin.querySelectorAll(`[name="pluginOptions"]`)[0].value =
      "";
    htmlCollectionPlugin.querySelectorAll(`[name="pluginExample"]`)[0].value =
      "";
    htmlCollectionPlugin.parentElement.style.display = "none";
  } catch (err) {
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
  } catch (err) {
    return false;
  }
}

/*eslint-disable-next-line no-unused-vars*/
function disablePluginLocation(element) {
  document
    .getElementById("plugin-location-list")
    .querySelector(`[value=${element.value}]`)
    .setAttribute("disabled", "");
}

function addPluginOptions(element) {
  var pluginContainerParent = element.parentElement.parentElement.parentElement;
  var pluginChosen = element.value;
  var pluginOptions = pluginContainerParent.querySelector(
    `[name="pluginOptions"]`
  );
  var pluginExample = pluginContainerParent.querySelector(
    `[name="pluginExample"]`
  );

  // with the elements we want to modify, lets get the data needed
  fetch("/plugins/installedPlugins.json")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        if (pluginChosen == element.name) {
          pluginOptions.value = element.options.autofill;
          pluginExample.value = element.options.explain;
        }
      });
    });
}

function initInstalledPluginListToForm() {
  fetch("/plugins/installedPlugins.json")
    .then((response) => response.json())
    .then((data) => {
      var pluginListToInsertItem, pluginListToInsertHeader;

      data.forEach((element) => {
        if (element.type == "item") {
          pluginListToInsertItem += `<option value='${element.name}'>`;
        } else if (element.type == "header") {
          pluginListToInsertHeader += `<option value='${element.name}'>`;
        }
      });
      document.getElementById("plugin-installed-list").innerHTML =
        pluginListToInsertItem;
      document.getElementById("header-plugin-list").innerHTML =
        pluginListToInsertHeader;
    });
}

function newItemModal() {
  // TODO call setLinkItemForm with an empty JSON obj, to remove any previous values
  clearLinkItemForm();
  universe.ShowModal("link-item-modal");

  var modalSubmit = document.getElementById("itemModalSubmit");
  var modalClose = document.getElementById("itemModalGoBack");

  modalClose.onclick = function () {
    universe.CloseModal("link-item-modal");
  };

  modalSubmit.onclick = function () {
    // first we will display the loading icon
    universe.Loader(true);

    var formData = getLinkItemForm();

    if (typeof formData === "string") {
      universe.Loader(false);

      universe.SnackbarError(
        "snackbar",
        formData,
        false,
        i18n_returnValueGenericError
      );
    } else if (typeof formData == "object") {
      saveLinkItemModal("/api/new/", formData, i18n_returnsSuccessAdd);
    } else {
      // if it fails, we will remove the loader to allow user interaction
      universe.Loader(false);

      universe.SnackbarError(
        "snackbar",
        i18n_returnValueGenericError,
        false,
        "Something unexpected happened reading your data."
      );
    }
  };
}

function editItemModal(
  oldID,
  oldFriendlyName,
  oldLink,
  oldCategory,
  oldColour,
  oldStyle,
  oldPlugins
) {
  clearLinkItemForm();
  // first lets make our JSON obj to pass
  var returnJSONObj = {
    id: parseInt(oldID),
    friendlyName: oldFriendlyName,
    link: oldLink,
    category: oldCategory,
    colour: oldColour,
    style: oldStyle,
    plugins: [],
  };

  for (var i = 0; i < oldPlugins.length; i++) {
    var tmpPluginJSON = {
      name: oldPlugins[i].name,
      location: oldPlugins[i].location,
      options: oldPlugins[i].options,
    };
    returnJSONObj.plugins.push(tmpPluginJSON);
  }

  setLinkItemForm(returnJSONObj);
  // once the data is injected into the page, we can display the modal
  universe.ShowModal("link-item-modal");

  var modalSubmit = document.getElementById("itemModalSubmit");
  var modalClose = document.getElementById("itemModalGoBack");

  modalClose.onclick = function () {
    universe.CloseModal("link-item-modal");
  };

  modalSubmit.onclick = function () {
    universe.Loader(true);

    var formData = getLinkItemForm();

    if (typeof formData === "string") {
      universe.SnackbarError(
        "snackbar",
        formData,
        false,
        i18n_returnValueGenericError
      );
    } else if (typeof formData === "object") {
      // before submitting this data we need to ensure the ID is an int, otherwise it'll fail.
      formData.id = parseInt(formData.id);
      saveLinkItemModal("/api/edit/", formData, i18n_returnsSuccessUpdate);
    } else {
      universe.Loader(false);

      universe.SnackbarError(
        "snackbar",
        i18n_returnValueGenericError,
        false,
        "Something unexpected happned reading your data."
      );
    }
  };
}

function saveLinkItemModal(endpoint, data, string) {
  var rawJSON = JSON.stringify(data);

  var requestOptions = universe.CreateJSONPOSTHeaders(rawJSON);

  fetch(endpoint, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result == "Success") {
        // make sure to disable any loaders that may be displayed
        universe.Loader(false);

        universe.CloseModal("link-item-modal");

        universe.SnackbarCommon(
          "snackbar",
          langHandler.UnicornComposite(string, i18n_returnValueLinkItem),
          universe.HotReload("linkItemList", "/", homePageInit, "reload")
        );
      } else {
        universe.Loader(false);

        universe.SnackbarError(
          "snackbar",
          i18n_returnValueGenericError,
          false,
          result
        );
      }
    });
}

function firstTimeSetup(dev) {
  if (typeof dev !== "boolean") {
    dev = false;
  }
  // this will check for any saved items, and if there are none, will display a helpful modal of options to get started.
  fetch("/api/items")
    .then((res) => res.json())
    .then((response) => {
      if (response.length === 0 || dev) {
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
