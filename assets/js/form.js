function initCategory() {
  // first we need the list of all categories form the api
  fetch('/api/items')
    .then(response => response.json())
    .then(data => {
      var categoryListToInsert;
      data.forEach((element, index) => {
        categoryListToInsert += `<option value='${element.category}'>`;
      });
      document.getElementById('current-category').innerHTML = categoryListToInsert;
    });


    // Handle the installed plugins showing up
    //var plugins = JSON.parse(installedPlugins);
    //var pluginListToInsert;
    //plugins.forEach((element, index) => {
    //  pluginListToInsert += `<option value='${element.name}'>`;
    //});
    //document.getElementById('available-plugins').innerHTML = pluginListToInsert;


    // Handle the installed plugins showing up, via API
    fetch('/plugins/installedPlugins.json')
      .then(response => response.json())
      .then(data => {
        var pluginListToInsert;
        data.forEach((element, index) => {
          pluginListToInsert += `<option value='${element.name}'>`;
        });
        document.getElementById('available-plugins').innerHTML = pluginListToInsert;
      });
}

var goBackBtn = document.getElementById("goBack");

goBackBtn.onclick = function() {
  // while this redirect originally failed on the newpage, it seems that the HTML5 button element by default would submit
  // adding type="button" stopped the default behavior.
  // https://stackoverflow.com/questions/932653/how-to-prevent-buttons-from-submitting-forms
  //https://www.w3.org/TR/2011/WD-html5-20110525/the-button-element.html#the-button-element
  window.location.href = '/';
}
