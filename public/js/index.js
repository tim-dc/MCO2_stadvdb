$(function(){
    var isoLevel;

    console.log("Reading Isolation Level:");
    isoLevel = $('#isolation-level').val();

    
    $('#run-case1').on('click', function() {
        isoLevel = $('#isolation-level').val();

        var inputIso = document.getElementById("iso-level-one");
        inputIso.setAttribute('value', isoLevel);

        console.log("Running Case 1 with Isolation level - " + isoLevel);

        var checkone = document.querySelector('#node1-switch').checked;
        var checktwo = document.querySelector('#node2-switch').checked;
        var checkthree = document.querySelector('#node3-switch').checked;

        var inputNode1 = document.getElementById("check-node-one");
        var inputNode2 = document.getElementById("check-node-two");
        var inputNode3 = document.getElementById("check-node-three");

        if(checkone)
        {        
            inputNode1.setAttribute('value', '1');
        }
        else
        {
            inputNode1.setAttribute('value', '0');
        }

        if(checktwo)
        {        
            inputNode2.setAttribute('value', '1');
        }
        else
        {
            inputNode2.setAttribute('value', '0');
        }

        if(checkthree)
        {        
            inputNode3.setAttribute('value', '1');
        }
        else
        {
            inputNode3.setAttribute('value', '0');
        }

    });

    $('#run-case2').on('click', function() {
        isoLevel = $('#isolation-level').val();
        var inputIso = document.getElementById("iso-level-two");
        inputIso.setAttribute('value', isoLevel);
        console.log("Running Case 2");
    });

    $('#run-case3').on('click', function() {
        isoLevel = $('#isolation-level').val();
        var inputIso = document.getElementById("iso-level-three");
        inputIso.setAttribute('value', isoLevel);
        console.log("Running Case 3");
    });




})