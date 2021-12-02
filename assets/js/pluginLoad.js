//var script = document.createElement("script"); //create a script DOM node
//script.src = "/plugins/statusCheck/main.js";
//document.head.appendChild(script); // add it to the end of the head section

// TODO: load these depending on whats been installed

checkPlugins();

function checkPlugins() {
  fetch('/plugins/installedPlugins.json')
    .then(response => response.json())
    .then(data => {
      data.forEach((element, index) => {
        // now with each element, we can try to read its package.json file,
        // relying on the idea that the folder has the same name as the plugin name
        fetch(`/plugins/${element.name}/package.json`)
          .then(packRes => packRes.json())
          .then(packData => {
            var script = document.createElement("script");
            script.src = `/plugins${packData.mainDir}${packData.main}`;
            document.body.appendChild(script);
          });
        //var script = document.createElement("script");
        //script.src = `/plugins${element.loadScript}main.js`;
        //document.body.appendChild(script);
      })
    });
}

function returnPluginItems(pluginName) {
  return document.getElementsByClassName(pluginName);
}
