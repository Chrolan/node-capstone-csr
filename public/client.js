//functions for navbar
function navBarFunction() {
    var x = document.getElementById("nav-bar");
    if (x.className === "nav-bar row") {
        x.className += " responsive";
    } else {
        x.className = "nav-bar row";
    }
}

$('.nav-bar-items > a').on('click', function(event){
    // First we take away the background color (selection) from the <li>
    $('.selectedNavElement').removeClass('selectedNavElement');

    let $currentElement = $(this);

    // We update the just clicked <li> with the background color
    $currentElement.addClass('selectedNavElement');
});


//upon clicking of 'my requests' hyperlink, will search for submitted requests and return in table format
function renderRequestItem (data) {

    const submitDate = new Date(parseInt(data.request.formSubmitDate)).toString();
    const newDate = submitDate.substr(0,15);

    return `<tr class="request-item">
                <td>${newDate}</td>
                <td>${data.request.customerReferenceNumber}</td>
                <td>${data.request.service.customer.customerName.lastName} , ${data.request.service.customer.customerName.firstName}</td>
                <td>${data.request.service.circuit.circuitId}</td>
            </tr>`
}
//headers for table
function renderTableHeaders () {
    return `<div class="table-div">
                <table class="request-table row">
                    <thead>
                        <tr class="table-headers">
                            <th>Submit Date</th>
                            <th>Reference Number</th>
                            <th>Customer</th>
                            <th>Circuit Id</th>
                        </tr>
                    </thead>
                </table>
            </div>`
}
//passes headers to container, then passes request GET info through that to create table
function displayRequests (data) {
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
            displayRequests(data)
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

//Set of functions to get device data and display it
function renderDeviceItem (data) {

    return `<tr class="request-item">
                <td>${data.device.deviceName}</td>
                <td>${data.device.deviceManufacturer}</td>
                <td>${data.device.deviceModel}</td>
                <td>${data.device.deviceSerialNumber}</td>
                <td>${data.device.deviceMac}</td>
            </tr>`
}
//headers for table
function renderDeviceTableHeaders () {
    return `<div class="table-div">
                <table class="request-table row">
                    <thead>
                        <tr class="table-headers">
                            <th>Device Name</th>
                            <th>Manufacturer</th>
                            <th>Model</th>
                            <th>Serial Number</th>
                            <th>MAC Address</th>
                        </tr>
                    </thead>
                </table>
            </div>`
}
//passes headers to container, then passes request GET info through that to create table
function displayDevices (data) {
    let listResults = data.devices.map((item,index) => renderDeviceItem(item));
    //inserts the mapped items into requests list
    $('.content-box').html(renderDeviceTableHeaders);
    $('.table-headers').after(listResults);
    displayContent();
}
//simple ajax call to user requests using the bearer auth token stored in session storage after log in
function getMyDevices () {
    $.ajax({
        url:"/devices/user-requests",
        dataType:"json",
        contentType: "application/json",
        type: "GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
        }
    })
        .then(data => {
            displayDevices(data)
        })
        .catch(err => {
            console.log(err);
        })
}

function createDevicesPage () {
    $('#my-devices-page-button').on('click', event => {
        event.preventDefault();
        getMyDevices();
    })
}

$(createDevicesPage);

//set of functions to create table upon clicking 'submit request' hyperlink
//building individual field sets per type of data schema, this will allow for calling on separate pages w/o having to repeat code
//make sure schema required fields are required on form input, this will reduce the # of UX complaints from form errors
function formBuild () {
    return `<form class="record-submit row">
                <h2 class="creation-banner"></h2>
                <input id="request-submit-button" class="submit-button" type="submit"/>
            </form>`
}

