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
var imdbIDs = ["tt0170016", "tt0314331", "tt0241527", "tt0319343", "tt0309987", "tt0338348", "tt0468569", "tt0120737", "tt1099212", "tt0367594", "tt0330373", "tt0377092", "tt0479143", "tt0304669", "tt0361748", "tt0477348", "tt0304141", "tt0167260", "tt1067106", "tt0317705", "tt0388419", "tt0454945", "tt0172495", "tt0409459", "tt0206634", "tt0482571", "tt0218967", "tt0307987", "tt0167261", "tt0486583", "tt0338013", "tt0416449", "tt0217869", "tt0401792", "tt0268978", "tt0099785", "tt0111070", "tt0111161", "tt0110912", "tt0120338", "tt0108052", "tt0109830", "tt0104431", "tt0112573", "tt0099685", "tt0107290", "tt0133093", "tt0102926", "tt0118715", "tt0107688", "tt0137523", "tt0119217", "tt0118749", "tt0116282", "tt0114369", "tt0120815", "tt0117737", "tt0103874", "tt0102798", "tt0113277", "tt0119116", "tt0119303", "tt0114709", "tt0103064", "tt0117509", "tt0103639", "tt0097958", "tt0085334", "tt0089927", "tt0095560", "tt0093389", "tt0095016", "tt0093779", "tt0093058", "tt0088763", "tt0083658", "tt0093773", "tt0086250", "tt1213644", "tt0270846", "tt0060666", "tt0804492", "tt1316037", "tt0317676", "tt0417056", "tt0339034", "tt0362165", "tt0369226", "tt0185183", "tt0096870", "tt0299930", "tt01186653", "tt00933005", "tt03832227", "tt1883367", "tt0804452", "tt4877122", "tt0115624", "tt0110978", "tt1666186", "tt0120185", "tt0400426", "tt0795461", "tt5690360", "tt1411664", "tt0450345", "tt0119707", "tt0372873", "tt0897361", "tt0120179", "tt0157262", "tt0811138", "tt0111301", "tt0291502", "tt0180052", "tt0094824", "tt0926129", "tt0107978", "tt0479968", "tt0806147", "tt2278388", "tt0091064", "tt0116629", "tt3501632", "tt3896198", "tt0362270", "tt0097257", "tt5463162", "tt7959026", "tt1571234", "tt7125860", "tt7297030", "tt8267604", "tt5848272", "tt2709692", "tt6343314", "tt4123430", "tt1727824", "tt7401588", "tt6966692", "tt4532826", "tt5734576", "tt4218572"];

var movieCards = [];
var movieName = [];
var moviePosterURLs = [];
var cardValues = [];
var alreadySelected = [];
var titleChoice;
var ytPlayerSRC = "https://www.youtube.com/embed/";
var ytPlayerId;
var dbIndex = 0;
var numRound = 0;
var P1Score = 0;
var P2Score = 0;
var roundsLeft = 3 - numRound;
var numMovies;
var tieGame = false;
var cardsPlayed;
var winsP1 = 0;
var winsP2 = 0;
var lossesP1 = 0;
var lossesP2 = 0;

// Firebase Refs
var firebase = firebase.database();
var cardDeckRef = firebase.ref("/CardDeck");
var playersRef = firebase.ref("/Players");
var currentTurnRef = firebase.ref("/Turn");
var cardsPlayedRef = firebase.ref("/CardsPlayed");
var username = "Guest";
var currentPlayers = null;
var currentTurn = null;
var playerNum = false;
var playerOneExists = false;
var playerTwoExists = false;
var playerOneData = null;
var playerTwoData = null;

// Animated Card Variables
var cardplayed;
var cardplayed1;
var cardplayed2;
var cardplayed3;
var cardplayed4;
var cardplayed5;
var cardplayed6;
var cardplayed7;
var cardplayed8;
var cardplayed9;

// ***************************************

// FUNCTIONS & API CALLS (OMDB)

