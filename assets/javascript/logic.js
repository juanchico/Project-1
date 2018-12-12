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
var imdbIDs = ["tt0170016", "tt0314331", "tt0241527", "tt0319343", "tt0309987", "tt0338348", "tt0468569", "tt0120737", "tt1099212", "tt0367594", "tt0330373", "tt0377092", "tt0479143", "tt0304669", "tt0361748", "tt0477348", "tt0304141", "tt0167260", "tt1067106", "tt0317705", "tt0388419", "tt0454945", "tt0172495", "tt0409459", "tt0206634", "tt0482571", "tt0218967", "tt0307987", "tt0167261", "tt0486583", "tt0338013", "tt0416449", "tt0217869", "tt0401792", "tt0268978", "tt0110357", "tt0099785", "tt0111070", "tt0111161", "tt0110912", "tt0120338", "tt0108052", "tt0109830", "tt0104431", "tt0112573", "tt0099685", "tt0107290", "tt0133093", "tt0102926", "tt0118715", "tt0107688", "tt0137523", "tt0119217", "tt0118749", "tt0116282", "tt0114369", "tt0120815", "tt0117737", "tt0103874", "tt0102798", "tt0113277", "tt0119116", "tt0119303", "tt0114709", "tt0103064", "tt0117509", "tt0103639", "tt0097958", "tt0085334", "tt0089927", "tt0095560", "tt0093389", "tt0095016", "tt0093779", "tt0093058", "tt0088763", "tt0083658", "tt0093773", "tt0086250", "tt1213644", "tt0270846", "tt0060666", "tt0804492", "tt1316037", "tt0317676", "tt0417056", "tt0339034", "tt0362165", "tt0369226", "tt0185183", "tt0096870", "tt0299930", "tt01186653", "tt00933005", "tt03832227", "tt1883367", "tt0804452", "tt4877122", "tt0115624", "tt0110978", "tt1666186", "tt0120185", "tt0400426", "tt0795461", "tt5690360", "tt1411664", "tt0450345", "tt0119707", "tt0372873", "tt0897361", "tt0120179", "tt0157262", "tt0811138", "tt0111301", "tt0291502", "tt0180052", "tt0094824", "tt0926129", "tt0107978", "tt0108255", "tt0479968", "tt0806147", "tt2278388", "tt0091064", "tt0116629", "tt3501632", "tt3896198", "tt0362270", "tt0097257", "tt5463162", "tt7959026", "tt1571234", "tt7125860", "tt7297030", "tt8267604", "tt5848272", "tt2709692", "tt6343314", "tt4123430", "tt1727824", "tt7401588", "tt6966692", "tt4532826", "tt5734576", "tt4218572"];

var movieCards = [];
var movieName = [];
var movieTrailers = [];
var moviePosterURLs = [];
var cardValues = [];
var alreadySelected = [];
var titleChoice;
var ytPlayerSRC = "https://www.youtube.com/embed/";
var ytPlayerId;
var dbIndex = 0;
var numRound = 1;
var P1Score = 0;
var P2Score = 0;
var roundsLeft = 5 - numRound;
var numMovies;
var posterIndex = 0;

// Firebase Refs
var firebase = firebase.database();
var cardDeckRef = firebase.ref("/CardDeck");
var playersRef = firebase.ref("/Players");
var currentTurnRef = firebase.ref("/Turn");
var roundsRef = firebase.ref("/Rounds");
// var chatData = firebase.ref("/Chat");
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

