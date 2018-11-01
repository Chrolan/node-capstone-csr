//upon clicking of button, will search for submitted

function renderRequestItem () {
    return `<tr class="request-item">
                <td>${data.request.customer}</td>
            </tr>`
}

function displayList (data) {
    let listResults = data.requests.map((item,index) => renderRequestItem(item));
    //inserts the mapped items into requests list
    $('.content-box').html(listResults);
}

function renderError () {
    return `<span class="error-message">Oops! You may have typed in your location in wrong, try again!<br>Tip: Remember to use City, State in combination!</span>`
}

function getMyRequests () {
    $.ajax({
        url:"/requests/user-requests",
        dataType:"json",
        contentType: "application/json",
        type: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
        }
    })
        .then(data => {
            console.log(data);
            displayList(data)
        })
        .catch(err => {
            console.log(err);
        })
}

function createMyRequestsPage () {
    $('#my-requests-button').on('click', event => {
        event.preventDefault();
        getMyRequests();
    })
}

$(createMyRequestsPage);

