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
                <input id="request-submit-button" class="submit-button" type="submit"/>
            </form>`
}

function customerBuildFieldSet () {

    return `<h2>End Customer Details</h2>
            <fieldset class=customer-fields">
                <legend for="customer-type">Customer Type</legend>
                <select required ="customer-type">
                    <option value="Residential">Residential</option>
                    <option value="Business">Business</option>
                    <option value="Wholesale">Wholesale</option>
                </select>
                <legend for="customer-identification">Customer Id</legend>
                <input required id="customer-identification"/>
                <legend for="customer-first-name">First Name</legend>
                <input required id="customer-first-name" />
                <legend for="customer-last-name>Last Name">Last Name</legend>
                <input required id="customer-last-name" />
                <legend for="customer-address-line-one">Customer Address</legend>
                <input required id="customer-address-line-one" />
                <legend for="customer-address-line-two">Customer Address 2</legend>
                <input id="customer-address-line-two"/>
                <legend for="customer-city">Customer City</legend>
                <input required id="customer-city"/>
                <legend for="customer-state">Customer State</legend>
                <input required id="customer-state"/>
                <legend for="customer-zip">Customer Zip</legend>
                <input required id="customer-zip"/>
                <legend for="customer-phone">Customer Phone</legend>
                <input id="customer-phone"  placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required/>
                <legend for="customer-site-gps">Customer Site GPS</legend>
                <input id="customer-site-gps"/>
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
                <input id="${location}-device-name"/>
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
                <legend for="circuit-id-comment">Circuit Id Comments</legend>
                <input id="circuit-id-comment" />
                <legend for="department-id">Department Id</legend>
                <input id="department-id"/>
                <legend for="data-vlan">VLAN (Data)</legend>
                <input id="data-vlan" />
                <legend for="-voice-vlan">VLAN (Voice)</legend>
                <input id="voice-vlan" />
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
                <legend for="customer-reference-number">Customer Reference Number</legend>
                <input id="customer-reference-number" />
                <legend for="request-requested-date">Request Provisioning Date</legend>
                <input id="request-requested-date" type="date"/>
                <legend for="target-install-date">Target Install Date</legend>
                <input id="target-install-date" type="date"/>
            <h2>Service Request Details</h2>
                <legend for="service-request-type">Service Request Type</legend>
                <input id="service-request-type"/>
                <legend for="service-request-priority">Service Request Priority</legend>
                <input id="service-request-priority"/>
                <legend for="service-affecting-yes-no">Service Affecting?</legend>
                <select id="service-affecting-yes-no">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>    
                <legend for="service-affecting-yes-no-details">Affecting Details</legend>
                <input id="service-affecting-yes-no-details"/>
                <legend for="service-protected-yes-no">Service Protected?</legend>
                <select id="service-protected-yes-no">
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                </select>
                <legend for="service-protected-yes-no-details">Protected Details</legend>
                <input id="service-protected-yes-no-details"/>
            </fieldset>`
}

//set of functions to submit customer creation from populated form from 'Customer Creation' hyperlink
//functions will ensure they can be used in higher order of operations record submitting
function createCustomerForm () {
    $('#customer-request-page-button').on('click', event =>{
        event.preventDefault();

        $('.content-box').html(formBuild);
        $('.creation-banner').after(customerBuildFieldSet);
        $('.record-submit').attr('id', 'customer-record-submit');

        displayContent();
    })
}

function createCustomerJson () {

    const customer = {
        customerType: $('#customer-type').val(),
        customerName: {
            firstName: $('#customer-first-name').val(),
            lastName: $('#customer-last-name').val()
        },
        customerAddress : {
            customerStreet1: $('#customer-address-line-one').val(),
            customerStreet2: $('#customer-address-line-two').val(),
            customerCity: $('#customer-city').val(),
            customerState: $('#customer-state').val(),
            customerZip: $('#customer-zip').val()
        },
        customerBillingAccount:$('#customer-identification').val(),
        customerPhone: $('#customer-phone').val(),
        customerSiteGps: $('#customer-site-gps').val(),
        customerEntryGps: $('#customer-entry-gps').val(),
        customerAddressNote: $('#customer-address-note').val(),
        customerSiteWarnings: $('#customer-site-warnings').val(),
        customerGateCode: $('#customer-gate-code').val()
    }

    return customer
}

function ajaxCustomer (customer) {

    console.log(customer);

    $.ajax({
        url: '/customers',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(customer),
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
        }
    })
        .then(sendAlert)
        .catch(err => {
            console.log(err);
        })
}

function postCustomer () {

    $('.content-box').on( 'submit', '#customer-record-submit', event => {

        event.preventDefault();

        ajaxCustomer(createCustomerJson())

    })
}



//set of functions to submit device creation from populated form from 'Device Creation' hyperlink
//functions will ensure they can be used in higher order of operations record submitting
function createDeviceForm () {
    $('#device-request-page-button').on('click', event =>{
        event.preventDefault();

        $('.content-box').html(formBuild);
        $('.creation-banner').after(deviceBuildFieldSet("One"));
        $('.record-submit').attr('id', 'device-record-submit');

        displayContent();
    })
}

function createDeviceJson (location) {

    const device = {
        deviceName: $(`#${location}-device-name`).val(),
        deviceManufacturer: $(`#${location}-device-manufacturer`).val(),
        deviceModel: $(`#${location}-device-model`).val(),
        deviceSerialNumber: $(`#${location}-device-port`).val(),
        deviceIpInformation:$(`#${location}-device-serial`).val(),
        deviceMac: $(`#${location}-device-mac`).val(),
    };

    return device
}

