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
      .then(response => response.json())
      .then(data => {
        // now we can see if the id exists in this lang
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
      });
  },
  ProvideStringRaw: function ProvideStringRaw(id) {
    // This will be used for providing strings of generated content, where its not possible to then change the string wtihin the DOM
    return new Promise(function (resolve, reject) {
      var resourceName = `strings.${currentLang}.json`;

      fetch(`/assets/lang/${resourceName}`)
        .then(response => response.json())
        .then(data => {
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
  }
}