function dealCardsP1() {

    // Remove Join Game Modal, Start Game, and Show Stats
    $("#modal-row").remove();
    $("#roundRem").html("Round: " + numRound + " / 5");
    $("#pWins").html(P1Score);
    $("#oWins").html(P2Score);
    $("#numLeft, #oWins, #pWins").css("visibility", "visible");

    for (var i = 1; i <= 5; i++) {

        var cardIMG = $("<img>").attr("src", moviePosterURLs[i - 1]);
        var cardValue1 = $("<h3>").text(cardValues[i - 1]).addClass("top-right");
        var cardValue2 = $("<h3>").text(cardValues[i - 1]).addClass("bottom-left");

        $("#card-bodyP" + i).attr("data-index", (i - 1)).addClass("gameCard");
        $("#card-bodyP" + i).html(cardIMG).append(cardValue1).append(cardValue2);

        $("#oCard" + i).css("display", "block");
        $("#pCard" + i).css("display", "block");
    }

    // dealCardsP2();
}
// Ensure Poster Array is in Harmony
function getMovieCount() {

    cardDeckRef.once("value").then(function(snapshot) {

        numMovies = snapshot.numChildren();
        console.log(numMovies);

        for (var i = 0; i < numMovies; i++) {

            getMovieSpecs(i);
        }
    });

    setTimeout(dealCardsP2, 1000);
}

function getMovieSpecs(index) {

    cardDeckRef.once("value").then(function(snapshot) {

        if (snapshot.val()[index].Poster === undefined) {
            console.log(snapshot.val()[index].Title);
        }
        else {
            moviePosterURLs.push(snapshot.val()[index].Poster);
            movieCards.push(snapshot.val()[index].Title.toLowerCase());
            movieName.push(snapshot.val()[index].Title);
            cardValues.push(snapshot.val()[index].Value);            
        }
    });
}


function dealCardsP2() {

        // Remove Join Game Modal, Start Game, and Show Stats
        $("#modal-row").remove();
        $("#roundRem").html("Round: " + numRound + " / 5");
        $("#pWins").html(P1Score);
        $("#oWins").html(P2Score);
        $("#numLeft, #oWins, #pWins").css("visibility", "visible");

    for (var i = 1; i <= 5; i++) {

        var cardIMG = $("<img>").attr("src", moviePosterURLs[i + 5]);
        var cardValue1 = $("<h3>").text(cardValues[i + 5]).addClass("top-right");
        var cardValue2 = $("<h3>").text(cardValues[i + 5]).addClass("bottom-left");

        $("#card-bodyP" + i).attr("data-index", (i + 5)).addClass("gameCard");
        $("#card-bodyP" + i).html(cardIMG).append(cardValue1).append(cardValue2);

        $("#oCard" + i).css("display", "block");
        $("#pCard" + i).css("display", "block");
    }
}

function nextRound() {

    numRound++;
    firebase.ref("/Round/" + numRound);

    // Deal Cards for Round
    for (var i = 1; i <= (5 * numRound); i++) {

    }
}

// ***************************************

// CARD CLICK FUNCTIONS
$(document).ready(function() {
   
    var cardplayed = $("#pCard1");
    var cardplayed1 = $("#oCard5");

    $("#pCard1").on("click", function() {

        if ($(".clicked") !== false) {
            $(".clicked").css( "zIndex", -10 );
            $(".clicked").animate({ top: "0px", left:"0px"  }, "normal");
        }

      cardplayed.animate({ top: "-=250px", left:"120px"  }, "normal");
      $("#oCard51").removeClass("card-body1");
      $("#oCard5").addClass("card-body");    
      cardplayed1.animate({ bottom: "-=213px", right:"120px"  }, "normal");
      $("#pCard1").addClass("clicked", true);
      $("#oCard5").addClass("clicked", true);
      
    });
});

$(document).ready(function() {
    
    var cardplayed2 = $("#pCard2");
    var cardplayed3 = $("#oCard4");

    $("#pCard2").on("click", function() {
        if ($(".clicked") !== false) {
            $(".clicked").css( "zIndex", -10 );
            $(".clicked").animate({ top: "0px", left:"0px"  }, "normal");
        }
      cardplayed2.animate({ top: "-=250px", left:"-=71px"  }, "normal");
      $("#oCard41").removeClass("card-body1");
      $("#oCard4").addClass("card-body");    
      cardplayed3.animate({ bottom: "-=213px", right:"-=71px"  }, "normal");
      $("#pCard2").addClass("clicked", true);
      $("#oCard4").addClass("clicked", true);
    });      
});
   
