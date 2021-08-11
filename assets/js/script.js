//DECLARE GLOBAL VARIABLES - JQUERY REFERENCE S
var seatGeekEl = $(".seatGeekEl");
var googleMapsEl = $(".googleMapsEl");

//DECLARE GLOBAL VARIABLES - USER SELECTED STATE &
var userStateVar = "CO";
var eventsNewArray = [];

//CREATE SEATGEEK REQUEST-URL
var seatGeekURL =
  "https://api.seatgeek.com/2/events?&taxonomies.name=concert&venue.state=" +
  userStateVar +
  "&per_page=20&client_id=MjI4NDY0NzJ8MTYyODUzOTcyMy40OTk4MDYy";

getSeatGeekData();

//THIS FUNCTION RETRIEVES AND STORES SEATGEEK API DATA into
function getSeatGeekData() {
  $.ajax({
    url: seatGeekURL,
    method: "GET",
  }).then(function (data) {
    for (var i = 0; i < 20; i++) {
      var concertNameVar = data.events[i].title;
      var concertVenueVar = data.events[i].venue.name;
      var concertAddressVar =
        data.events[i].venue.address +
        " " +
        data.events[i].venue.extended_address;
      var concertURL = data.events[i].url;
      var concertDateTimeVar = data.events[i].datetime_local;

      var formatDateVar = moment(concertDateTimeVar).format("dddd, MM-DD-YYYY");
      var formatTimeVar = moment(concertDateTimeVar).format("h:mm A");

      var imageSource = data.events[i].performers[0].image;

      // console.log(data);
      // console.log(concertNameVar);
      // console.log(concertVenueVar);
      // console.log(concertAddressVar);
      // console.log(concertDateTimeVar);
      // console.log(formatDateVar);
      // console.log(formatTimeVar);
      // console.log(concertURL);

      //STORE TO EVENTSNEWARRAY
      // eventsNewArray[i].concertName = concertNameVar;
      // eventsNewArray[i].concertVenue = concertVenueVar;
      // eventsNewArray[i].formatDate = formatDateVar;
      // eventsNewArray[i].formatTime = formatTimeVar;
      // eventsNewArray[i].concertU = concertURL;
      console.log(eventsNewArray);
      //APPEND TO DOM WITH NICK & ABBY'S CARDS

      $(".cardContainer").append(`
    <div class="column is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
    <div class="card">
    <div class="card-image">
      <figure class="image is-4by3">
      <img
        src="${imageSource}"
        alt="Band image"
      />
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
        <a href="${concertURL}" target="no_blank">Buy Tickets at SeatGeek Here</a>
      </div>

      <footer class="card-footer">
        <a href="#" class="card-footer-item button is-link">Save</a>
        <a href="#" class="card-footer-item button is-link is-hidden">Delete</a>

        <button class="card-footer-item button is-link open-modal">View Map 
    
        </button>

      </footer>
    </div>
  </div>
  </div>
    `);
    }
  });
}

$(document).on("click", ".open-modal", function () {
  //event.preventDefault();
  $(".modal").addClass("is-active");
});

function storeSeatGeekLocal(thisConcert) {
  concertDataArray.push(thisConcert);
  //console.log(concertDataArray);
}

//LOCAL STORAGE FUNCTIONS ------
function initSeatGeek() {
  var savedConcertArray = JSON.parse(localStorage.getItem("concertDataArray"));

  if (savedConcertArray) {
    concertDataArray = savedConcertArray;
  }

  saveSeatGeek();
  displaySeatGeek();
}

function saveSeatGeek() {
  localStorage.setItem("concertDataArray", JSON.stringify(concertDataArray));
}

//SCRATCH WORK NOTES ------

// Plug in state to requestURL
//https://api.seatgeek.com/2/events?venue.state=CO&client_id=MjI4NDY0NzJ8MTYyODUzOTcyMy40OTk4MDYy

// For loop to pull 20 events, need to save the following to an array of objects
// 	artistNameVar = data.events[i].venue.name
// venueNameVar = data.events[i].venue.name
// 	venueAddressVar = data.events[i].venue.address + data.events[i].venue.extended_address
// 	eventDateTimeVar = data.events[i].datetime_local
// 	eventUrlVar = data.events[i].