function pullCards() {

    for (var i = 0;  i < 60; i++) {
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
        var cardValue = parseFloat(data.imdbRating) * 10;

        var moviePlot = data.Plot;
        var movieActors = data.Actors;
        var movieRated = data.Rated;
        var movieRuntime = data.Runtime.substring(0,3);
        var movieRelease = data.Released;

        movieRef = firebase.ref("/CardDeck/" + dbIndex);
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
            cardValues.push(cardValue);
        }
    });
}

// FUNCTIONS & API CALLS (YouTube)

function pullTrailer(movie) {

    $("#youtube").css("background-image", "none");

    console.log(movie);

    var keyYouTube = "AIzaSyAGgOJzbjOxlwnCxoTjgLog-j9mbFCQm4o";
    var queryYouTube = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=" + keyYouTube + "&q=" + movie + "official+movie+trailer";

    $.ajax({
        url: queryYouTube,
        method: "GET"
    }).then(function(data) {

        var trailer = data.items[0];
        var trailerVideoID = trailer.id.videoId;
            ytPlayerID = trailerVideoID

        var youTubeVideo = $("<iframe>").attr("id", "trailerVideo").attr("src", ytPlayerSRC + ytPlayerID);

        $("#youtube").html(youTubeVideo);
    });
}

function dealCardsP1() {

    // Remove Join Game Modal, Start Game, and Show Stats
    $("#modal-row").hide();
    $("#roundRem").html("Rounds Played: " + numRound);
    $("#pWins").html("W: " + winsP1);
    $("#oWins").html("L: " + lossesP1);
    $("#numLeft, #oWins, #pWins").css("visibility", "visible");

    if (numRound > 1) {

        $("#pWins").html("+ " + playerOneData.RoundWins);
        $("#oWins").html("+ " + playerTwoData.RoundWins);
    }

    for (var i = 1; i <= 5; i++) {

        var cardIMG = $("<img>").attr("src", moviePosterURLs[i - 1]);
        var cardValue1 = $("<h3>").text(cardValues[i - 1]).addClass("top-right");
        var cardValue2 = $("<h3>").text(cardValues[i - 1]).addClass("bottom-left");

        $("#card-bodyP" + i).attr("data-index", (i - 1)).addClass("gameCard");
        $("#card-bodyP" + i).html(cardIMG).append(cardValue1).append(cardValue2);

        $("#oCard" + i).css("display", "block");
        $("#pCard" + i).css("display", "block");
    }
}
// Ensure Poster Array is in Harmony
function getMovieCount() {

    cardDeckRef.once("value").then(function(snapshot) {

        numMovies = snapshot.numChildren();
        console.log("CHILD COUNT: " + numMovies);
        console.log(snapshot.val());

        
        for (var i = 0; i < numMovies; i++) {
            if (snapshot.val()[i] !== undefined) {
                    
                moviePosterURLs.push(snapshot.val()[i].Poster);
                movieCards.push(snapshot.val()[i].Title.toLowerCase());
                movieName.push(snapshot.val()[i].Title);
                cardValues.push(snapshot.val()[i].Value);  
            }
        }

        dealCardsP2();
    });
}

function dealCardsP2() {

        // Remove Join Game Modal, Start Game, and Show Stats
        $("#modal-row").hide();
        $("#roundRem").html("Rounds Played: " + numRound);
        $("#pWins").html("W: " + winsP2);
        $("#oWins").html("L: " + lossesP2);
        $("#numLeft, #oWins, #pWins").css("visibility", "visible");


        if (numRound > 1) {

            $("#pWins").html("+ " + playerOneData.RoundWins);
            $("#oWins").html("+ " + playerTwoData.RoundWins);
        }

    for (var i = 1; i <= 5; i++) {

        var cardIMG = $("<img>").attr("src", moviePosterURLs[i + 4]);
        var cardValue1 = $("<h3>").text(cardValues[i + 4]).addClass("top-right");
        var cardValue2 = $("<h3>").text(cardValues[i + 4]).addClass("bottom-left");

        $("#card-bodyP" + i).attr("data-index", (i + 4)).addClass("gameCard");
        $("#card-bodyP" + i).html(cardIMG).append(cardValue1).append(cardValue2);

        $("#oCard" + i).css("display", "block");
        $("#pCard" + i).css("display", "block");
    }
}

// ***************************************

