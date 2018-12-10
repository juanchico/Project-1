// Firebase Link, Config, Ref Variable Info

var config = {
    apiKey: "AIzaSyC-yY5vNVc5WyXFJ6YOEwXCHmbnzRkbL_g",
    authDomain: "movie-cards-2018.firebaseapp.com",
    databaseURL: "https://movie-cards-2018.firebaseio.com",
    projectId: "movie-cards-2018",
    storageBucket: "movie-cards-2018.appspot.com",
    messagingSenderId: "355532779763"
};

firebase.initializeApp(config);

var firebase = firebase.database();

// ***************************************

// GLOBAL VARIABLES

var imdbIDs = ["tt0170016", "tt0314331", "tt0241527", "tt0319343", "tt0309987", "tt0338348", "tt0468569", "tt0120737", "tt1099212", "tt0367594", "tt0330373", "tt0377092", "tt0479143", "tt0304669", "tt0361748", "tt0477348", "tt0304141", "tt0167260", "tt1067106", "tt0317705", "tt0388419", "tt0454945", "tt0172495", "tt0409459", "tt0206634", "tt0482571", "tt0218967", "tt0307987", "tt0167261", "tt0486583", "tt0338013", "tt0416449", "tt0217869", "tt0401792", "tt0268978", "tt0110357", "tt0099785", "tt0111070", "tt0111161", "tt0110912", "tt0120338", "tt0108052", "tt0109830", "tt0104431", "tt0112573", "tt0099685", "tt0107290", "tt0133093", "tt0102926", "tt0118715", "tt0107688", "tt0137523", "tt0119217", "tt0118749", "tt0116282", "tt0114369", "tt0120815", "tt0117737", "tt0103874", "tt0102798", "tt0113277", "tt0119116", "tt0119303", "tt0114709", "tt0103064", "tt0117509", "tt0103639", "tt0097958", "tt0085334", "tt0089927", "tt0095560", "tt0093389", "tt0095016", "tt0093779", "tt0093058", "tt0088763", "tt0083658", "tt0093773", "tt0086250", "tt1213644", "tt0270846", "tt0060666", "tt0804492", "tt1316037", "tt0317676", "tt0417056", "tt0339034", "tt0362165", "tt0369226", "tt0185183", "tt0096870", "tt0299930", "tt01186653", "tt00933005", "tt03832227", "tt1883367", "tt0804452", "tt4877122", "tt0115624", "tt0110978", "tt1666186", "tt0120185", "tt0400426", "tt0795461", "tt5690360", "tt1411664", "tt0450345", "tt0119707", "tt0372873", "tt0897361", "tt0120179", "tt0157262", "tt0811138", "tt0111301", "tt0291502", "tt0180052", "tt0094824", "tt0926129", "tt0107978", "tt0108255", "tt0479968", "tt0806147", "tt2278388", "tt0091064", "tt0116629", "tt3501632", "tt3896198", "tt0362270", "tt0097257"];

var titleChoice;
var movieCards = [];
var movieName = [];
var movieTrailers = [];
var alreadySelected = [];
var ytPlayerSRC = "https://www.youtube.com/embed/";
var ytPlayerId;
var dbIndex = 0;

// ***************************************

// FUNCTIONS & API CALLS (OMDB)

function dealCards() {

    for (var i = 0;  i < imdbIDs.length; i++) {
        titleChoice = imdbIDs[Math.floor(Math.random() * imdbIDs.length)];

        if ($.inArray(titleChoice, alreadySelected) === -1) {
            alreadySelected.push(titleChoice);
            getMovieInfo(titleChoice);
        }
    }
}

function getMovieInfo(movieID) {

    var keyOMDB = "trilogy";
    var queryOMDB = "http://www.omdbapi.com/?apikey=" + keyOMDB + "&i=" + movieID;

    $.ajax({
        url: queryOMDB,
        method: "GET"
    }).then(function(data) {

        // Extract movie information
        var moviePoster = data.Poster;
        var movieTitle = data.Title;
            movieTitle = movieTitle.toLowerCase();
        var cardValue = parseInt(data.imdbRating) * 10;

        var moviePlot = data.Plot;
        var movieActors = data.Actors;
        var movieRated = data.Rated;
        var movieRuntime = data.Runtime.substring(0,3);
        var movieRelease = data.Released;

        movieRef = firebase.ref("/cardDeck/" + dbIndex);
        dbIndex++;

        // Push movie information to Firebase
        movieRef.set({
            Poster: moviePoster,
            Title: data.Title,
            Value: cardValue,
            Plot: moviePlot,
            Actors: movieActors,
            Rating: movieRated,
            Runtime: movieRuntime,
            Release: movieRelease
        });

        if ($.inArray(movieTitle, movieCards) === -1) {
            movieCards.push(movieTitle);
            movieName.push(data.Title);
        }
    });
}

// FUNCTIONS & API CALLS (YouTube)

function pullTrailer(movie) {

    console.log(movie);

    var keyYouTube = "AIzaSyAGgOJzbjOxlwnCxoTjgLog-j9mbFCQm4o";
    var queryYouTube = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=" + keyYouTube + "&q=" + movie + "official+movie+trailer";

    $.ajax({
        url: queryYouTube,
        method: "GET"
    }).then(function(data) {

        var trailer = data.items[0];
        var trailerTitle = trailer.snippet.title;
            trailerTitle = trailerTitle.toLowerCase();
        var trailerVideoID = trailer.id.videoId;

        if (trailerTitle.includes(movie) !== -1) {
            movieTrailers.push(trailerVideoID);
            ytPlayerId = trailerVideoID;
        }
        else {
            movieTrailers.push("Trailer Unavailable");
        }
    });
}
// ***************************************

// GAME / PAGE LOGIC

dealCards();

// CREATE onClick function to set TrailerID attribute to corresponding card in Firebase when movie is selected.



// Test modal (onClick) logic
$(document).on("click", "#playMovie", function() {

    for (var i = 0; i < 10; i++) {
        var mov = $("<button>").html(movieName[i]).attr("data-title", movieName[i]).attr("data-index", i);

        $("#movie-list").append(mov);
    }

    $("#movie-list > button").on("click", function() {

        console.log(this);

        var movtitle = $(this).attr("data-title").toLowerCase();

        pullTrailer(movtitle);

        setTimeout(function() {

            $("#ytplayer").attr("src", ytPlayerSRC + ytPlayerId);
        }, 1000 * 0.5);
    });

    var modal = $(".modal");
    var btn = $("#movie-list > button");
    var exit = $("#close");

    btn.on("click", function() {
        setTimeout(function() {
            modal.css("display", "block");
        }, 1000 * 0.5);
    });

    exit.on("click", function() {
        modal.css("display", "none");
    });

    $(window).on("click", function(event) {

        if (event.target === modal[0]) {
            modal.css("display", "none");
        }
    });
});
