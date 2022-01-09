// This will be the first venture into namespaces

// Since a global variable is the pluginAPI that is defined here, we turn off checking of redeclared variables to avoid errors here
/*eslint-disable-next-line no-redeclare, no-unused-vars*/
var pluginAPI = {
  ReturnItems: function ReturnItems(pluginName) {
    return document.getElementsByClassName(pluginName);
  },

  ReturnConfig: function ReturnConfig() {

  },

  SetConfig: function SetConfig() {

  },
  
  ParseConfig: function ParseConfig(rawConfig) {
    // Will parse the generic or otherwise Rev1 config or option data for plugins
    // option=value;

    // First we will break up the config into its different key value pairs
    var keyValue = rawConfig.split(';');
    // Then to add these keys with their declaration to the object
    var obj = {};
    for (let i = 0; i < keyValue.length; i++) {
      var keyOrValue = keyValue[i].split("=");
      if (keyOrValue[0] != "") {
        obj[keyOrValue[0]] = keyOrValue[1];
      }
    }
    return obj;
  },

};
