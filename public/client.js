//upon clicking of 'my requests' hyperlink, will search for submitted requests and return in table format

function renderRequestItem (data) {

    const submitDate = new Date(parseInt(data.request.formSubmitDate)).toString();
    const newDate = submitDate.substr(0,15);

    return `<tr class="request-item">
                <td>${newDate}</td>
                <td>${data.request.customerReferenceNumber}</td>
                <td>${data.request.customerCompanyName}</td>
                <td>${data.request.service.customer.customerName.lastName} , ${data.request.service.customer.customerName.firstName}</td>
                <td>${data.request.service.circuit.circuitId}</td>
            </tr>`
}
//headers for table
function renderTableHeaders () {
    return `<table class="request-table">
                <tr class="table-headers">
                    <th>Submit Date</th>
                    <th>Reference Number</th>
                    <th>Company Name</th>
                    <th>Customer</th>
                    <th>Circuit Id</th>
                </tr>
            </table>`
}
//passes headers to container, then passes request GET info through that to create table
function displayList (data) {
    let listResults = data.requests.map((item,index) => renderRequestItem(item));
    //inserts the mapped items into requests list
    $('.content-box').html(renderTableHeaders);
    $('.table-headers').after(listResults);
    displayContent();
}
//simple ajax call to user requests using the bearer auth token stored in session storage after log in
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


//set of functions to create table upon clicking 'submit request' hyperlink
//building individual field sets per type of data schema, this will allow for calling on separate pages w/o having to repeat code
//make sure schema required fields are required on form input, this will reduce the # of UX complaints from form errors
function formBuild () {
    return `<form class="record-submit">
                <h2 class="creation-banner"></h2>
                <button class="submit-button" type="submit">Submit!</button>
            </form>`
}

function customerBuildFieldSet () {

    return `<h2>End Customer Details</h2>
            <fieldset class=customer-fields">
                <legend for="customer-type">Customer Type</legend>
                <select id="customer-type">
                    <option value="Residential">Residential</option>
                    <option value="Business">Business</option>
                    <option value="Wholesale">Wholesale</option>
                </select>
                <legend for="first-name">First Name</legend>
                <input id="first-name" />
                <legend for="last-name>Last Name">Last Name</legend>
                <input id="last-name" />
                <legend for="customer-address-line-one">Customer Address</legend>
                <input id="customer-address-line-one" />
                <legend for="customer-address-line-two">Customer Address 2</legend>
                <input id="customer-address-line-two"/>
                <legend for="customer-city">Customer City</legend>
                <input id="customer-city"/>
                <legend for="customer-state">Customer State</legend>
                <input id="customer-state"/>
                <legend for="customer-zip">Customer Zip</legend>
                <input id="customer-zip"/>
                <legend for="customer-phone">Customer Phone</legend>
                <input id="customer-phone"/>
                <legend for="customer-site-gps">Customer Site GPS</legend>
                <input id="customer-gps"/>
                <legend for="customer-entry-gps">Customer Entry GPS</legend>
                <input id="customer-entry-gps"/>
                <legend for="customer-address-note">Customer Address Note</legend>
                <input id="customer-address-note"/>
                <legend for="customer-site-warnings">Customer Site Warnings</legend>
                <input id="customer-site-warnings"/>
                <legend for="customer-gate-code">Customer Gate Code/Access</legend>
                <input id="customer-gate-code"/>
            </fieldset>`
}

function deviceBuildFieldSet (location) {

    return `<h2> ${location} Device Details</h2>
            <fieldset class="${location}-device-fields">
                <legend for="${location}-device-name">Device Name</legend>
                <input id=""${location}-device-name""/>
                <legend for="${location}-device-manufacturer">Device Manufacturer</legend>
                <select id="${location}-device-manufacturer">
                    <option value="Calix">Calix</option>
                    <option value="Fujitsu">Fujitsu</option>
                    <option value="Juniper">Juniper</option>
                    <option value="Juniper">Juniper</option>
                </select>
                <legend for="${location}-device-model">Device Model</legend>
                <select id="${location}-device-model">
                    <option value="E7">E7</option>
                    <option value="MX480">Fujitsu</option>
                    <option value="9500">Juniper</option>
                    <option value="844GE-1">Juniper</option>
                </select>
                <legend for="${location}-device-port">Device Port</legend>
                <input id="${location}-device-port"/>
                <legend for="${location}-device-serial">Device Serial</legend>
                <input id="${location}-device-serial"/>
                <legend for="${location}-device-mac">Device Mac</legend>
                <input id="${location}-device-mac"/>                
            </fieldset>`
}

function serviceBuildFieldSet () {
    return `<h2>Service Details</h2>
            <fieldset class="service-fields">
                <legend for="service-type">Service Type</legend>
                <input id="service-type" />
                <legend for="media-type">Media Type</legend>
                <input id="media-type" />
                <legend for="bandwidth">Bandwidth</legend>
                <input id="bandwidth" />
                <legend for="circuit-id">Circuit Id</legend>
                <input id="circuit-id" />
                <legend for="vlans">VLAN (Data/ Voice)</legend>
                <input id="vlans" />
                <legend for="sip-user">SIP Username / Password</legend>
                <input id="sip-user" />
                <legend for="data-center">Data Center</legend>
                <input id="data-center" />
                <legend for="distribution-area">Distribution Area</legend>
                <input id="distribution-area" />
                <legend for="da-device-name">DA Device Name</legend>
                <input id="da-device-name" />
                <legend for="fiber-datacenter">Fiber to DataCenter</legend>
                <input id="fiber-datacenter" />
                <legend for="splitter-pigtail">Splitter Pigtail</legend>
                <input id="splitter-pigtail" />
                <legend for="fiber-ont">Fiber to ONT</legend>
                <input id="fiber-ont" />
            </fieldset>`
}

function requestBuildFieldSet () {
    return `<h2>Service Request General Information</h2>
            <fieldset class="general-information-fields">
                <legend for=""></legend>
                <input id=""/>
            </fieldset>`
}

function createRequestForm () {
    $('#submit-request-page-button').on('click', event =>{
        event.preventDefault();

        $('.content-box').html(formBuild);
        $('.creation-banner').after(deviceBuildFieldSet("Z"));
        $('.creation-banner').after(deviceBuildFieldSet("A"));
        $('.creation-banner').after(customerBuildFieldSet);
        $('.creation-banner').after(serviceBuildFieldSet);

        displayContent();
    })
}

$(createRequestForm);