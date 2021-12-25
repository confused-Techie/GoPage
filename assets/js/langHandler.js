// This will be the namespace to handle returning of strings of language data to
// build the pages and support multiple languages.

var currentLang = "en";

var langHandler = {
  ProvideString: function ProvideString(id, element) {
    // this will take an identifier
    // query the current language from the server
    // then check for that languages existance of that string, if it doesn't exist,
    // will then default to english

    var resourceName = `strings.${currentLang}.json`;

    fetch(`/assets/lang/${resourceName}`)
      .then(response => {
        if (response.ok) {
          return [response.json(), response.status];
        } else {
          // this is triggered by a 404 response or anything but 200
          // intended to catch a case where the language file does not exist.
          console.log(`Language file seemed to fail with: ${response.status}`);
          console.log(`Providing default language strings...`);
          fetch(`/assets/lang/strings.en.json`)
            .then(res => res.json())
            .then(defaultData => {
              if (defaultData[id]) {
                element.textContent = defaultData[id];
              } else {
                console.log(`Default Translation for this item does not exist: ${id}`);
                element.textContent = "Translations coudln't be found!";
              }
            });
          return [response, response.status];
        }
      })
      .then(passThru => {
        // now we can see if the id exists in this lang
        var data = passThru[0];
        var status = passThru[1];
        if (status == 200) {
          if (data[id]) {
            element.textContent = data[id];
          } else {
            console.log(`Translation for this item does not exist: ${id}`);
            // if the translation doesn't exist, default to english translation.
            fetch(`/assets/lang/strings.en.json`)
              .then(res => res.json())
              .then(defaultData => {
                if (defaultData[id]) {
                  element.textContent = defaultData[id];
                } else {
                  console.log(`Default Translation for this item does not exist: ${id}`);
                  element.textContent = "Translations couldn't be found!";
                }
              });
          }
        } else {
          console.log(`Status: ${status} should be handled by initial then...`);
        }
      });
  },
  ProvideStringRaw: function ProvideStringRaw(id) {
    // This will be used for providing strings of generated content, where its not possible to then change the string wtihin the DOM
    return new Promise(function (resolve, reject) {
      var resourceName = `strings.${currentLang}.json`;

      fetch(`/assets/lang/${resourceName}`)
        .then(response => {
          if (response.ok) {
            return [response.json(), response.status];
          } else {
            return [response, response.status];
          }
        })
        .then(passThru => {
          var data = passThru[0];
          var status = passThru[1];
          if (status == 200) {
            if (data[id]) {
              resolve(data[id]);
            } else {
              console.log(`Translation for this item does not exist: ${id}; within: /assets/lang/${resourceName}`);
              // if the translation doesn't exist, default to english translation
              fetch(`/assets/lang/strings.en.json`)
                .then(res => res.json())
                .then(defaultData => {
                  if (defaultData[id]) {
                    resolve(defaultData[id]);
                  } else {
                    console.log(`Default Translation for this item does not exist: ${id}; within: /assets/lang/strings.en.json`);
                    reject("Translations coudln't be found!");
                  }
                });
            }
          } else {
            console.log(`Response for declared language string: ${status}`);
            console.log(`Moving to default strings.`);
            fetch(`/assets/lang/strings.en.json`)
              .then(res => res.json())
              .then(defaultData => {
                if (defaultData[id]) {
                  resolve(defaultData[id]);
                } else {
                  console.log(`Default Translation for this item does not exist: ${id}; within: /assets/lang/strings.en.json`);
                  reject("Translations couldn't be found!");
                }
              });
          }
        });
    });
  },
  DetermineLang: function DetermineLang() {
    return new Promise(function (resolve, reject) {
      // this will try to reduce the amount of calls to the server to only need to do it
      // once per page load
      fetch('/api/serversettings')
        .then(response => response.json())
        .then(data => {
          if (currentLang != data.lang) {
            currentLang = data.lang;
            // to allow screen readers to pronounce inner content correctly, we will also modify the HTML declared language when detecting the language is different
            // than declared by default
            document.documentElement.setAttribute("lang", currentLang);

            console.log(`Set the Current Language global variable to ${currentLang}`);
            resolve('Set Current Langage');
          } else {
            console.log(`Current Language unchanged from ${currentLang}`);
            resolve('Language Unchanged');
          }
        });
    });
  },
  InsertLang: function InsertLang() {
    // this will be in charge of looking up each element to find its translation
    fetch('/assets/lang/strings.json')
      .then(response => response.json())
      .then(strings => {
        for (var i=0; i < strings.length; i++) {
          var curEle = document.getElementById(strings[i]);
          if (curEle != null) {
            langHandler.ProvideString(strings[i], curEle);
          }
        }
      });
  },
  UnicornComposite: function UnicornComposite() {
    // this is my implementation of Composite Formatting from C#
    // This is at its core based on the Stack Overflow Implmentation found and reworked by Gabriel Nahmias
    // Which was again then reworked by myself to work as a standalone method
    // https://stackoverflow.com/a/18234317/12707685
    // ---------------------------------------------
    // This will accept a composite formatted string for ease of translations,
    // First Argument MUST be the string to work on,
    // all other arguments afterwards can be keys, with not enough or to many causing zero errors
    // EX.
    // UnicornComposite("How is this for a {0}, I hope it {1}", "Test", "Works"); - How is this for a Test, I hope it Works.

    var str = arguments[0];
    // the first argument should be the string to work on; everything after is repalce keys
    if (arguments.length > 1) {
      var t = typeof arguments[1];
      var key;
      var args = ("string" === t || "number" === t) ?
        Array.prototype.slice.call(arguments)
        : arguments[1];
      // since the conditional ternary operator to define args will liekly include the inital string
      // if array we want to remove it if array
      if (Array.isArray(args)) {
        var tmp = args.shift();
      }

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  }
}
