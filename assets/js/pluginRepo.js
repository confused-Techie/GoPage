
// Here we can respond to the install, and uninstall requests of plugins

function installPlugin(pluginUrl, pluginName) {
  console.log(`INSTALL CALLED: ${pluginName}`)
  //fetch(`/plugins/install?source=${pluginUrl}`)
  //  .then(res => {
  //    console.log(`WHAT? ${res}`);
  //    console.log(res.json());
  //  })
  //  .catch(err => {
  //    console.log(`WHATS ERR: ${err}`);
  //    console.log(err);
  //  })

  fetch(`/plugins/install?source=${pluginUrl}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      alert(data);
    })
    .catch(err => {
      console.log(err);
      alert(err);
    });
}

function uninstallPlugin(pluginName) {
  fetch(`/plugins/uninstall?pluginName=${pluginName}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      alert(data);
    })
    .catch(err => {
      console.log(err);
      alert(err);
    });
}

function updatePlugin() {
  fetch(`/plugins/update`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      alert(data);
    })
    .catch(err => {
      console.log(err);
      alert(err);
    });
}
