if(document.readyState == 'loading')
{
    document.addEventListener('DOMContentLoaded', ready)
}
else
{
    ready()
}

function ready(){
    var caseOneBtn = document.getElementsByClassName('caseOneBtn')

    console.log(caseOneBtn)

    caseOneBtn[0].addEventListener('click', displaySQLData, false);

}

function displaySQLData(event){
    let valid = true;

    if(valid){
        jQuery.post('/', function(result){
            location.reload(true);
            //console.log(result);
        });

        console.log("Hatdog");
    }
    else{

    }
}