function customerBuildFieldSet () {

    return `
            <fieldset class="customer-fields">
            <legend class="col-12">End Customer Details</legend>
                <div class="col-6">
                    <label for="customer-type">Customer Type
                        <select id="customer-type" required ="customer-type">
                            <option value="Residential">Residential</option>
                            <option value="Business">Business</option>
                            <option value="Wholesale">Wholesale</option>
                        </select>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-identification">Customer Id
                        <input required id="customer-identification"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-first-name">First Name
                        <input required id="customer-first-name" />
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-last-name>Last Name">Last Name
                        <input required id="customer-last-name" />
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-address-line-one">Customer Address
                        <input required id="customer-address-line-one" />
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-address-line-two">Customer Address 2
                        <input id="customer-address-line-two"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-city">Customer City
                        <input required id="customer-city"/>
                    </label>
                </div>
                <div class="col-6">  
                    <label for="customer-state">Customer State
                        <input required id="customer-state"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-zip">Customer Zip
                        <input required id="customer-zip"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-phone">Customer Phone
                        <input id="customer-phone"  placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required/>
                    </label>
                </div>
                <div class="col-6">
                        <label for="customer-site-gps">Customer Site GPS
                        <input id="customer-site-gps"/>
                        </label>
                </div>
                <div class="col-6">
                    <label for="customer-entry-gps">Customer Entry GPS
                        <input id="customer-entry-gps"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-address-note">Customer Address Note
                        <input id="customer-address-note"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-site-warnings">Customer Site Warnings
                        <input id="customer-site-warnings"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="customer-gate-code">Customer Gate Code/Access
                        <input id="customer-gate-code"/>
                    </label>
                </div>
            </fieldset>`
}

function deviceBuildFieldSet (location) {

    return `<fieldset class="${location}-device-fields row">
            <legend class="col-12"> ${location} Device Details</legend>
                <div class="col-6">
                    <label for="${location}-device-name">Device Name
                        <input id="${location}-device-name"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="${location}-device-manufacturer">Device Manufacturer
                        <select id="${location}-device-manufacturer">
                            <option value="Calix">Calix</option>
                            <option value="Fujitsu">Fujitsu</option>
                            <option value="Juniper">Juniper</option>
                            <option value="Juniper">Juniper</option>
                        </select>
                    </label>
                </div>
                <div class="col-6">
                    <label for="${location}-device-model">Device Model
                        <select id="${location}-device-model">
                            <option value="E7">E7</option>
                            <option value="MX480">Fujitsu</option>
                            <option value="9500">Juniper</option>
                            <option value="844GE-1">Juniper</option>
                        </select>
                    </label>
                </div>
                <div class="col-6">
                    <label for="${location}-device-port">Device Port
                        <input id="${location}-device-port"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="${location}-device-serial">Device Serial
                        <input id="${location}-device-serial"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="${location}-device-ip">Device IP
                        <input id="${location}-device-ip"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="${location}-device-mac">Device Mac
                        <input id="${location}-device-mac"/>        
                    </label>
                </div>        
            </fieldset>`
}

function serviceBuildFieldSet () {
    return `<fieldset class="service-fields row">
            <legend class="col-12">Service Details</legend>
                <div class="col-6">
                    <label for="service-type">Service Type
                        <input id="service-type" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="media-type">Media Type
                        <input id="media-type" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="bandwidth">Bandwidth
                        <input id="bandwidth" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="circuit-id">Circuit Id
                        <input id="circuit-id" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="circuit-id-comment">Circuit Id Comments
                        <input id="circuit-id-comment" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="department-id">Department Id
                        <input id="department-id"/>
                    </label>
                </div> 
                <div class="col-6">
                    <label for="data-vlan">VLAN (Data)
                        <input id="data-vlan" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="-voice-vlan">VLAN (Voice)
                        <input id="voice-vlan" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="sip-user">SIP Username / Password
                        <input id="sip-user" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="data-center">Data Center
                        <input id="data-center" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="distribution-area">Distribution Area
                        <input id="distribution-area" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="da-device-name">DA Device Name
                        <input id="da-device-name" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="fiber-datacenter">Fiber to DataCenter
                        <input id="fiber-datacenter" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="splitter-pigtail">Splitter Pigtail
                        <input id="splitter-pigtail" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="fiber-ont">Fiber to ONT
                        <input id="fiber-ont" />
                    </label>
                </div> 
            </fieldset>`
}