$(document).ready(function() {
       
    var cardplayed4 = $("#pCard3");
    var cardplayed5 = $("#oCard3");
    
    $("#pCard3").on("click", function() {
        if ($(".clicked") !== false) {
            $(".clicked").css( "zIndex", -10 );
            $(".clicked").animate({ top: "0px", left:"0px"  }, "normal");
        }
        cardplayed4.animate({ top: "-=250px", left:"-=260px"  }, "normal");
        $("#oCard31").removeClass("card-body1");
        $("#oCard3").addClass("card-body");    
        cardplayed5.animate({ bottom: "-=213px", right:"-=260px"  }, "normal");
        $("#pCard3").addClass("clicked", true);
        $("#oCard3").addClass("clicked", true);
    }); 
});
    
$(document).ready(function() {

    var cardplayed6 = $("#pCard4");
    var cardplayed7 = $("#oCard2");
    
    $("#pCard4").on("click", function() {
        if ($(".clicked") !== false) {
            $(".clicked").css( "zIndex", -10 );
            $(".clicked").animate({ top: "0px", left:"0px"  }, "normal");
        }
        cardplayed6.animate({ top: "-=250px", left:"-=447px"  }, "normal");
        $("#oCard21").removeClass("card-body1");
        $("#oCard2").addClass("card-body");    
        cardplayed7.animate({ bottom: "-=213px", right:"-=447px"  }, "normal");
        $("#pCard4").addClass("clicked", true);
        $("#oCard2").addClass("clicked", true);
    }); 
});
    

$(document).ready(function() {
    var cardplayed8 = $("#pCard5");
    var cardplayed9 = $("#oCard1");

    $("#pCard5").on("click", function() {
        if ($(".clicked") !== false) {
            $(".clicked").css( "zIndex", -10 );
            $(".clicked").animate({ top: "0px", left:"0px"  }, "normal");
        }
    cardplayed8.animate({ top: "-=250px", left:"-=636px"  }, "normal");
    $("#oCard11").removeClass("card-body1");
    $("#oCard1").addClass("card-body");    
    cardplayed9.animate({ bottom: "-=213px", right:"-=636px"  }, "normal");
    $("#pCard5").addClass("clicked", true);
    $("#oCard1").addClass("clicked", true);
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

        // dealCardsP1();
    }    
    else {
    // If No Player 2, Clear Win/Loss Data and Show Waiting
        $("#oName").text("Waiting for Player 2");
        $("#oScore").empty();
    }
});

// roundsRef.on("value", function(snapshot) {

//         console.log(snapshot.val());
        
        
// });

// Click Event for Cards Dealt
$(document).on("click", ".gameCard", function() {
    console.log(this);
  
    // Grabs "data-index" From Card Choice
    var clickChoice = $(this).attr("data-index");
    // console.log(playerRef);
    console.log(clickChoice);
  
    // Sets the Choice in the Current Player Object in Firebase
    playerRef.child("Choice").set(clickChoice);


  
    // Increment Turn -- Turn Values:
    // 1 - P1
    // 2 - P2
    // 3 - Determine Winner
    currentTurnRef.transaction(function(turn) {
      return turn + 1;
    });
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

                dealCardsP1();
            }
            else {
                // If Not Current Player's Turn, Update Text to Say Waiting
                $("#current-turn h2").text("Waiting for " + playerOneData.Name + " to play.");
            }
  
            // Highlight Active Player [[UPDATE STYLE if desired]]
            $("#player").css("filter", "invert(100%)");
            $("#opponent").css("filter", "invert(0%)");
        }
        else if (currentTurn === 2) {
            // If Current Player's Turn, Update Text
            if (currentTurn === playerNum) {
                $("#current-turn").text("It's Your Turn!");

                getMovieCount();
            }
            else {
                // If Not Current Player's Turn, Update Text to Say Waiting
                $("#current-turn").text("Waiting for " + playerTwoData.Name + " to play.");
            }
            
            // Highlight Active Player [[UPDATE STYLE if desired]]
            $("#opponent").css("filter", "invert(100%)");
            $("#player").css("filter", "invert(0%)");
        }
        else if (currentTurn === 3) {
            // Check for Win/Lose Game Logic and Reset Turn
            gameLogic(playerOneData.Choice, playerTwoData.Choice);
  
            // Reveal Player/Opp Choices [[PLAY TRAILER IN MODAL HERE?]]
    
            //  Reset After Timeout
            var moveOn = function() {
            $("#result").empty();
  
            // Check to Ensure Players Have Not Left Before Timeout
            if (playerOneExists && playerTwoExists) {
                currentTurnRef.set(1);
            }
        };
  
        //  Show Card Play Results for 3 Seconds
        setTimeout(moveOn, 1000 * 3);
    }
    else {
        $("#current-turn").html("<h2>Waiting for another player to join.</h2>");
        $(".oCards").css("display", "none");
        $(".pCards").css("display", "none");
    }
    }
});
  
