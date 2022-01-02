// Below is a list of functions called from elsewhere for eslint. If they are changed this should be updated.

/*global initCategory, onDataListInput */
/*eslint no-redeclare: ["error", { "builtinGlobals": false } ] */
function initCategory() {
  // first we need the list of all categories form the api
  fetch('/api/items')
    .then((response) => response.json())
    .then((data) => {
      var categoryListToInsert;
      var categoryListToCheck = [];
      data.forEach((element) => {
        if (!categoryListToCheck.includes(element.category)) {
          categoryListToInsert += `<option value='${element.category}'>`;
          categoryListToCheck.push(element.category);
        }
        //categoryListToInsert += `<option value='${element.category}'>`;
      });
      document.getElementById('current-category').innerHTML = categoryListToInsert;
    });

    // Handle the installed plugins showing up, via API
    fetch('/plugins/installedPlugins.json')
      .then(response => response.json())
      .then(data => {
        var pluginListToInsert;

        data.forEach((element) => {
          if (element.type == "item") {
            pluginListToInsert += `<option value='${element.name}'>`;
          }
        });
        document.getElementById('available-plugins').innerHTML = pluginListToInsert;
      });

  // Then we want to check all the plugins and if they have a plugin set (as in edit)
  // we want to make the config options available
  if (document.querySelectorAll('[name="leftPlugin"]')[0].value != '') {

    var toChangeViewLeft = document.getElementById('leftPluginLabel');
    toChangeViewLeft.classList.remove('readonly_id');
    var toChangeAutofillLeft = document.getElementById('leftPluginOptions');
    toChangeAutofillLeft.classList.remove('readonly_id');
    toChangeAutofillLeft.removeAttribute('readonly');

  }
  if (document.querySelectorAll('[name="centerPlugin"]')[0].value != '') {

    var toChangeViewCenter = document.getElementById('centerPluginLabel');
    toChangeViewCenter.classList.remove('readonly_id');
    var toChangeAutofillCenter = document.getElementById('centerPluginOptions');
    toChangeAutofillCenter.classList.remove('readonly_id');
    toChangeAutofillCenter.removeAttribute('readonly');

  }
  if (document.querySelectorAll('[name="rightPlugin"]')[0].value != '') {

    var toChangeViewRight = document.getElementById('rightPluginLabel');
    toChangeViewRight.classList.remove('readonly_id');
    var toChangeAutofillRight = document.getElementById('rightPluginOptions');
    toChangeAutofillRight.classList.remove('readonly_id');
    toChangeAutofillRight.removeAttribute('readonly');
  }
}

var goBackBtn = document.getElementById("goBack");

goBackBtn.onclick = function() {
  // while this redirect originally failed on the newpage, it seems that the HTML5 button element by default would submit
  // adding type="button" stopped the default behavior.
  // https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
  //https://www.w3.org/TR/2011/WD-html5-20110525/the-button-element.html#the-button-element
  window.location.href = '/';
}


function onDataListInput(ele) {
  console.log('ondatalistinput called');
  console.log(ele);

  console.log(`Parent Name: ${ele.getAttribute('name')}; Parent Value: ${ele.value}`);
  // ele.getAttribute('name') will provide us with the name of what called this
  // ele.value will tell us the value of the plugin selected
  fetch('/plugins/installedPlugins.json')
    .then(response => response.json())
    .then(data => {
      data.forEach((element) => {
        if (ele.value == element.name) {
          // now we know which element contains the rest of the details for whatever installed plugin was selected

          if (element.config) {
            if (ele.getAttribute('name') == 'leftPlugin') {

              var eleToChangeViewLeft = document.getElementById('leftPluginLabel');
              eleToChangeViewLeft.classList.remove('readonly_id');

              var eleToChangeExplainLeft = document.getElementById('left-plugin-example');
              eleToChangeExplainLeft.innerHTML = element.options.explain;

              var eleToChangeAutofillLeft = document.getElementById('leftPluginOptions');
              eleToChangeAutofillLeft.classList.remove('readonly_id');
              eleToChangeAutofillLeft.removeAttribute('readonly');
              eleToChangeAutofillLeft.value = element.options.autofill;

            } else if (ele.getAttribute('name') == 'centerPlugin') {

              var eleToChangeViewCenter = document.getElementById('centerPluginLabel');
              eleToChangeViewCenter.classList.remove('readonly_id');

              var eleToChangeExplainCenter = document.getElementById('center-plugin-example');
              eleToChangeExplainCenter.innerHTML = element.options.explain;

              var eleToChangeAutofillCenter = document.getElementById('centerPluginOptions');
              eleToChangeAutofillCenter.classList.remove('readonly_id');
              eleToChangeAutofillCenter.removeAttribute('readonly');
              eleToChangeAutofillCenter.value = element.options.autofill;

            } else if (ele.getAttribute('name') == 'rightPlugin') {

              var eleToChangeViewRight = document.getElementById('rightPluginLabel');
              eleToChangeViewRight.classList.remove('readonly_id');

              var eleToChangeExplainRight = document.getElementById('right-plugin-example');
              eleToChangeExplainRight.innerHTML = element.options.explain;

              var eleToChangeAutofillRight = document.getElementById('rightPluginOptions');
              eleToChangeAutofillRight.classList.remove('readonly_id');
              eleToChangeAutofillRight.removeAttribute('readonly');
              eleToChangeAutofillRight.value = element.options.autofill;

            } else {
              console.log(`Unknown Parent calling onDataListInput: ${ele.getAttribute('name')}`);
            }
          } // else there is no configuration available
        }
      });
    });
}
