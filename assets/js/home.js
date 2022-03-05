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

  // now we want to also listen on the search bar
  const searchBar = document.getElementById("searchBar");

  searchBar.addEventListener("input", searchBarUpdate);
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

function searchBarUpdate(e) {
  console.log(e.target.value);
  fetch(`/api/search?source='home'&term='${e.target.value}'`)
    .then((res) => res.json())
    .then((result) => {
      try {
        var searchResults = document.getElementById("searchResult");
        // first we want to remove all previous search results
        while (searchResults.firstChild) {
          searchResults.removeChild(searchResults.lastChild);
        }

        for (let i = 0; i < result.Results.length; i++) {
          var tmpHTML = `<p><a href="${result.Results[i].Link}">${result.Results[i].FriendlyName} #Category: ${result.Results[i].Category}</a></p>`;
          searchResults.insertAdjacentHTML("beforeend", tmpHTML);
        }
        //searchBar.insertAdjacentHTML("afterend", )
      } catch (err) {
        console.log(`Error Occured crafting Search Results: ${err}`);
      }
    });
}

class LinkItemDOM {

  constructor() {
    // for non-plugin data we can use the FormData Object Constructor
    this.FormData = new FormData(document.getElementById("link-item-form"));
    // An element object is needed to properly retreive some values.
    this.FormDom = document.getElementById("link-item-form");
  }

  get jsonObjTemplate() {
    var _jsonObjTemplate = {
      id: 0,
      friendlyName: "",
      link: "",
      category: "",
      colour: "",
      style: "",
      plugins: [],
    };

    return _jsonObjTemplate;
  }

  get jsonObjFilled() {
    var tmpObj = this.jsonObjTemplate;

    tmpObj.id = this.staticIDField;
    tmpObj.friendlyName = this.friendlyNameField;
    tmpObj.link = this.linkField;
    tmpObj.category = this.categoryField;
    tmpObj.colour = this.colourField;
    tmpObj.style = this.styleField;
    tmpObj.plugins = this.pluginField;

    return tmpObj;
  }

  set jsonObjFill(input) {
    this.staticIDField = input.id;
    this.friendlyNameField = input.friendlyName;
    this.linkField = input.link;
    this.categoryField = input.category;
    this.colourField = input.colour;
    this.styleField = input.style;
    this.pluginField = input.plugins;
  }

  jsonObjClear() {
    try {
      this.staticIDField = "";
      this.friendlyNameField = "";
      this.linkField = "";
      this.categoryField = "";
      this.colourField = "";
      this.styleField = "";
      this.emptyPlugins();

    } catch(err) {
      throw err;
    }
  }

  get staticIDField() {
    return this.FormData.getAll("staticID")[0];
  }

  set staticIDField(input) {
    this.FormDom.querySelector(`[name="staticID"]`).value = input;
  }

  get friendlyNameField() {
    return this.FormData.getAll("friendlyName")[0];
  }

  set friendlyNameField(input) {
    this.FormDom.querySelector(`[name="friendlyName"]`).value = input;
  }

  get linkField() {
    return this.FormData.getAll("link")[0];
  }

  set linkField(input) {
    this.FormDom.querySelector(`[name="link"]`).value = input;
  }

  get categoryField() {
    return this.FormData.getAll("category")[0];
  }

  set categoryField(input) {
    this.FormDom.querySelector(`[name="category"]`).value = input;
  }

  get colourField() {
    return this.FormData.getAll("colour")[0];
  }

  set colourField(input) {
    this.FormDom.querySelector(`[name="colour"]`).value = input;
  }

  get styleField() {
    return this.FormData.getAll("style")[0];
  }

  set styleField(input) {
    this.FormDom.querySelector(`[name="style"]`).value = input;
  }

