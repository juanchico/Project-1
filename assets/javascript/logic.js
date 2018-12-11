$(document).ready(function() {

    var cardplayed = $("#pCard1");
    var cardplayed1 = $("#oCard5");

    $("#pCard1").on("click", function() {
      cardplayed.animate({ top: "-=250px", left:"120px"  }, "normal");
      $("#oCard51").removeClass("card-body1");
      $("#oCard5").addClass("card-body");    
      cardplayed1.animate({ bottom: "-=213px", right:"120px"  }, "normal");
    });
});
$(document).ready(function() {

    var cardplayed2 = $("#pCard2");
    var cardplayed3 = $("#oCard4");

    $("#pCard2").on("click", function() {
      cardplayed2.animate({ top: "-=250px", left:"-=71px"  }, "normal");
      $("#oCard41").removeClass("card-body1");
      $("#oCard4").addClass("card-body");    
      cardplayed3.animate({ bottom: "-=213px", right:"-=71px"  }, "normal");
    
    });      
});
   
    $(document).ready(function() {

        var cardplayed4 = $("#pCard3");
        var cardplayed5 = $("#oCard3");
    
        $("#pCard3").on("click", function() {
          cardplayed4.animate({ top: "-=250px", left:"-=260px"  }, "normal");
          $("#oCard31").removeClass("card-body1");
          $("#oCard3").addClass("card-body");    
          cardplayed5.animate({ bottom: "-=213px", right:"-=260px"  }, "normal");
        }); 
    });
    
    $(document).ready(function() {

        var cardplayed6 = $("#pCard4");
        var cardplayed7 = $("#oCard2");
    
        $("#pCard4").on("click", function() {
          cardplayed6.animate({ top: "-=250px", left:"-=447px"  }, "normal");
          $("#oCard21").removeClass("card-body1");
          $("#oCard2").addClass("card-body");    
          cardplayed7.animate({ bottom: "-=213px", right:"-=447px"  }, "normal");
        }); 
    });
    

    $(document).ready(function() {
    var cardplayed8 = $("#pCard5");
    var cardplayed9 = $("#oCard1");

    $("#pCard5").on("click", function() {
      cardplayed8.animate({ top: "-=250px", left:"-=636px"  }, "normal");
      $("#oCard11").removeClass("card-body1");
      $("#oCard1").addClass("card-body");    
      cardplayed9.animate({ bottom: "-=213px", right:"-=636px"  }, "normal");
    });
});