// When Player Joins Game, Check for 2 Players. If Yes, "Start" Button Will Appear
playersRef.on("child_added", function(snapshot) {

    if (currentPlayers === 1) {
        // Set turn to 1
        currentTurnRef.set(1);
    }
});

// joinGame Function
function joinGame() {
 
    // var chatDataDisc = database.ref("/chat/" + Date.now());
  
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

        // Create DB Key Based on Current Round
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
  
        // Update Chatbox with Disconnect Message
        // chatDataDisc.onDisconnect().set({
        //     Name: username,
        //     Time: firebase.database.ServerValue.TIMESTAMP,
        //     Message: "has disconnected.",
        //     idNum: 0
        // });
    }
    else {
        // If Current Players is P2, New Player Can't Join
        alert("Game Lobby Full! Please Try Again Later!");
    }
}
  
// Game logic -- Displays Who Wins/Loses -- Increment Wins/Losses
function gameLogic(player1choice, player2choice) {

    var playerOneWon = function() {

        $("#result h2").text(playerOneData.Name + " Wins the Round!");

        if (playerNum === 1) {
            playersRef
            .child("1")
            .child("Score")
            .set(playerOneData.Score + 1);

            // playersRef
            // .child("2")
            // .child("losses")
            // .set(playerTwoData.losses + 1);
        }
    };

    var playerTwoWon = function() {

        $("#result h2").text(playerTwoData.Name + " Wins the Round!");

        if (playerNum === 2) {
            playersRef
            .child("2")
            .child("wins")
            .set(playerTwoData.Score + 1);

            // playersRef
            // .child("1")
            // .child("losses")
            // .set(playerOneData.losses + 1);
        }
    };

// Game Conditional Logic -- What happens at tie?
    var gameLogic = function() {

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
// $(document).on("click", "#gameStart", function() {
    
//     dealCards();

//     // Create DB Key Based on Assigned Player Number
//     playerRef = firebase.ref("/Players/" + playerNum);

//     // Create Player Object
//     playerRef.set({
//     Name: username,
//     Score: 0
//     });

// });

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

// Chatbox Input Listener
// $("#chat-input").keypress(function(event) {
    
//     if (event.which === 13 && $("#chat-input").val() !== "") {

//         var message = $("#chat-input").val();
  
//         chatData.push({
//         Name: username,
//         Message: message,
//         Time: firebase.database.ServerValue.TIMESTAMP,
//         idNum: playerNum
//     });
  
//       $("#chat-input").val("");
//     }
// });

// Update Chat on Modal @ New Message Detected - Ordered by 'Time' Value
// chatData.orderByChild("time").on("child_added", function(snapshot) {
//     $("#chat-messages").append(
//       $("<p>").addClass("player-" + snapshot.val().idNum),
//       $("<span>").text(snapshot.val().name + ":" + snapshot.val().message)
//     );
  
//     // Keeps div Scrolled to Bottom
//     $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
// });
