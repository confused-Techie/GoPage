checkPlugins();

// This will check and load non-item typed plugins, to keep theming active
function checkPlugins() {
  fetch('/plugins/installedPlugins.json')
    .then(response => response.json())
    .then(data => {
      data.forEach((element, index) => {
        if (element.installed) {
          fetch(`/plugins${element.mainDir}package.json`)
            .then(packRes => packRes.json())
            .then(packData => {
              if (packData.type == "theme") {
                var currentTheme = document.getElementById("theme");
                var pluginTheme = `/plugins${packData.mainDir}${packData.main}`;
                currentTheme.setAttribute('href', pluginTheme);
              }
            });
          }
      });
    });
}
