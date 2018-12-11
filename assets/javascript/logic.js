// Firebase Link & Config
var config = {
    apiKey: "AIzaSyC-yY5vNVc5WyXFJ6YOEwXCHmbnzRkbL_g",
    authDomain: "movie-cards-2018.firebaseapp.com",
    databaseURL: "https://movie-cards-2018.firebaseio.com",
    projectId: "movie-cards-2018",
    storageBucket: "movie-cards-2018.appspot.com",
    messagingSenderId: "355532779763"
};

firebase.initializeApp(config);

// ***************************************

// GLOBAL VARIABLES

// IMDB IDs
var imdbIDs = ["tt0170016", "tt0314331", "tt0241527", "tt0319343", "tt0309987", "tt0338348", "tt0468569", "tt0120737", "tt1099212", "tt0367594", "tt0330373", "tt0377092", "tt0479143", "tt0304669", "tt0361748", "tt0477348", "tt0304141", "tt0167260", "tt1067106", "tt0317705", "tt0388419", "tt0454945", "tt0172495", "tt0409459", "tt0206634", "tt0482571", "tt0218967", "tt0307987", "tt0167261", "tt0486583", "tt0338013", "tt0416449", "tt0217869", "tt0401792", "tt0268978", "tt0110357", "tt0099785", "tt0111070", "tt0111161", "tt0110912", "tt0120338", "tt0108052", "tt0109830", "tt0104431", "tt0112573", "tt0099685", "tt0107290", "tt0133093", "tt0102926", "tt0118715", "tt0107688", "tt0137523", "tt0119217", "tt0118749", "tt0116282", "tt0114369", "tt0120815", "tt0117737", "tt0103874", "tt0102798", "tt0113277", "tt0119116", "tt0119303", "tt0114709", "tt0103064", "tt0117509", "tt0103639", "tt0097958", "tt0085334", "tt0089927", "tt0095560", "tt0093389", "tt0095016", "tt0093779", "tt0093058", "tt0088763", "tt0083658", "tt0093773", "tt0086250", "tt1213644", "tt0270846", "tt0060666", "tt0804492", "tt1316037", "tt0317676", "tt0417056", "tt0339034", "tt0362165", "tt0369226", "tt0185183", "tt0096870", "tt0299930", "tt01186653", "tt00933005", "tt03832227", "tt1883367", "tt0804452", "tt4877122", "tt0115624", "tt0110978", "tt1666186", "tt0120185", "tt0400426", "tt0795461", "tt5690360", "tt1411664", "tt0450345", "tt0119707", "tt0372873", "tt0897361", "tt0120179", "tt0157262", "tt0811138", "tt0111301", "tt0291502", "tt0180052", "tt0094824", "tt0926129", "tt0107978", "tt0108255", "tt0479968", "tt0806147", "tt2278388", "tt0091064", "tt0116629", "tt3501632", "tt3896198", "tt0362270", "tt0097257"];

var movieCards = [];
var movieName = [];
var movieTrailers = [];
var moviePosterURLs = [];
var alreadySelected = [];
var titleChoice;
var ytPlayerSRC = "https://www.youtube.com/embed/";
var ytPlayerId;
var dbIndex = 0;
var numRound = 1;
var P1Score = 0;
var P2Score = 0;
var roundsLeft = 5 - numRound;

// Firebase Refs
var firebase = firebase.database();
var playersRef = firebase.ref("/players");
var currentTurnRef = firebase.ref("/turn");
var chatData = firebase.ref("/chat");
var username = "Guest";
var currentPlayers = null;
var currentTurn = null;
var playerNum = false;
var playerOneExists = false;
var playerTwoExists = false;
var playerOneData = null;
var playerTwoData = null;

// ***************************************

// FUNCTIONS & API CALLS (OMDB)

