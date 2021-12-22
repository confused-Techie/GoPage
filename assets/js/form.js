function initCategory() {
  // first we need the list of all categories form the api
  fetch('/api/items')
    .then(response => response.json())
    .then(data => {
      var categoryListToInsert;
      var categoryListToCheck = [];
      data.forEach((element, index) => {
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

        data.forEach((element, index) => {
          if (element.type == "item") {
            pluginListToInsert += `<option value='${element.name}'>`;
          }
        });
        document.getElementById('available-plugins').innerHTML = pluginListToInsert;
      });

  // Then we want to check all the plugins and if they have a plugin set (as in edit)
  // we want to make the config options available
  if (document.querySelectorAll('[name="leftPlugin"]')[0].value != '') {

    var toChangeView = document.getElementById('leftPluginLabel');
    toChangeView.classList.remove('readonly_id');
    var toChangeAutofill = document.getElementById('leftPluginOptions');
    toChangeAutofill.classList.remove('readonly_id');
    toChangeAutofill.removeAttribute('readonly');

  }
  if (document.querySelectorAll('[name="centerPlugin"]')[0].value != '') {

    var toChangeView = document.getElementById('centerPluginLabel');
    toChangeView.classList.remove('readonly_id');
    var toChangeAutofill = document.getElementById('centerPluginOptions');
    toChangeAutofill.classList.remove('readonly_id');
    toChangeAutofill.removeAttribute('readonly');

  }
  if (document.querySelectorAll('[name="rightPlugin"]')[0].value != '') {

    var toChangeView = document.getElementById('rightPluginLabel');
    toChangeView.classList.remove('readonly_id');
    var toChangeAutofill = document.getElementById('rightPluginOptions');
    toChangeAutofill.classList.remove('readonly_id');
    toChangeAutofill.removeAttribute('readonly');
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
      data.forEach((element, index) => {
        if (ele.value == element.name) {
          // now we know which element contains the rest of the details for whatever installed plugin was selected

          if (element.config) {
            if (ele.getAttribute('name') == 'leftPlugin') {

              var eleToChangeView = document.getElementById('leftPluginLabel');
              eleToChangeView.classList.remove('readonly_id');

              var eleToChangeExplain = document.getElementById('left-plugin-example');
              eleToChangeExplain.innerHTML = element.options.explain;

              var eleToChangeAutofill = document.getElementById('leftPluginOptions');
              eleToChangeAutofill.classList.remove('readonly_id');
              eleToChangeAutofill.removeAttribute('readonly');
              eleToChangeAutofill.value = element.options.autofill;

            } else if (ele.getAttribute('name') == 'centerPlugin') {

              var eleToChangeView = document.getElementById('centerPluginLabel');
              eleToChangeView.classList.remove('readonly_id');

              var eleToChangeExplain = document.getElementById('center-plugin-example');
              eleToChangeExplain.innerHTML = element.options.explain;

              var eleToChangeAutofill = document.getElementById('centerPluginOptions');
              eleToChangeAutofill.classList.remove('readonly_id');
              eleToChangeAutofill.removeAttribute('readonly');
              eleToChangeAutofill.value = element.options.autofill;

            } else if (ele.getAttribute('name') == 'rightPlugin') {

              var eleToChangeView = document.getElementById('rightPluginLabel');
              eleToChangeView.classList.remove('readonly_id');

              var eleToChangeExplain = document.getElementById('right-plugin-example');
              eleToChangeExplain.innerHTML = element.options.explain;

              var eleToChangeAutofill = document.getElementById('rightPluginOptions');
              eleToChangeAutofill.classList.remove('readonly_id');
              eleToChangeAutofill.removeAttribute('readonly');
              eleToChangeAutofill.value = element.options.autofill;

            } else {
              console.log(`Unknown Parent calling onDataListInput: ${ele.getAttribute('name')}`);
            }
          } // else there is no configuration available
        }
      });
    });
}
