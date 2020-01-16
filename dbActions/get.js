// for retrieving leaderboard scores
function getScores() {
    console.log("boobs")
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = "";

    // var requestOptions = {
    //     method: 'GET',
    //     headers: myHeaders,
    //     // body: raw,
    //     redirect: 'follow'
    // };

    fetch("localhost:3000/players?lim=10")
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function getScores1(){
    var settings = {
        "url": "localhost:3000/players",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}