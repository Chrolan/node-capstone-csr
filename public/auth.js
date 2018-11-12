//Check to see verify token
function userAuth () {

    let token = sessionStorage.getItem('Bearer');

    $.ajax({
        type: 'GET',
        url: '/auth/api/protected',
        dataType: 'json',
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: function (data) {
            $('.float-name').html('Hi ' + data.username);
        },
        error: function (request, error) {
            console.log("Request: " + JSON.stringify(request));
            $(location).attr("href", "./index.html");
        }
    })
}

$(userAuth);


function logOutCustomer () {
    $('.logout-').submit(event => {

        event.preventDefault();

        sessionStorage.removeItem("Bearer")

        $(location).attr('href', pageName);

}

$(logOutCustomer);