// CARD CLICK FUNCTIONS
$(document).ready(function() {
   
    cardplayed = $("#pCard1");
    cardplayed1 = $("#oCard5");

    $("#pCard1").on("click", function() {

        cardplayed.animate({top: "-=250px", left:"120px"}, "normal"); 
        cardplayed1.animate({bottom: "-=213px", right:"120px"}, "normal");
        $("#pCard1").addClass("clicked").attr("data-status", "played");
        $("#oCard5").addClass("clicked").attr("data-status", "played");
      
    });
});

$(document).ready(function() {
    
    cardplayed2 = $("#pCard2");
    cardplayed3 = $("#oCard4");

    $("#pCard2").on("click", function() {

        cardplayed2.animate({top: "-=250px", left:"-=71px"}, "normal");  
        cardplayed3.animate({bottom: "-=213px", right:"-=71px"}, "normal");
        $("#pCard2").addClass("clicked").attr("data-status", "played");
        $("#oCard4").addClass("clicked").attr("data-status", "played");
    });      
});
   
$(document).ready(function() {
       
    cardplayed4 = $("#pCard3");
    cardplayed5 = $("#oCard3");
    
    $("#pCard3").on("click", function() {

        cardplayed4.animate({top: "-=250px", left:"-=260px"}, "normal");
        cardplayed5.animate({bottom: "-=213px", right:"-=260px"}, "normal");
        $("#pCard3").addClass("clicked").attr("data-status", "played");
        $("#oCard3").addClass("clicked").attr("data-status", "played");
    }); 
});
    
$(document).ready(function() {

    cardplayed6 = $("#pCard4");
    cardplayed7 = $("#oCard2");
    
    $("#pCard4").on("click", function() {

        cardplayed6.animate({top: "-=250px", left:"-=447px"}, "normal");
        cardplayed7.animate({bottom: "-=213px", right:"-=447px"}, "normal");
        $("#pCard4").addClass("clicked").attr("data-status", "played");
        $("#oCard2").addClass("clicked").attr("data-status", "played");
    }); 
});
    

$(document).ready(function() {
    cardplayed8 = $("#pCard5");
    cardplayed9 = $("#oCard1");

    $("#pCard5").on("click", function() {

        cardplayed8.animate({top: "-=250px", left:"-=636px"}, "normal");
        cardplayed9.animate({bottom: "-=213px", right:"-=636px"}, "normal");
        $("#pCard5").addClass("clicked").attr("data-status", "played");
        $("#oCard1").addClass("clicked").attr("data-status", "played");
    });
});

// ***************************************

// GAME / PAGE LOGIC

// Listeners for Usernames
$(document).on("click", "#join", function() {

    if ($("#username").val() !== "") {

        username = capitalize($("#username").val());
        console.log(username);
        joinGame();
    }
});

// 'Enter' for Username Input
$(document).on("keypress", "#username", function(event) {

    if (event.which === 13 && $("#username").val() !== "") {

        username = capitalize($("#username").val());
        console.log(username);
        joinGame();
    }
});

// Capitalize Usernames
function capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

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

    // If player 1 Exists, Populate Name and Score
    if (playerOneExists) {
        $("#pName").text(playerOneData.Name);
        $("#pScore").text("+ " + playerOneData.Score);
    }
    else {
    // If No Player 1, Clear Win/Loss Data and Show Waiting
        $("#pName").text("Waiting for Player 1");
        $("#pScore").empty();
    }

    // If player 2 Exists, Populate Name and Score and Start Game
    if (playerTwoExists) {
        $("#oName").text(playerTwoData.Name);
        $("#oScore").text("+ " + playerTwoData.Score);
        playersRef.child("2").child("RoundWins").set(0);
    }    
    else {
    // If No Player 2, Clear Win/Loss Data and Show Waiting
        $("#oName").text("Waiting for Player 2");
        $("#oScore").empty();
    }
});