function pullCards() {

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

        console.log(movieTitle);

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
            moviePosterURLs.push(moviePoster);
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

function dealCards() {

    roundRef = firebase.ref("/round/" + numRound);
    roundRef.set({
        P1Score: P1Score,
        P2Score: P2Score,
        RoundsRem: roundsLeft
    });

    for (var i = 1; i <= 5; i++) {

        var cardIMG = $("<img>").attr("src", moviePosterURLs[i - 1]);

        $("#card-bodyP" + i).attr("data-index", (i - 1)).addClass("gameCard");
        $("#card-bodyP" + i).html(cardIMG);
        $("#oCard" + i).css("display", "block");
        $("#pCard" + i).css("display", "block");
    }
}

function nextRound() {

    numRound++;
    firebase.ref("/round/" + numRound);

    for (var i = 1; i <= (5 * numRound); i++) {

    }
}

// ***************************************

// GAME / PAGE LOGIC

// Populate Card Deck
pullCards();

// Listeners for Usernames
$("#start").click(function() {

    if ($("#username").val() !== "") {

        username = capitalize($("#username").val());
        joinGame();
    }
});

// 'Enter' for Username Input
$("#username").keypress(function(event) {

    if (event.which === 13 && $("#username").val() !== "") {

        username = capitalize($("#username").val());
        joinGame();
    }
});

// Capitalize Usernames
function capitalize(name) {

    return name.charAt(0).toUpperCase() + name.slice(1);
}

// Chatbox Input Listener
$("#chat-input").keypress(function(event) {
    
    if (event.which === 13 && $("#chat-input").val() !== "") {

        var message = $("#chat-input").val();
  
        chatData.push({
        Name: username,
        Message: message,
        Time: firebase.database.ServerValue.TIMESTAMP,
        idNum: playerNum
    });
  
      $("#chat-input").val("");
    }
});

// Click Event for Cards Dealt
$(document).on("click", ".gameCard", function() {
    console.log("click");
  
    // Grabs "data-index" From Card Choice
    var clickChoice = $(this).attr("data-index");
    // console.log(playerRef);
    console.log(clickChoice);
  
    // Sets the Choice in the Current Player Object in Firebase
    // playerRef.child("choice").set(clickChoice);
  
    // User Choice Animates to the Game Board [[HERE]]
  
    // Increment Turn -- Turn Values:
    // 1 - P1
    // 2 - P2
    // 3 - Determine Winner
    currentTurnRef.transaction(function(turn) {
      return turn + 1;
    });
});

// Update Chat on Modal @ New Message Detected - Ordered by 'Time' Value
chatData.orderByChild("time").on("child_added", function(snapshot) {
    $("#chat-messages").append(
      $("<p>").addClass("player-" + snapshot.val().idNum),
      $("<span>").text(snapshot.val().name + ":" + snapshot.val().message)
    );
  
    // Keeps div Scrolled to Bottom
    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
});

// Track Changes in DB Key Which Contains Player Objects
playersRef.on("value", function(snapshot) {
    // Length of the 'Players' Array
    currentPlayers = snapshot.numChildren();
  
    // Check for Existing Players
    playerOneExists = snapshot.child("1").exists();
    playerTwoExists = snapshot.child("2").exists();
  
    // Player Objects
    playerOneData = snapshot.child("1").val();
    playerTwoData = snapshot.child("2").val();
  
    // If player 1 Exists, Populate Name and Wins/Losses
    if (playerOneExists) {
        $("#player1-name").text(playerOneData.name);
        $("#player1-wins").text("Wins: " + playerOneData.wins);
        $("#player1-losses").text("Losses: " + playerOneData.losses);
    }
    else {
    // If No Player 1,Clear Win/Loss Data and Show Waiting
        $("#player1-name").text("Waiting for Player 1");
        $("#player1-wins").empty();
        $("#player1-losses").empty();
    }
  
    // If player 2 Exists, Populate Name and Wins/Losses
    if (playerTwoExists) {
        $("#player2-name").text(playerTwoData.name);
        $("#player2-wins").text("Wins: " + playerTwoData.wins);
        $("#player2-losses").text("Losses: " + playerTwoData.losses);
    }    
    else {
    // If No Player 1,Clear Win/Loss Data and Show Waiting
        $("#player2-name").text("Waiting for Player 2");
        $("#player2-wins").empty();
        $("#player2-losses").empty();
    }
});

// Detect Changes in Current Turn DB Key
currentTurnRef.on("value", function(snapshot) {
    // Pull Current Turn
    currentTurn = snapshot.val();
  
    // Following Won't Trigger Unless Logged In
    if (playerNum) {
        // Turn 1
        if (currentTurn === 1) {
            // If Current Player's Turn, Update Text
            if (currentTurn === playerNum) {
                $("#current-turn h2").text("It's Your Turn!");
                $("#player" + playerNum + " ul").append("<li>Rock</li><li>Paper</li><li>Scissors</li>");
            }
            else {
                // If Not Current Player's Turn, Update Text to Say Waiting
                $("#current-turn h2").text("Waiting for " + playerOneData.name + " to choose.");
            }
  
            // Highlight Active Player [[UPDATE STYLE if desired]]
            $("#player1").css("border", "2px solid yellow");
            $("#player2").css("border", "1px solid black");
        }
        else if (currentTurn === 2) {
            // If Current Player's Turn, Update Text
            if (currentTurn === playerNum) {
                $("#current-turn").text("It's Your Turn!");
                $("#player" + playerNum + " ul").append("<li>Rock</li><li>Paper</li><li>Scissors</li>");
            }
            else {
                // If Not Current Player's Turn, Update Text to Say Waiting
                $("#current-turn").text("Waiting for " + playerTwoData.name + " to choose.");
            }
            // Highlight Active Player [[UPDATE STYLE if desired]]
            $("#player2").css("border", "2px solid yellow");
            $("#player1").css("border", "1px solid black");
        }
        else if (currentTurn === 3) {
            // Check for Win/Lose Game Logic and Reset Turn
            gameLogic(playerOneData.choice, playerTwoData.choice);
  
            // Reveal Player/Opp Choices [[PLAY TRAILER IN MODAL HERE]]
            $("#player1-chosen").text(playerOneData.choice);
            $("#player2-chosen").text(playerTwoData.choice);
    
            //  Reset After Timeout
            var moveOn = function() {
            $("#player1-chosen").empty();
            $("#player2-chosen").empty();
            $("#result").empty();
  
            // Check to Ensure Players Have Not Left Before Timeout
            if (playerOneExists && playerTwoExists) {
                currentTurnRef.set(1);
            }
        };
  
        //  show results for 2 seconds, then resets
        setTimeout(moveOn, 2000);
    }
    else {
        $("#player1 ul").empty();
        $("#player2 ul").empty();
        $("#current-turn").html("<h2>Waiting for another player to join.</h2>");
        $("#player2").css("border", "1px solid black");
        $("#player1").css("border", "1px solid black");
    }
    }
});
  
// When Player Joins Game, Check for 2 Players. If Yes, Game Will Start
playersRef.on("child_added", function(snapshot) {

    if (currentPlayers === 1) {
        // Set turn to 1 and Start the Game
        currentTurnRef.set(1);
    }
});

// joinGame Function
function joinGame() {
 
    var chatDataDisc = database.ref("/chat/" + Date.now());
  
    // If P1 Exists, Joining Player is P2 -- Else, P1 is P1
    if (currentPlayers < 2) {
        if (playerOneExists) {
            playerNum = 2;
        }
        else {
            playerNum = 1;
        }
  
        // Create DB Key Based on Assigned Player Number
        playerRef = database.ref("/players/" + playerNum);
  
        // Create Player Object
        playerRef.set({
        Name: username,
        Wins: 0,
        Losses: 0
        });
  
        // On Disconnect, Erase Player Object
        playerRef.onDisconnect().remove();

        // If Disconnect, Set Turn to Null
        currentTurnRef.onDisconnect().remove();
  
        // Update Chatbox with Disconnect Message
        chatDataDisc.onDisconnect().set({
            Name: username,
            Time: firebase.database.ServerValue.TIMESTAMP,
            Message: "has disconnected.",
            idNum: 0
        });
  
        // Remove Name Entry Box and Update with Current Player Name
        $("#swap-zone").empty();
  
        $("#swap-zone").append($("<h2>").text("Hi " + username + "! You are Player " + playerNum));
    }
    else {
        // If Current Players is P2, New Player Can't Join
        alert("Game Lobby Full! Please Try Again Later!");
    }
}
  
// Game logic -- Displays Who Wins/Loses -- Increment Wins/Losses
function gameLogic(player1choice, player2choice) {

    var playerOneWon = function() {

        $("#result h2").text(playerOneData.name + " Wins!");

        if (playerNum === 1) {
            playersRef
            .child("1")
            .child("wins")
            .set(playerOneData.wins + 1);

            playersRef
            .child("2")
            .child("losses")
            .set(playerTwoData.losses + 1);
        }
    };

    var playerTwoWon = function() {

        $("#result h2").text(playerTwoData.name + " Wins!");

        if (playerNum === 2) {
            playersRef
            .child("2")
            .child("wins")
            .set(playerTwoData.wins + 1);

            playersRef
            .child("1")
            .child("losses")
            .set(playerOneData.losses + 1);
        }
    };

// WHAT DO WE DO FOR A TIE?!?!?
    var tie = function() {

        $("#result h2").text("Tie Game!");
    };

    if (player1choice === "Rock" && player2choice === "Rock") {
        tie();
    }

    else if (player1choice === "Paper" && player2choice === "Paper") {
        tie();
    }

    else if (player1choice === "Scissors" && player2choice === "Scissors") {
        tie();
    }

    else if (player1choice === "Rock" && player2choice === "Paper") {
        playerTwoWon();
    }

    else if (player1choice === "Rock" && player2choice === "Scissors") {
        playerOneWon();
    }

    else if (player1choice === "Paper" && player2choice === "Rock") {
        playerOneWon();
    }

    else if (player1choice === "Paper" && player2choice === "Scissors") {
        playerTwoWon();
    }

    else if (player1choice === "Scissors" && player2choice === "Rock") {
        playerTwoWon();
    }
    
    else if (player1choice === "Scissors" && player2choice === "Paper") {
        playerOneWon();
    }
}





// Deal Cards for Round
$(document).on("click", "#gameStart", function() {
    
    dealCards();

});

// CREATE onClick function to set TrailerID attribute to corresponding card in Firebase when movie is selected.


// TEST modal (onClick) logic
// $(document).on("click", "#playMovie", function() {

//     for (var i = 0; i < 10; i++) {
//         var mov = $("<button>").html(movieName[i]).attr("data-title", movieName[i]).attr("data-index", i);

//         $("#movie-list").append(mov);
//     }

//     $("#movie-list > button").on("click", function() {

//         console.log(this);

//         var movtitle = $(this).attr("data-title").toLowerCase();

//         pullTrailer(movtitle);

//         setTimeout(function() {

//             $("#ytplayer").attr("src", ytPlayerSRC + ytPlayerId);
//         }, 1000 * 0.5);
//     });

//     var modal = $(".modal");
//     var btn = $("#movie-list > button");
//     var exit = $("#close");

//     btn.on("click", function() {
//         setTimeout(function() {
//             modal.css("display", "block");
//         }, 1000 * 0.5);
//     });

//     exit.on("click", function() {
//         modal.css("display", "none");
//     });

//     $(window).on("click", function(event) {

//         if (event.target === modal[0]) {
//             modal.css("display", "none");
//         }
//     });
// });
