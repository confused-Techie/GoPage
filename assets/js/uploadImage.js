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
        if (imageList[i] != null && imageList[i] != "") {
          // after validating this is good data, we also need to ensure to break the column every four lines

          // we need to account for the first image-column entry
          // the below will break up the images' column every four images by checking the modulus or remainder
          if (i === 0) {
            insertHTML += "<div class='image-column'>";
            insertHTML += insertImg(imageList[i]);
          } else if (i % 4 === 0) {
            insertHTML += "</div>";
            insertHTML += "<div class='image-column'>";
            insertHTML += insertImg(imageList[i]);
          } else {
            insertHTML += insertImg(imageList[i]);
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

function insertImg(imageLoc) {
  var imgSrc = `/assets/userImages/${imageLoc}`;
  return `<img src="${imgSrc}" onclick="setImage('${imageLoc}');">`;
}

/*eslint-disable-next-line no-unused-vars*/
function setImage(name) {
  fetch("/api/usersettings")
    .then((res) => res.json())
    .then((data) => {
      // with the originally config we want to modify this to use the image selected
      data.customBackground.set = true;
      data.customBackground.src = name;

      const successHandler = function () {
        universe.SnackbarCommon(
          "snackbar",
          langHandler.UnicornComposite(
            i18n_generatedUploadSuccessSnackbar,
            name
          )
        );
      };

      universe.WriteUserSettings(
        universe.CreateJSONPOSTHeaders(JSON.stringify(data)),
        successHandler,
        function (err) {
          universe.SnackbarError(
            "snackbar",
            i18n_returnValueGenericError,
            false,
            err
          );
        }
      );
      // The above is attempted to be simplified to the greatest extent.
      // WriteUserSettings(requestOptions, successCallback, errorCallback)
      // requestOptions: CreateJSONPOSTHeaders with the stringified Data.
      // successCallback: The defined const successHandler. Which must be defined to contain logic of Composite String Method
      // errorCallback: An inline function taking the err passed, and then passing that to the GenericErrorHandler with the proper snackbar id
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

      var successHandler = function () {
        universe.SnackbarCommon("snackbar", i18n_generatedRemoveImageSuccess);
      };

      universe.WriteUserSettings(
        universe.CreateJSONPOSTHeaders(JSON.stringify(data)),
        successHandler,
        function (err) {
          universe.SnackbarError(
            "snackbar",
            i18n_returnValueGenericError,
            false,
            err
          );
        }
      );
    });
}

loadAvailableImages();