// Click Event for Cards Dealt
$(document).on("click", ".gameCard", function() {
  
    // Grabs "data-index" From Card Choice
    var clickIndex = $(this).attr("data-index");
    var clickChoice = cardValues[clickIndex];
    $(this).attr("data-status", "played");
    // console.log(playerRef);
    console.log(clickChoice);
  
    // Sets the Choice in the Current Player Object in Firebase
    playerRef.child("Choice").set(clickChoice);
    playerRef.child("ChoiceIndex").set(clickIndex);

    pullTrailer(movieCards[clickIndex]);
  
    // Increment Turn -- Turn Values:
    // 1 - P1
    // 2 - P2
    // 3 - Determine Winner
    currentTurnRef.transaction(function(turn) {
      return turn + 1;
    });

    cardsPlayedRef.transaction(function(CardsPlayed) {
        return CardsPlayed + 1;
    });
});

cardsPlayedRef.on("value", function(snapshot) {
    cardsPlayed = snapshot.val();
    // cardsPlayed += 1;
});

// Detect Changes in Current Turn DB Key
currentTurnRef.on("value", function(snapshot) {
    // Pull Current Turn
    currentTurn = snapshot.val();
  
    // Following Won't Trigger Unless Logged In
    if (playerNum) {

        if (currentTurn === 2 && playerNum === 1) {
            // If Not Current Player's Turn, Update Text to Say Waiting
            $("#modal-row").show();
            $(".modal-content").attr("class", "modal-content-playing");

            $("#joinGame").empty();

            $("#joinGame").append($("<h4>").html("Waiting for " + playerTwoData.Name + " to Play...<hr>"));
            $("#joinGame").append($("<img>").attr("src", "assets/images/loading.gif"));
        }

        else if (currentTurn === 1 && playerNum === 2) {
            $("#modal-row").show();
            $(".modal-content").attr("class", "modal-content-playing");

            $("#joinGame").empty();

            $("#joinGame").append($("<h4>").html("Waiting for " + playerOneData.Name + " to Play...<hr>"));
            $("#joinGame").append($("<img>").attr("src", "assets/images/loading.gif"));
        }

        // Turn 1
        if (currentTurn === 1) {
            // If Current Player's Turn, Update Text
            if (currentTurn === playerNum) {

                dealCardsP1();
            }
  
            // Highlight Active Player
            $("#player").css("filter", "invert(100%)");
            $("#opponent").css("filter", "invert(0%)");
        }

        else if (currentTurn === 2) {
            // If Current Player's Turn, Update Text
            if (currentTurn === playerNum) {

                getMovieCount();
            }            
            // Highlight Active Player
            $("#opponent").css("filter", "invert(100%)");
            $("#player").css("filter", "invert(0%)");
        }

        else if (currentTurn === 3) {
            // Check for Win/Lose Game Logic and Reset Turn
            gameLogic(playerOneData.Choice, playerTwoData.Choice);

            //  Reset After Timeout
            var moveOn = function() {

                $(".clicked").css("visibility", "hidden");
  
                // Check to Ensure Players Have Not Left Before Timeout
                if (playerOneExists && playerTwoExists) {
                    currentTurnRef.set(1);
                }
                    gameCheck();
            };
  
            //  Show Card Play Results for 3 Seconds
            if (cardsPlayed < 10) {
                setTimeout(moveOn, 1000 * 3);
            }
        }
        else {

            $("#modal-row").show();
            $(".modal-content").attr("class", "modal-content-playing");
            $("#joinGame").empty();

            $("#joinGame").html("<h3>Your oppoent has left the game.</h3>");
            $(".oCards").css("display", "none");
            $(".pCards").css("display", "none");

            setTimeout(restart, 1000 * 2);
        }
    }
});
  
// When Player Joins Game, Check for 2 Players.
playersRef.on("child_added", function(snapshot) {

    if (currentPlayers === 1) {
        // Set turn to 1
        currentTurnRef.set(1);
    }
});

