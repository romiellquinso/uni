//postman - for adding players and their scores
function postScore() {
    console.log("boo")
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var username = player;
    var score = document.getElementById("display");

    var raw = JSON.stringify({ "username": username, "score": score });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("localhost:3000/players", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function testScore() {
    console.log("boobies");
    var settings = {
        "url": "localhost:3000/players",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({ "username": "hermione", "score": "4542134234" }),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}