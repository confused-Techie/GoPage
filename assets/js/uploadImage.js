
function loadAvailableImages() {
  // first we want to grab the list of all images in the userImages dir
  fetch("/userimages")
    .then((res) => res.json())
    .then((data) => {
      // Since this data is very roughly encoded we need to parse it accordingly
      // each value is the filename, split by ,
      var imageList = data.split(",");

      var insertHTML = "";
      insertHTML += "<div class='image-row'>";
      for (var i = 0; i < imageList.length; i++) {
        // since the gitignore was added to this folder, we need to ensure we don't grab it. Although in release builds it should be remvoed
        if (imageList[i] != null && imageList[i] != "" ) {
          // after validating this is good data, we also need to ensure to break the column every four lines
          const insertImg = function() {
            var imgSrc = `/assets/userImages/${imageList[i]}`;
            insertHTML += `<img src="${imgSrc}" onclick="setImage('${imageList[i]}');">`;
          };

          // we need to account for the first image-column entry
          // the below will break up the images' column every four images by checking the modulus or remainder
          if (i === 0) {
            insertHTML += "<div class='image-column'>";
            insertImg();
          } else if (i % 4 === 0) {
            insertHTML += "</div>";
            insertHTML += "<div class='image-column'>";
            insertImg();
          } else {
            insertImg();
          }
        } // else likely invalid data
      }
      // then in case the last row of elements didn't contain a perfect four values, we want to check that the last div is closed
      if (!insertHTML.endsWith("</div>")) {
        insertHTML += "</div>";
      }
      // then we want to close the div for the image row
      insertHTML += "</div>";

      document.getElementById("existingImages").innerHTML = insertHTML;
    });
}

/*eslint-disable-next-line no-unused-vars*/
function setImage(name) {
  fetch("/api/usersettings")
    .then((res) => res.json())
    .then((data) => {
      // with the originally config we want to modify this to use the image selected
      data.customBackground.set = true;
      data.customBackground.src = name;

      // then to post this data back to GoPage
      var raw = JSON.stringify(data);

      fetch("/api/usersettingswrite", universe.CreateJSONPOSTHeaders(raw))
        .then((response) => response.json())
        .then((result) => {
          // since we know this is an empty return, as long as we get a response we should be fine
          // one that isn't an error that is
          if (result == "Success") {
            // then we want to add our text to the snackbar and enable it
            // we want to grab the translation for this item
            langHandler.ProvideStringRaw("i18n-generatedUploadSuccessSnackbar")
              .then((resString) => {
                // But we know this string is a composite string, so we use the langHandler Composite handler to insert the name
                universe.SnackbarCommon("uploadImageSnackbar", langHandler.UnicornComposite(resString, name));
              });
          } else {
            // this is likely returning an error
            universe.SnackbarError("uploadImageSnackbar", `Error: ${result}`);
          }
        });
    });
}

/*eslint-disable-next-line no-unused-vars*/
function unsetImage() {
  fetch("/api/usersettings")
    .then((res) => res.json())
    .then((data) => {
      // with the originally config we want to modify this to set it to fase
      data.customBackground.set = false;

      // then to post this data back to GoPage
      var raw = JSON.stringify(data);

      fetch("/api/usersettingswrite", universe.CreateJSONPOSTHeaders(raw))
        .then((response) => response.text())
        .then((result) => {
          // since we know this is an empty return, as long as we get a response we should be fine
          // one that isn't an error that is
          if (result == "") {
            // then we want to add our text to the snackbar and enable it
            // we want to grab the translation for this item
            langHandler.ProvideStringRaw("i18n-generatedRemoveImageSuccess")
              .then((resString) => {
                // But we know this string is a composite string, so we use the langHandler Composite handler to insert the name
                universe.SnackbarCommon("uploadImageSnackbar", resString);
              });
          } else {
            universe.SnackbarError("uploadImageSnackbar", `Error: ${result}`);
          }
        });
    });
}

loadAvailableImages();