// joinGame Function
function joinGame() {
   
    // If P1 Exists, Joining Player is P2 -- Else, P1 is P1
    if (currentPlayers < 2) {
        if (playerOneExists) {
            playerNum = 2;

            // Remove Name Entry Box and Update with Waiting for P1 to Play
            $("#joinGame").empty();
            $("#username").hide();
            $("#join").hide();

            $("#joinGame").append($("<p>").text("Hi " + username + "! You are Player " + playerNum));
            $("#joinGame").append($("<h4>").text("Waiting for " + playerOneData.Name + " to Play..."));
            $("#joinGame").append($("<img>").attr("src", "assets/images/loading.gif"));
        }
        else {
            playerNum = 1;

            // Remove Name Entry Box and Update with Waiting for P2
            $("#joinGame").empty();
            $("#username").hide();
            $("#join").hide();
            
            $("#joinGame").append($("<p>").text("Hi " + username + "! You are Player " + playerNum));
            $("#joinGame").append($("<h4>").text("Waiting for Player 2 to Join Game..."));
            $("#joinGame").append($("<img>").attr("src", "assets/images/loading.gif"));
                
            // Populate Card Deck if First Player
            pullCards();
        }
  
        // Create DB Key Based on Assigned Player Number
        playerRef = firebase.ref("/Players/" + playerNum);
  
        // Create Player Object
        playerRef.set({
            Name: username,
            Score: 0
        });

        // Create DB Key Round Results
        roundRef = firebase.ref("/Round/" + numRound);
        roundRef.set({
            P1Score: P1Score,
            P2Score: P2Score,
            RoundsRem: roundsLeft
        });
  
        // On Disconnect, Erase Player Object
        playerRef.onDisconnect().remove();

        // If Disconnect, Set Turn to Null
        currentTurnRef.onDisconnect().remove();

        // If Disconnect, Clear Card Deck
        cardDeckRef.onDisconnect().remove();

        // If Disconnect, Clear Round
        roundRef.onDisconnect().remove();

        // On Disconnect, Clear Cards Played
        cardsPlayedRef.onDisconnect().remove();
    }
    else {
        // If Current Players is P2, New Player Can't Join
        alert("Game Lobby Full! Please Try Again Later!");
    }
}
  
// Game logic -- Displays Who Wins/Loses -- Increment Wins/Losses
function gameLogic(player1choice, player2choice) {

    var playerOneWon = function() {

        $("#modal-row").show();
        $(".modal-content").attr("class", "modal-content-playing");
        $("#joinGame").empty();

        $("#joinGame").append($("<h4>").html("WINNER!<hr>"));
        $("#joinGame").append($("<h3>").html(playerOneData.Name));

        if (tieGame === true && playerNum === 1) {
            playersRef.child("1").child("Score").set(playerOneData.Score + 2);
   
            tieGame = false;
        }
        else if (tieGame === false && playerNum ===1) {
            playersRef.child("1").child("Score").set(playerOneData.Score + 1);

        }

        flipCard();
    };

    var playerTwoWon = function() {

        $("#modal-row").show();
        $(".modal-content").attr("class", "modal-content-playing");
        $("#joinGame").empty();

        $("#joinGame").append($("<h4>").html("WINNER!<hr>"));
        $("#joinGame").append($("<h3>").html(playerTwoData.Name));

        if (tieGame === true && playerNum === 2) {
            playersRef.child("2").child("Score").set(playerTwoData.Score + 2);

            tieGame = false;
        }
        else if (tieGame === false && playerNum === 2) {
            playersRef.child("2").child("Score").set(playerTwoData.Score + 1);

        }

        flipCard();
        
    };

    // Game Conditional Logic -- What happens at tie?
    var tie = function() {

        tieGame = true;

        $("#modal-row").show();
        $(".modal-content").attr("class", "modal-content-playing");
        $("#joinGame").empty();

        $("#joinGame").append($("<h3>").html("It's a tie!<hr>"));
        $("#joinGame").append($("<h4>").html("Next card is worth 2 points!"));

        flipCard();

    };

    if (player1choice === player2choice) {

        tie();
        setTimeout(gameCheck, 1000);
    }

    else if (player1choice < player2choice) {

        playerTwoWon();
        setTimeout(gameCheck, 1000);
    }

    else if (player1choice > player2choice) {

        playerOneWon();
        setTimeout(gameCheck, 1000);
    }
}

