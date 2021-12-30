function checkPlugins() {
  fetch("/plugins/installedPlugins.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        // now with each element, we can try to read its package.json file,
        // relying on the idea that the folder has the same name as the plugin name
        if (element.installed) {
          fetch(`/plugins${element.mainDir}package.json`)
            .then((packRes) => packRes.json())
            .then((packData) => {
              if (packData.type == "item") {
                var script = document.createElement("script");
                script.src = `/plugins${packData.mainDir}${packData.main}`;
                // Importing the JS as a module here, ensures that any functions or global variables are not in the global scope
                script.type = "module";
                document.body.appendChild(script);
              } else if (packData.type == "theme") {
                var currentTheme = document.getElementById("theme");
                var pluginTheme = `/plugins${packData.mainDir}${packData.main}`;
                currentTheme.setAttribute("href", pluginTheme);
              }
            });
          }
      });
    });
}

checkPlugins();
