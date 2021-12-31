
function onPageLoad() {
  // This will be called when the page first loads and we can begin our check.
  // The divs should be filled in with a loading bar initially

  fetch("/api/items")
    .then((response) => response.json())
    .then((data) => {
      // With all the saved Items we can create two lists. One containing all
      // hostsnames, and another of exact links.

      var matchList = [];
      // matchList = [ { type: exact|hostname, matched: url, friendly: [ array of friendly items matched.] } ]
      data.forEach((element) => {

        data.forEach((elementCheck) => {
          // Since we know each data item will have an id associated, we can ensure it doesn't match against itself
          // be checking the id
          if (element.id != elementCheck.id) {
            if (element.link == elementCheck.link) {
              //console.log(`${element.link} Matches Exactly for ${elementCheck.link}`);
              var tmpObjExact = { type: "exact", matched: element.link, friendly: [ element.friendlyName, elementCheck.friendlyName ] };
              matchList.push(tmpObjExact);
            }
            if (getHostname(element.link) == getHostname(elementCheck.link)) {
              //console.log(`${element.link} Matches hostname of ${elementCheck.link}`);
              var tmpObjHost = { type: "hostname", matched: element.link, friendly: [ element.friendlyName, elementCheck.friendlyName ] };
              matchList.push(tmpObjHost);
            }
          } // else these are the same exact item

        });

      });


      // now time to add this data to the page
      var htmlToInsert = "";

      var matchTypeString = "";
      var matchItemString = "";
      var matchLinkItemString = "";

      langHandler.ProvideStringRaw("i18n-generatedLHMatchType")
        .then((matchTypeRes) => {
          matchTypeString = matchTypeRes;

          langHandler.ProvideStringRaw("i18n-generatedLHMatchedItem")
            .then((matchItemRes) => {
              matchItemString = matchItemRes;

              langHandler.ProvideStringRaw("i18n-generatedLHLinkItem")
                .then((linkItemRes) => {
                  matchLinkItemString = linkItemRes;

                  matchList.forEach((element) => {
                    var htmlStart = `<div class="link-health-item-container"> <div class="link-health-item">`;
                    var htmlEnd = "</div> </div>";
                    htmlToInsert += htmlStart;
                    htmlToInsert += `<p><span class="text-style-declare">${matchTypeString}:</span> ${element.type}: <span class="text-style-declare">${matchItemString}:</span> ${element.matched}: <span class="text-style-declare">${matchLinkItemString}:</span> ${element.friendly[0]} & ${element.friendly[1]}</p>`;
                    htmlToInsert += htmlEnd;
                  });

                  // once this is all created, we can attach it into the dom.
                  document.getElementById("link-health").innerHTML = htmlToInsert;
                });
            });
        });

    });
}

function getHostname(url) {
  // use URL constructor and return hostname
  return new URL(url).hostname;
}

function getTranslatedStrings(id) {
  langHandler.ProvideStringRaw(id)
    .then((res) => {
      return res;
    });
}