function ajaxDevice (device) {

    console.log(device);

    $.ajax({
        url: '/devices',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(device),
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
        }
    })
        .then(sendAlert)
        .catch(err => {
            console.log(err);
        })
}

function postDevice (location) {

    $('.content-box').on( 'submit', '#device-record-submit', event => {

        event.preventDefault();

        ajaxDevice(createDeviceJson(location))

    })
}

//set of functions to post a circuit & service , at this time, will be unused by it's own web page. the point of the system is to request all services through
//the request page. But the system will still benifit from making this modular

function createCircuitJson () {

    const circuit = {
        circuitId: $('#circuit-id').val(),
           zLocationDevice : {
                deviceInfo:{
                    device: $('#A-device-name').val(),
                    devicePort: $('#A-device-port').val(),
           }},
            aLocationDevice : {
                deviceInfo:{
                    device: $('#Z-device-name').val(),
                    devicePort: $('#Z-device-port').val(),
           }},
            circuitAdditionalInformation: $('#circuit-id-comment').val()
    };

    return circuit
}

function createServiceJson () {

    const service = {
        serviceType: $('#service-type').val(),
        mediaType: $('#media-type').val(),
        bandwidth: $('#bandwidth').val(),
        departmentId: $('#department-id').val(),
        dataVlan : $('#data-vlan').val(),
        voiceVlan: $('#voice-vlan').val(),
        dataCenter: $('#data-center').val(),
        distributionArea : $('#distribution-area').val(),
        daDeviceName: $('#da-device-name').val(),
        fiberToDataCenter: $('#fiber-datacenter').val(),
        splitterPigtail: $('#splitter-pigtail').val(),
        fiberToOnt: $('#').val(),
    };
    return service
}




//set of functions to submit request creation from populated form from 'Submit Request' hyperlink
//this is the highest level of record submitting, it will use all previous functions to build customer>device>service>request
function createRequestForm () {
    $('#submit-request-page-button').on('click', event =>{
        event.preventDefault();

        $('.content-box').html(formBuild);
        $('.creation-banner').after(deviceBuildFieldSet("Z"));
        $('.creation-banner').after(deviceBuildFieldSet("A"));
        $('.creation-banner').after(customerBuildFieldSet);
        $('.creation-banner').after(serviceBuildFieldSet);
        $('.creation-banner').after(requestBuildFieldSet);
        $('.record-submit').attr('id', 'request-record-submit');

        displayContent();
    })
}

function createRequestJson () {

    const request = {
        customerReferenceNumber: $('#customer-reference-number').val(),
        serviceRequestNumber: {type:Number, required: true},
        formSubmitDate: Date.now(),
        requestedProvDate: $('#request-requested-date').val(),
        targetInstallDate: $('#target-install-date').val(),
        serviceRequestType: $('#service-request-type').val(),
        serviceRequestPriority: $('#').val(),
        serviceRequestDetails: $('#').val(),
        serviceAffecting: {
            yesOrNo :$('#service-affecting-yes-no').val(),
            details: $('#service-affecting-yes-no-details').val()},
        serviceProtected: {
            yesOrNo :$('#service-protected-yes-no').val(),
            details: $('#service-protected-yes-no-details').val()}
    }

    return request
}

function ajaxRequest (circuitJson,serviceJson,requestJson) {

    const requestData = {}

    Object.keys(circuitJson).forEach(key => requestData[key] = circuitJson[key]);
    Object.keys(serviceJson).forEach(key => requestData[key] = serviceJson[key]);
    Object.keys(requestJson).forEach(key => requestData[key] = requestJson[key]);

    $.ajax({
        url: '/requests',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
        }
    })
        .then(sendAlert)
        .catch(err => {
            console.log(err);
        })
}

function postRequest () {

    $('.content-box').on( 'submit', '#request-record-submit', event => {

        event.preventDefault();

        ajaxRequest(createCircuitJson,createServiceJson,createRequestJson)

    })
}



function sendAlert () {
    return alert('POST worked')
}

$(createDeviceForm);
$(createCustomerForm);
$(createRequestForm);
$(postCustomer);
$(postDevice("One"));
$(postRequest);
