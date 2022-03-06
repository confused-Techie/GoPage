/**
* @member {File} PluginHandlerJS
* @desc The JavaScript file to assist installed Plugins
*/

/**
* The namespace to access all PluginHandler internal functions
* @memberof PluginHandlerJS
* @namespace
*/
var pluginAPI = { /*eslint-disable-lin no-redeclare, no-unused-vars*/
  /**
  * @desc Returns a live HTMLCollection that use the specified plugin.
  * @param {string} pluginName is the name of the Plugin to search for.
  * @returns {Array.HTMLCollection} Live array of the DOM Element using the plugin.
  */
  ReturnItems: function ReturnItems(pluginName) {
    return document.getElementsByClassName(pluginName);
  },
  /**
  * @desc Parses saved configuration data for plugins.
  * @param {string} rawConfig takes the raw string confiuration data.
  * @returns {Object} A Parsed JSON Object of the configuration data.
  */
  ParseConfig: function ParseConfig(rawConfig) {
    // Will parse the generic or otherwise Rev1 config or option data for plugins
    // option=value;

    // First we will break up the config into its different key value pairs
    var keyValue = rawConfig.split(";");
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