  get pluginField() {
    // Using the Element Method querySelectorAll list to get an array of Plugin Form NodeLists
    var pluginNodeList = this.FormDom.querySelectorAll(`[class="additional_info"]`);
    var psuedoPluginArray = [];

    for (var i = 0; i < pluginNodeList.length; i++) {
      // with our []NodeLists we will first take the child section of pluginAddContainer
      var htmlCollectionPlugin = pluginNodeList[i].children[0];

      var tmpObjPlugin = {
        name: "",
        location: "",
        options: "",
      };
      // while this was originally a public field, there was an issue of what seemed to be desctructuring of the object, once added to the array.
      // where the length of the array was correct, but all values would be the last item added. Meaning the public field
      // seems to create a reference when instiated as a variable, rather than a new declaration.

      tmpObjPlugin.name = htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`)[0].value;
      tmpObjPlugin.location = htmlCollectionPlugin.querySelectorAll(`[name="pluginLocation"]`)[0].value;
      tmpObjPlugin.options = htmlCollectionPlugin.querySelectorAll(`[name="pluginOptions"]`)[0].value;

      // now before we push we want to do simple validation on this data.
      if (!this.notEmpty(tmpObjPlugin.name)) {
        // if no name is assigned, we can skip adding the plugin completely
        continue;
      }

      psuedoPluginArray.push(tmpObjPlugin);
    }

    return psuedoPluginArray;
  }

  set pluginField(input) {
    // pluginField expects an input of only plugin array
    for (var i = 0; i < input.length; i++) {
      //firstly create the plugin item
      addPluginToFormV2();
      var pluginNodeList = this.FormDom.querySelectorAll(`[class="additional_info"]`);
      var htmlCollectionPlugin = pluginNodeList[i].children[0];
      htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`)[0].value = input[i].name;
      htmlCollectionPlugin.querySelectorAll(`[name="pluginLocation"]`)[0].value = input[i].location;
      htmlCollectionPlugin.querySelectorAll(`[name="pluginOptions"]`)[0].value = input[i].options;
    }
  }

  emptyPlugins() {
    while (document.getElementsByClassName("add-plugin-link").length > 1) {
      try {
        document.getElementsByClassName("add-plugin-link")[document.getElementsByClassName("add-plugin-link").length -1].parentNode.remove();
      } catch(err) {
        throw err;
      }
    }
    // ^^ The above while loop, will run until only 1 elemenet remains for the add-plugin-link dom element
    // each loop gets the HTMLCollection of the element, grabbing only the last one, then selects its parentNode (form-text)
    // and removes it. This should onyl leave the last dom element to add plugins as intended

    // Now we just need to remove any data still present in that last element, and change its display
    var htmlCollectionPlugin = this.FormDom.querySelectorAll(`[class="additional_info"]`)[0].children[0];
    htmlCollectionPlugin.querySelectorAll(`[name="pluginName"]`)[0].value = "";
    htmlCollectionPlugin.querySelectorAll(`[name="pluginLocation"]`)[0].value = "";
    htmlCollectionPlugin.querySelectorAll(`[name="pluginOptions"]`)[0].value = "";
    htmlCollectionPlugin.querySelectorAll(`[name="pluginExample"]`)[0].value = "";
    htmlCollectionPlugin.parentElement.style.display = "none";
  }

  notEmpty(input) {
    if (typeof input === "string") {
      if (input === "" || input === " ") {
        return false;
      } else {
        return true;
      }
    } else {
      // TODO: add support for other types, but this will fail open for now
      return true;
    }
  }

  extraValues(input) {
    try {
      if (input.length > 1) {
        return true;
      } else {
        return false;
      }
    } catch(err) {
      // if the length method fails, we can safely assume its not valid, and there are no extra values.
      return false;
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
  // --------
  // Cyclomatic Complexity Pre-Class: 14
  // Cyclomatic Complexity Post-Class: 6
  // -------

  // parseLinkItemForm will either return an object of JSON, or a string, containing an error message that is safe to display to the user.

  let linkObj = new LinkItemDOM();
  // We can ask for the filled template from the class
  var linkObjData = linkObj.jsonObjFilled;

  // now lets check the validity of the data gathered and react accordingly
  if (!stringValidityNotEmpty(linkObjData.friendlyName)) {
    return i18n_validateName;
  } else if (!stringValidityNotEmpty(linkObjData.link)) {
    return i18n_validateLink;
  } else if (!stringValidityNotEmpty(linkObjData.category)) {
    return i18n_validateCategory;
  }

  // then to check the plugin data validity
  for (var i = 0; i < linkObjData.plugins.length; i++) {
    if (!stringValidityNotEmpty(linkObjData.plugins[i].location)) {
      return i18n_validatePluginLocation;
    }
  }

  return linkObjData;
}

function clearLinkItemForm() {
  // --------
  // Cyclomatic Complexity Pre-Class: 2
  // Cyclomatic Complexity Post-Class: 1
  // -------

  let linkItemObj = new LinkItemDOM();
  linkItemObj.jsonObjClear();
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
  // with the class for the Link Item DOM, we can work with that directly here, rather than using a useless interface function
  let linkItemObj = new LinkItemDOM();
  var jsonTemplate = linkItemObj.jsonObjTemplate;

  jsonTemplate.id = parseInt(oldID);
  jsonTemplate.friendlyName = oldFriendlyName;
  jsonTemplate.link = oldLink;
  jsonTemplate.category = oldCategory;
  jsonTemplate.colour = oldColour;
  jsonTemplate.style = oldStyle;


  for (var i = 0; i < oldPlugins.length; i++) {
    var tmpPluginJSON = {
      name: oldPlugins[i].name,
      location: oldPlugins[i].location,
      options: oldPlugins[i].options,
    };
    jsonTemplate.plugins.push(tmpPluginJSON);
  }

  linkItemObj.jsonObjFill = jsonTemplate;

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