function flipCard() {

    if (playerNum === 1) {

        var cardIMG = $("<img>").attr("src", moviePosterURLs[playerTwoData.ChoiceIndex]);
        var cardValue1 = $("<h3>").text(cardValues[playerTwoData.ChoiceIndex]).addClass("top-right");
        var cardValue2 = $("<h3>").text(cardValues[playerTwoData.ChoiceIndex]).addClass("bottom-left");

        $(".oCards > .clicked").html(cardIMG).append(cardValue1).append(cardValue2);
    }
    else if (playerNum === 2) {

        var cardIMG = $("<img>").attr("src", moviePosterURLs[playerOneData.ChoiceIndex]);
        var cardValue1 = $("<h3>").text(cardValues[playerOneData.ChoiceIndex]).addClass("top-right");
        var cardValue2 = $("<h3>").text(cardValues[playerOneData.ChoiceIndex]).addClass("bottom-left");

        $(".oCards > .clicked").html(cardIMG).append(cardValue1).append(cardValue2);
    }
}

function resetGame() {

    movieCards = [];
    movieName = [];
    moviePosterURLs = [];
    cardValues = [];
    alreadySelected = [];
    dbIndex = 0;

    currentTurnRef.set(1);
    cardsPlayedRef.set(0);
    playersRef.child("1").child("Score").set(0);
    playersRef.child("2").child("Score").set(0);

    setTimeout(pullCards, 1000 * 1);
    setTimeout(dealCardsP1, 2);
    setTimeout(getMovieCount, 1000 * 3);
    setTimeout(replaceCards, 1000 * 3);

}

function gameCheck() {

    if (cardsPlayed === 10) {

        if (playerOneData.Score > playerTwoData.Score) {
            $(".clicked").css("visibility", "hidden");

            $("#modal-row").show();
            $(".modal-content").attr("class", "modal-content-playing");
            $("#joinGame").empty();
        
            $("#joinGame").append($("<h2>").html("WINNER!<hr>"));
            $("#joinGame").append($("<h3>").html(playerOneData.Name + " wins the Game!"));

            flipCard();
            playerOneData.RoundWins++;

            numRound++;
            winsP1++;
            lossesP2++;

            setTimeout(restart, 1000 * 3);
        }
        else if (playerOneData.Score < playerTwoData.Score) {
            $(".clicked").css("visibility", "hidden");

            $("#modal-row").show();
            $(".modal-content").attr("class", "modal-content-playing");
            $("#joinGame").empty();
        
            $("#joinGame").append($("<h2>").html("WINNER!<hr>"));
            $("#joinGame").append($("<h3>").html(playerTwoData.Name + " wins the Game!"));

            flipCard();
            playerTwoData.RoundWins++;

            numRound++;
            winsP2++;
            lossesP1++;

            setTimeout(restart, 1000 * 3);
        }
        else if (playerOneData.Score === playerTwoData.Score) {
            $(".clicked").css("visibility", "hidden");

            $("#modal-row").show();
            $(".modal-content").attr("class", "modal-content-playing");
            $("#joinGame").empty();
        
            $("#joinGame").append($("<h2>").html("It's a TIE!<hr>"));
            $("#joinGame").append($("<h3>").html("High 5's All Around!"));

            flipCard();
            playerOneData.RoundWins++;
            playerTwoData.RoundWins++;

            numRound++;
            winsP1++;
            winsP2++;

            setTimeout(restart, 1000 * 3);
        }
    }
};

// Replace Cards
function replaceCards() {

    cardplayed.css({"top": "0", "left": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "");
    cardplayed1.css({"bottom": "0", "right": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "").html("<img src='assets/images/img-7-1.png'/>");
    cardplayed2.css({"top": "0", "left": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "");
    cardplayed3.css({"bottom": "0", "right": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "").html("<img src='assets/images/img-7-1.png'/>");
    cardplayed4.css({"top": "0", "left": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "");
    cardplayed5.css({"bottom": "0", "right": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "").html("<img src='assets/images/img-7-1.png'/>");
    cardplayed6.css({"top": "0", "left": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "");
    cardplayed7.css({"bottom": "0", "right": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "").html("<img src='assets/images/img-7-1.png'/>");
    cardplayed8.css({"top": "0", "left": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "");
    cardplayed9.css({"bottom": "0", "right": "0", "visibility": "visible"}).removeClass("clicked").attr("data-status", "").html("<img src='assets/images/img-7-1.png'/>");
}

// Reset Page
function restart() {

    location.reload();
}