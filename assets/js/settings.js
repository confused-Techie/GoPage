initHostSummary();

function initHostSummary() {
  // this will be used to add items to the host settings summary on the settings page.

  var htmlToReplace = document.getElementById("host-settings");

  // these will be the variables we hope to fill in.
  var systemHostName;
  var systemHostOS;

  fetch(`/api/hostos`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      systemHostOS = data;

      fetch(`/api/hostname`)
        .then(nameResponse => nameResponse.json())
        .then(nameData => {
          console.log(nameData);
          systemHostName = nameData;

          // once all items are fetched we can then modify the page
          langHandler.DetermineLang()
            .then(res => {
              console.log(`Settings.js: ${res}`);
            });
          // To translate generated text here, we will need to use langHandler.ProvideString() with the identifier. 
          var htmlToInsert = `<p>System Host Name: ${systemHostName}</p><p>System Operating System: ${systemHostOS}</p>`;
          htmlToReplace.innerHTML = htmlToInsert;
        });
    });
}
