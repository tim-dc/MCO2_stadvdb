$(function(){
    var isoLevel;

    console.log("Reading Isolation Level:");
    isoLevel = $('#isolation-level').val();

    
    
    $('#run-case1').on('click', function() {
        isoLevel = $('#isolation-level').val();
  
        console.log("Running Case 1 with Isolation level - " + isoLevel);
    });

    $('#run-case2').on('click', function() {
        console.log("Running Case 2");
    });

    $('#run-case3').on('click', function() {
        console.log("Running Case 3");
    });




})