initHostSummary();

function initHostSummary() {
  // this will be used to add items to the host settings summary on the settings page.

  var htmlToReplace = document.getElementById("host-settings");

  // these will be the variables we hope to fill in.
  var systemHostName;
  var systemHostOS;

  fetch("/api/hostos")
    .then((response) => response.json())
    .then((data) => {
      systemHostOS = data;

      fetch("/api/hostname")
        .then((nameResponse) => nameResponse.json())
        .then((nameData) => {
          systemHostName = nameData;

          // once all items are fetched we can then modify the page

          // to properly have translations for generated text
        var hostNameString = "";
        var hostOperatingSystem = "";
        langHandler.ProvideStringRaw("i18n-generatedSettingsHostName")
          .then((resHostString) => {
            hostNameString = resHostString;

            langHandler.ProvideStringRaw("i18n-generatedSettingsOperatingSystem")
              .then((resOSString) => {
                hostOperatingSystem = resOSString;

                var htmlToInsert = `<p>${hostNameString}: ${systemHostName}</p><p>${hostOperatingSystem}: ${systemHostOS}</p>`;
                htmlToReplace.innerHTML = htmlToInsert;
              });
          });
        });
    });
}
