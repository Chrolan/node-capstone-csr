function checkIfLoggedIn () {
    let token = sessionStorage.getItem('Bearer');

    if (token != undefined) {
        $(location).attr('href', "./home.html");
    }
}

$(checkIfLoggedIn)


//set of functions to register user account
function registerUser () {
    $('.register-form').submit(event => {

        event.preventDefault();

        const registrationInfo = {
            username: $('#username').val(),
            password:$('#password').val(),
            confirmPassword: $('#confirm-password').val(),
            firstName:$('#first-name').val(),
            lastName: $('#last-name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            companyName:$('#company-name').val(),
            typeOfUser:$('#user-type').val()
        };

        if(!(registrationInfo.password == registrationInfo.confirmPassword)) {
            console.log(registrationInfo);
            $('.js-registration-comment-box').html('<span class="notification-message">Passwords do not match, please correct to register!</span>');
            unhideRegistrationCommentBox();
            }
        else {
           $.ajax({
               url : "/users",
               dataType: "json",
               type: 'POST',
               contentType : "application/json",
               data: JSON.stringify(registrationInfo)
            })
               .then(registrationSuccessful)
               .catch(registrationFailed)
        }
})};


function registrationSuccessful() {
    $('.js-registration-comment-box').html('<span class="notification-message">Account successfully created, click <a href="./login.html">here</a> to log in.</span>');
    unhideRegistrationCommentBox();
}

function registrationFailed () {
    $('.js-registration-comment-box').text(error.responseJSON.message);
    unhideRegistrationCommentBox();
}

function unhideRegistrationCommentBox() {
    $('.js-registration-comment-box').prop('hidden', false);
}

$(registerUser);

//set of functions to log user into system

function logInCustomer () {
    $('.login-form').submit(event => {

        event.preventDefault();

        const user = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        $.ajax({
            url: "/auth/login",
            dataType: "json",
            type: 'POST',
            contentType : "application/json",
            data: JSON.stringify(user)
        })
            .then(data => {
                let jwt = data.authToken;
                sessionStorage.setItem('Bearer',jwt);
                const pageName = "./home.html";
                $(location).attr('href', pageName);
            })
            .catch(err => {
                $('.error-message').html('<span class="notification-message">Username and/or Password is incorrect</span>');
                $('.error-message').prop('hidden',false);
            })
    })
}

$(logInCustomer);

//set of functions to log user out of system