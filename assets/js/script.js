//DECLARE GLOBAL VARIABLES - JQUERY REFERENCE S
var seatGeekEl = $(".seatGeekEl");
var googleMapsEl = $(".googleMapsEl");
//DECLARE GLOBAL VARIABLES - USER SELECTED STATE &
var userStateVar;
var eventsNewArray = [];
// Populates saved array with local storage items or empty array if nothing has been saved
var savedEventsArray = JSON.parse(localStorage.getItem("savedEvents")) || [];

//THIS FUNCTION RETRIEVES AND STORES SEATGEEK API DATA into eventsNewArray and appends them to the DOM as cards
function getSeatGeekData() {
  eventsNewArray = [];
  // empty any displayed content in the viewport
  $(".cardContainer").empty();
  //CREATE SEATGEEK REQUEST-URL
  var seatGeekURL =
    "https://api.seatgeek.com/2/events?&taxonomies.name=concert&venue.state=" +
    userStateVar +
    "&per_page=20&client_id=MjI4NDY0NzJ8MTYyODUzOTcyMy40OTk4MDYy";
  $.ajax({
    url: seatGeekURL,
    method: "GET",
  }).then(function (data) {
    for (var i = 0; i < data.events.length; i++) {
      console.log(data.events[i]);
      var concertNameVar = data.events[i].title;
      var concertVenueVar = data.events[i].venue.name;
      var concertAddressVar =
        data.events[i].venue.address +
        " " +
        data.events[i].venue.extended_address;
      var editedAddressVar = editAddressVar(concertAddressVar);
      var concertURL = data.events[i].url;
      var concertDateTimeVar = data.events[i].datetime_local;
      var formatDateVar = moment(concertDateTimeVar).format("dddd, MM-DD-YYYY");
      var formatTimeVar = moment(concertDateTimeVar).format("h:mm A");
      var imageSource = data.events[i].performers[0].image;
      var googleMapsURL =
        "https://www.google.com/maps/embed/v1/search?key=AIzaSyA7VdkObovB8PwzEmD0TLuGTikHJ1T5SxE&zoom=10&q==" +
        editedAddressVar;
      //STORE TO EVENTSNEWARRAY
      newObject = {
        concertName: concertNameVar,
        concertVenue: concertVenueVar,
        formatDate: formatDateVar,
        formatTime: formatTimeVar,
        concertU: concertURL,
        googleMapsU: googleMapsURL,
        image: imageSource,
        uniqueID: data.events[i].id,
      };
      eventsNewArray.push(newObject);
      //APPEND TO DOM
      $(".cardContainer").append(`
    <div class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
    <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
      <a href="${concertURL}" target="no_blank"> <img
        src="${imageSource}"
        alt="Band image" />
      </a>
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">${concertNameVar}</p>
          <p class="is-6">${concertVenueVar}</p>
          <p class="is-6">${formatDateVar}</p>
          <p class="is-6">${formatTimeVar}</p>
        </div>
      </div>
      <div class="content">
        <a href="${concertURL}" target="no_blank" class="buy">Buy Tickets at SeatGeek Here</a>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item button save" data-index="${i}">Save</a>
        <a href="#" class="card-footer-item button is-hidden delete">Delete</a>
        <button class="card-footer-item button open-modal map" data-index="${i}">View Map 
    
        </button>
      </footer>
    </div>
  </div>
  </div>
  <div class="modal numberModal${i}">
        <div class="modal-background eventModalClose"></div>
        <div class="modal-content">
          <iframe
            width="450"
            height="250"
            frameborder="0"
            style="border: 0"
            src="${googleMapsURL}"
            allowfullscreen
          >
          </iframe>
        </div>
        <button class="modal-close is-large eventModalClose" aria-label="close"></button>
      </div>
    `);
      ``;
    }
  });
}
//EVENT LISTENERS FOR MAP BUTTONS
$(document).on("click", ".open-modal", function (event) {
  event.preventDefault();
  var getIndex = $(this).attr("data-index");
  //get unique index identified from click: getIndex = 0, 2, 3 ,4
  var classIndex = ".numberModal" + getIndex;
  //adds the unique index to the class to target the specified card: classIndex= .numberModal1, classIndex= .numberModal17
  $(classIndex).addClass("is-active");
});
// Event listener for the dropdown items
$(document).on("click", ".dropdown-item", function (event) {
  event.preventDefault();
  userStateVar = $(this).text();
  $("dropdown").removeClass("is-active");
  $(".state-selected").text(userStateVar);
  getSeatGeekData();
});
//EVENT LISTENER TO CLOSE MAPS
$(document).on("click", ".eventModalClose", function (event) {
  $(".modal").removeClass("is-active");
});
// Event listener for save button
$(document).on("click", ".save", function (event) {
  event.preventDefault();
  var getIndex = $(this).attr("data-index");
  console.log(savedEventsArray.indexOf(eventsNewArray[getIndex]));
  console.log({ savedEventsArray });
  console.log(eventsNewArray[getIndex]);
  //LOOP AND IF STATEMENT CHECK IF EVENT IS ALREADY SAVED
  var newItemUnique = isEventInSavedEvents(eventsNewArray[getIndex]);
  if (newItemUnique) {
    savedEventsArray.push(eventsNewArray[getIndex]);
    localStorage.setItem("savedEvents", JSON.stringify(savedEventsArray));
  }
});
// Checks if newly saved event is already saved or not
function isEventInSavedEvents(newEvent) {
  var newItemUnique = true;
  for (var i = 0; i < savedEventsArray.length; i++) {
    if (savedEventsArray[i].uniqueID === newEvent.uniqueID) {
      newItemUnique = false;
      break;
    }
  }
  return newItemUnique;
}
// event listener for "delete" button
$(document).on("click", ".remove", function (event) {
  event.preventDefault();
  var getIndex = $(this).attr("data-index");
  savedEventsArray.splice(getIndex, 1);
  localStorage.setItem("savedEvents", JSON.stringify(savedEventsArray));
  $(".cardContainer").empty();
  $(".hero").empty();
  renderSavedCards(savedEventsArray);
});
// Return any saved events to the viewport
$(document).on("click", ".saved", function (event) {
  $(".cardContainer").empty();
  $(".hero").empty();
  event.preventDefault();
  $(".saved").addClass("is-hidden");
  $(".container-fluid").append(
    `<a class="button mr-4 go-back is-danger">Go Back</a>`
  );
  renderSavedCards(savedEventsArray);
});
// Event listener for go back button, refreshes the page if it is clicked
$(document).on("click", ".go-back", function (event) {
  event.preventDefault();
  $(".go-back").addClass("is-hidden");
  $(".saved").removeClass("is-hidden");
  window.location.reload();
});
// Puts address in correct format so google maps api URL can use it
function editAddressVar(concertAddressVar) {
  var editedAddressVar = concertAddressVar.replace(/\s/g, "+");
  return editedAddressVar;
}
//LOCAL STORAGE FUNCTIONS ------
// render saved cards on the screen
function renderSavedCards(savedCards) {
  for (var i = 0; i < savedCards.length; i++) {
    $(".cardContainer").append(`
    <div class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
    <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
      <a href="${savedCards[i].concertU}" target="no_blank"> <img
        src="${savedCards[i].image}"
        alt="Band image" />
      </a>
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">${savedCards[i].concertName}</p>
          <p class="is-6">${savedCards[i].concertVenue}</p>
          <p class="is-6">${savedCards[i].formatDate}</p>
          <p class="is-6">${savedCards[i].formatTime}</p>
        </div>
      </div>
      <div class="content">
        <a href="${savedCards[i].concertU}" target="no_blank" class="buy">Buy Tickets at SeatGeek Here</a>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item button save is-hidden" data-index="${i}">Save</a>
        <a href="#" class="card-footer-item button remove" data-index="${i}">Delete</a>
        <button class="card-footer-item button open-modal map" data-index="${i}">View Map 
    
        </button>
      </footer>
    </div>
  </div>
  </div>
  <div class="modal numberModal${i}">
        <div class="modal-background eventModalClose"></div>
        <div class="modal-content">
          <iframe
            width="450"
            height="250"
            frameborder="0"
            style="border: 0"
            src="${savedCards[i].googleMapsU}"
            allowfullscreen
          >
          </iframe>
        </div>
        <button class="modal-close is-large eventModalClose" aria-label="close"></button>
      </div>
    `);
  }
}
