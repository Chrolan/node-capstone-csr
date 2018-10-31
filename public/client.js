//upon clicking of button, will search for submitted

function 

function getMyRequests (clientSideData) {

    $.ajax({
        url: "/requests",
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(clientSideData)
    })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
}




