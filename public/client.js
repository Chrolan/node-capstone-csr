
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

        console.log(registrationInfo);

        if(!(newUser.password == newUser.confirmPassword)) {
            $('.js-registration-comment-box').html('<span class="registration-message">Passwords do not match, please correct</span>');
            $('.js-registration-comment-box').prop('hidden', false);
            }
        else {
           $.ajax({
               url : '/users/',
               type: 'POST',
               contentType : 'application/json',
               data: JSON.stringify(registrationInfo)
            })
               .then(registrationSuccessful)
               .catch(registrationFailed)
        }
})};


function registrationSuccessful() {
    $('.js-registration-comment-box').html('Account successfully created, click <a href="./login.html">here</a> to log in."');
}

function registrationFailed () {
    $('.js-registration-comment-box').text(error.responseJSON.message);
}

registerUser();
