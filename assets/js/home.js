
function onload() {
  // first in the onload we can use the built in api call to get all json objects, to then create the other filter buttons
  fetch('/api/items')
    .then(response => response.json())
    .then(data => {
      var assignedBtns = [];
      // then to loop through all the data
      data.forEach((element, index) => {
        // now we want to add this item as a button
        // while ensuring we don't add the same button twice

        if (assignedBtns.indexOf(element.category) == -1) {
          let btn = document.createElement("button");
          btn.innerHTML = `${element.category}`;
          btn.onclick = function() {
            filterSelection(`${element.category}`);
          }
          btn.className = 'btn';

          // since the normal method to detect the active button isn't working on these generated ones, we can add it manually
          btn.addEventListener("click", generatedEventListener, false);
          document.getElementById("btnContainer").appendChild(btn);

          //then add this button to the list of assignedBtns
          assignedBtns.push(element.category);
        } // else the button has already been assigned and is ignored

      });
    });

    // this provides a default
    filterSelection("all");
}

function filterSelection(c) {
  var filterDivElement = document.getElementsByClassName("filterDiv");

  if (c == "all")  c = "";

  for (let i = 0; i < filterDivElement.length; i++) {
    removeClass(filterDivElement[i], "show");
    if (filterDivElement[i].className.indexOf(c) > -1) addClass(filterDivElement[i], "show");
  }
}

function removeClass(element, name) {
  let elementClasses = element.className.split(" ");
  let provNames = name.split(" ");
  for (let i = 0; i < provNames.length; i++) {
    while (elementClasses.indexOf(provNames[i]) > -1) {
      elementClasses.splice(elementClasses.indexOf(provNames[i]), 1);
    }
  }
  element.className = elementClasses.join(" ");
}

function addClass(element, name) {
  let elementClasses = element.className.split(" ");
  let provNames = name.split(" ");
  for (let i = 0; i < provNames.length; i++) {
    if (elementClasses.indexOf(provNames[i]) == -1) {
      element.className += " " + provNames[i];
    }
  }
}

// Add active class to the current button
var btnContainer = document.getElementById("btnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    console.log('button event listener');
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    console.log(this);
  });
}

function generatedEventListener(event) {
  var btnContainer = document.getElementById("btnContainer");
  var btns = btnContainer.getElementsByClassName("btn");
  for (var i = 0; i < btns.length; i++) {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  }
}

// Modal based JS

// Previous links to delete in HTML: <div class="deleteItem"> <a href="/delete/{{.Id}}"> <img src="/assets/images/trash-2.svg"> </a> </div>

function modalDelete(id) {
  // this should be called when the delete button is hit
  var modal = document.getElementById("deleteModal");

  // allow it to be visible.
  modal.style.display = "block";

  // Once visible we want to register an onclick handler with the now visible confirm delete button.
  var modalNotDeleteBtn = document.getElementById("notDelete-modal");

  var modalDeleteBtn = document.getElementById("delete-modal");

  modalDeleteBtn.onclick = function() {
    window.location.href = `/delete/${id}`;
  }

  modalNotDeleteBtn.onclick = function() {
    modal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

//var modal = document.getElementById("deleteModal");

//var modalOpenBtn = document.getElementById("tempModal");

//modalOpenBtn.onclick = function() {
//  modal.style.display = "block";
//}

// when the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}
