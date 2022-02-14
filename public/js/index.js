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

        var checkone = document.querySelector('#node1-switch').checked;
        var checktwo = document.querySelector('#node2-switch').checked;
        var checkthree = document.querySelector('#node3-switch').checked;

        var inputNode1 = document.getElementById("c2-check-node-one");
        var inputNode2 = document.getElementById("c2-check-node-two");
        var inputNode3 = document.getElementById("c2-check-node-three");

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

    $('#run-case3').on('click', function() {
        isoLevel = $('#isolation-level').val();
        var inputIso = document.getElementById("iso-level-three");
        inputIso.setAttribute('value', isoLevel);
        console.log("Running Case 3");

        var checkone = document.querySelector('#node1-switch').checked;
        var checktwo = document.querySelector('#node2-switch').checked;
        var checkthree = document.querySelector('#node3-switch').checked;

        var inputNode1 = document.getElementById("c3-check-node-one");
        var inputNode2 = document.getElementById("c3-check-node-two");
        var inputNode3 = document.getElementById("c3-check-node-three");

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

    $('#run-case4').on('click', function(){
        isoLevel = $('#isolation-level').val();
        var inputIso = document.getElementById("iso-level-four");
        inputIso.setAttribute('value', isoLevel);
        console.log("Running Case 4");

        var checkone = document.querySelector('#node1-switch').checked;
        var checktwo = document.querySelector('#node2-switch').checked;
        var checkthree = document.querySelector('#node3-switch').checked;

        var inputNode1 = document.getElementById("c4-check-node-one");
        var inputNode2 = document.getElementById("c4-check-node-two");
        var inputNode3 = document.getElementById("c4-check-node-three");

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

    $('#run-case5').on('click', function(){
        isoLevel = $('#isolation-level').val();
        var inputIso = document.getElementById("iso-level-five");
        inputIso.setAttribute('value', isoLevel);
        console.log("Running Case 5");

        var checkone = document.querySelector('#node1-switch').checked;
        var checktwo = document.querySelector('#node2-switch').checked;
        var checkthree = document.querySelector('#node3-switch').checked;

        var inputNode1 = document.getElementById("c5-check-node-one");
        var inputNode2 = document.getElementById("c5-check-node-two");
        var inputNode3 = document.getElementById("c5-check-node-three");

        if(checkone)
        {        
            inputNode1.setAttribute('value', '1');
        }
        else
        {
            inputNode1.setAttribute('value', '0');
        }

  
    });

    $('#run-case6').on('click', function(){
        isoLevel = $('#isolation-level').val();
        var inputIso = document.getElementById("iso-level-six");
        inputIso.setAttribute('value', isoLevel);
        console.log("Running Case 6");

        var checkone = document.querySelector('#node1-switch').checked;
        var checktwo = document.querySelector('#node2-switch').checked;
        var checkthree = document.querySelector('#node3-switch').checked;

        var inputNode1 = document.getElementById("c6-check-node-one");
        var inputNode2 = document.getElementById("c6-check-node-two");
        var inputNode3 = document.getElementById("c6-check-node-three");

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

    $('#run-case7').on('click', function(){
        isoLevel = $('#isolation-level').val();
        var inputIso = document.getElementById("iso-level-seven");
        inputIso.setAttribute('value', isoLevel);
        console.log("Running Case 7");

        var checkone = document.querySelector('#node1-switch').checked;
        var checktwo = document.querySelector('#node2-switch').checked;
        var checkthree = document.querySelector('#node3-switch').checked;

        var inputNode1 = document.getElementById("c7-check-node-one");
        var inputNode2 = document.getElementById("c7-check-node-two");
        var inputNode3 = document.getElementById("c7-check-node-three");

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
    })
})