function requestBuildFieldSet () {
    return `<fieldset class="general-information-fields row">
            <legend class="col-12">Service Request General Information</legend>
                <div class="col-6">
                    <label for="request-number">Request Number
                        <input id="request-number" />
                    </label>
                </div> 
                <div class="col-6"> 
                    <label for="customer-reference-number">Customer Reference Number
                        <input id="customer-reference-number" />
                    </label>
                </div> 
                <div class="col-6">
                    <label for="request-requested-date">Request Provisioning Date
                        <input id="request-requested-date" type="date"/>
                    </label>
                </div> 
                <div class="col-6">
                    <label for="target-install-date">Target Install Date
                        <input id="target-install-date" type="date"/>
                    </label>
                </div> 
            </fieldset>
            
            <fieldset class="general-information-fields-2 row">
            <legend class="col-12">Service Request Details</legend>
                <div class="col-6">
                    <label for="service-request-type">Service Request Type
                        <input id="service-request-type"/>
                    </label>
                </div> 
                <div class="col-6">
                    <label for="service-request-priority">Service Request Priority
                        <input id="service-request-priority"/>
                    </label>
                </div> 
                <div class="col-6">
                    <label for="service-request-details">Service Request Details
                        <input id="service-request-details"/>
                    </label>
                </div> 
                <div class="col-6">
                    <label for="service-affecting-yes-no">Service Affecting?
                        <select id="service-affecting-yes-no">
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>  
                    </label>
                </div>   
                <div class="col-6">
                    <label for="service-affecting-yes-no-details">Affecting Details
                        <input id="service-affecting-yes-no-details"/>
                    </label>
                </div>
                <div class="col-6">
                    <label for="service-protected-yes-no">Service Protected?
                        <select id="service-protected-yes-no">
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </label>
                </div> 
                <div class="col-6">
                    <label for="service-protected-yes-no-details">Protected Details
                        <input id="service-protected-yes-no-details"/>
                    </label>
                </div> 
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

function ajaxCustomer (customer,callback) {



    return $.ajax({
                url: '/customers',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(customer),
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
                }
            })
}

function postCustomer () {

    $('.content-box').on( 'submit', '#customer-record-submit', event => {

        event.preventDefault();

        ajaxCustomer(createCustomerJson(),sendAlert())

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
        deviceSerialNumber: $(`#${location}-device-serial`).val(),
        deviceIpInformation:$(`#${location}-device-ip`).val(),
        deviceMac: $(`#${location}-device-mac`).val(),
    };

    return device
}

function ajaxDevice (device) {

    return  $.ajax({
                url: '/devices',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(device),
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
                }
            })
}

function postDevice (location) {

    $('.content-box').on( 'submit', '#device-record-submit', event => {

        event.preventDefault();

        ajaxDevice(createDeviceJson(location),sendAlert())

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

function ajaxCircuit (circuit) {

    return $.ajax({
                url: '/circuits',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(circuit),
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
                }
            })
}

function createServiceJson () {

    const service = {
        customerBillingAccount:$('#customer-identification').val(),
        circuitId: $('#circuit-id').val(),
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
        fiberToOnt: $('#fiber-ont').val()
    };

    return service
}

function ajaxService (service) {

    return $.ajax({
                url: '/services',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(service),
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
                }
            })
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
        dataVlan : $('#data-vlan').val(),
        daDeviceName: $('#da-device-name').val(),
        customerReferenceNumber: $('#customer-reference-number').val(),
        formSubmitDate: Date.now(),
        requestedProvDate: $('#request-requested-date').val(),
        targetInstallDate: $('#target-install-date').val(),
        serviceRequestType: $('#service-request-type').val(),
        serviceRequestPriority: $('#service-request-priority').val(),
        serviceRequestDetails: $('#service-request-details').val(),
        serviceAffecting: {
            yesOrNo :$('#service-affecting-yes-no').val(),
            details: $('#service-affecting-yes-no-details').val()},
        serviceProtected: {
            yesOrNo :$('#service-protected-yes-no').val(),
            details: $('#service-protected-yes-no-details').val()}
    }

    return request
}

function ajaxRequest (request) {

    return $.ajax({
                url: '/requests',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(request),
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('Bearer')}`
                }
            })
}

function postRequest () {

    $('.content-box').on( 'submit', '#request-record-submit', event => {

        event.preventDefault();

        ajaxCustomer(createCustomerJson())
            .catch(err => {
                console.log(err.responseJSON.message);
            })
            .then(function () {
                return ajaxDevice(createDeviceJson("Z"))
            })
            .catch(err => {
                console.log(err.responseJSON.message);
            })
            .then(function () {
                return ajaxDevice(createDeviceJson("A"))
            })
            .catch(err => {
                console.log(err.responseJSON.message);
            })
            .then(function () {
                return ajaxCircuit(createCircuitJson())
            })
            .catch(err => {
                console.log(err.responseJSON.message);
            })
            .then(function () {
                return ajaxService(createServiceJson())
            })
            .catch(err => {
                console.log(err.responseJSON.message);
            })
            .then(function () {
                return ajaxRequest(createRequestJson())
            })
            .catch(err => {
                console.log(err.responseJSON.message);
            })
    })
}

function sendAlert () {
    return console.log('POST worked')
}

$(createDeviceForm);
$(createCustomerForm);
$(createRequestForm);
$(postCustomer);
$(postDevice("One"));
$(postRequest);
