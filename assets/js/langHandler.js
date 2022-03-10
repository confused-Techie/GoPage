/**
 * @member {File} LangHandlerJS
 * @desc Namespace of functions for easy access to Language actions.
 */

/*eslint-disable no-redeclare, no-unused-vars*/
/**
 * The namepsace to access all internal functions.
 * @namepspace
 * @memberof LangHandlerJS
 */
var langHandler = {
  /**
   * @desc Implementation of Composite Formatting from C#
   * This is at its core based on the Stack Overflow Implementation found and reworked by Gabriel Nahmias.
   * Which was agiain reworked by myself to work as a standalone method.
   * https://stackoverflow.com/a/18234317/12707685
   * This will accept a composite formatted string for ease of translations.
   * @summary Implementation of Composite Formatting from C#.
   * @param {string} arg0 The String to preform the method on.
   * @param {string} argN All other arguments afterwards can be keys, with as many as needed to fill the string.
   * Not enough or to many causing zero errors.
   * @example
   * langHandler.UnicornComposite("How is this for a {0}, I hope it {1}", "Test", "Works");
   * // Outputs: "How is this for a Test, I hope it Works."
   */
  UnicornComposite: function UnicornComposite() {
    var str = arguments[0];
    // the first argument should be the string to work on; everything after is repalce keys
    if (arguments.length > 1) {
      var t = typeof arguments[1];
      var key;
      var args =
        "string" === t || "number" === t
          ? Array.prototype.slice.call(arguments)
          : arguments[1];
      // since the conditional ternary operator to define args will liekly include the inital string
      // if array we want to remove it if array
      if (Array.isArray(args)) {
        args.shift();
      }

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  },
};
