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
              // Adding check for page this is loaded on to reduce duplication of a seperate nonHomeLoad for plugins
              if (packData.type == "item" && document.title == "GoPage - Home") {
                var script = document.createElement("script");
                script.src = `/plugins${packData.mainDir}${packData.main}`;
                // Importing the JS as a module here, ensures that any functions or global variables are not in the global scope
                script.type = "module";
                document.body.appendChild(script);
              } else if (packData.type == "theme") {
                var currentTheme = document.getElementById("theme");
                var pluginTheme = `/plugins${packData.mainDir}${packData.main}`;
                currentTheme.setAttribute("href", pluginTheme);
              } else if (packData.type == "header") {
                // if this is a header type, find out where, if at all its assigned, and attach its values.
                fetch("/api/usersettings")
                  .then((res) => res.json())
                  .then((headerData) => {
                    if (headerData.headerPlugins.right.name == packData.name) {
                      headerPluginAssignment("headerPluginRight", packData.name, headerData.headerPlugins.right.options);
                    } else if (headerData.headerPlugins.left.name == packData.name) {
                      headerPluginAssignment("headerPluginLeft", packData.name, headerData.headerPlugins.left.options);
                    }   // else the plugin is installed but unassigned and should not be called.
                  });
              }
            });
          }
      });
    });
}

checkPlugins();

function headerPluginAssignment(elementID, pluginName, pluginOptions) {
  document.getElementById(elementID).setAttribute("data-pluginName", pluginName);
  document.getElementById(elementID).className += ` ${pluginName}`;
  if (pluginOptions) {
    document.getElementById(elementID).setAttribute("data-pluginOptions", pluginOptions);
  }
}
