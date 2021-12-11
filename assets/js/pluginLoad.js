
checkPlugins();

function checkPlugins() {
  fetch('/plugins/installedPlugins.json')
    .then(response => response.json())
    .then(data => {
      data.forEach((element, index) => {
        // now with each element, we can try to read its package.json file,
        // relying on the idea that the folder has the same name as the plugin name
        fetch(`/plugins${element.mainDir}package.json`)
          .then(packRes => packRes.json())
          .then(packData => {
            var script = document.createElement("script");
            script.src = `/plugins${packData.mainDir}${packData.main}`;
            // Importing the JS as a module here, ensures that any functions or global variables are not in the global scope
            script.type = "module";
            document.body.appendChild(script);
          });
      });
    });
}
