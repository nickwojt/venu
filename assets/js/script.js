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
  "&client_id=MjI4NDY0NzJ8MTYyODUzOTcyMy40OTk4MDYy";

getSeatGeekData();

//THIS FUNCTION RETRIEVES AND STORES SEATGEEK API DATA into
function getSeatGeekData() {
  $.ajax({
    url: seatGeekURL,
    method: "GET",
  }).then(function (data) {
    var concertNameVar = data.events[0].performers[0].name;
    var concertVenueVar = data.events[0].venue.name;
    var concertAddressVar =
      data.events[0].venue.address +
      " " +
      data.events[0].venue.extended_address;
    var concertDateTimeVar = data.events[0].datetime_local;

    var formatDateVar = moment(concertDateTimeVar).format("MM-DD-YYYY");
    var formatTimeVar = moment(concertDateTimeVar).format("hh:mm:ss");

    // console.log(data);
    console.log(concertNameVar);
    console.log(concertVenueVar);
    console.log(concertAddressVar);
    console.log(concertDateTimeVar);
    console.log(formatDateVar);
    console.log(formatTimeVar);

    //STORE TO EVENTSNEWARRAY

    //APPEND TO DOM WITH NICK & ABBY'S CARDS
  });
}

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
