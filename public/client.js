//upon clicking of button, will search for submitted

function renderRequestItem (data) {
    return `<tr class="request-item">
                <td>${data.request.customerReferenceNumber}</td>
            </tr>`
}

function renderTableHeaders () {
    return `<table class="request-table">
                <tr class="table-headers">
                    <th>Customer Reference Number</th>
                </tr>
            </table>`
}

function displayList (data) {
    let listResults = data.requests.map((item,index) => renderRequestItem(item));
    //inserts the mapped items into requests list
    $('.content-box').html(renderTableHeaders);
    $('.table-headers').after(listResults);
    displayContent();
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

function displayContent () {
    $('.main').prop('hidden',false)
}

$(createMyRequestsPage);

