const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Blog List", function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  // test strategy:
  //   1. make request to `/customers`
  //   2. inspect response object and prove has right code and have
  //   right keys in response object.
  it("should list items on GET", function() {
    return chai
      .request(app)
      .get("/customers")
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");

        // because we create three items on app load
        expect(res.body.length).to.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        const expectedKeys = ['customerType', 'customerName', 'customerAddress', 'customerBillingAccount'];
        res.body.forEach(function(item) {
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

  // test strategy:
  //  1. make a POST request with data for a new item
  //  2. inspect response object and prove it has right
  //  status code and that the returned object has an `id`
  it("should add an item on POST", function() {
    const newItem = { customerType: "DSL",
                    customerName: {
                    	firstName: "Jordan",
                    	lastName: "Kleriga"
                    },
                    customerAddress : {
                        customerStreet1: "123 Seasame",
                        customerStreet2: "Apt142",
                        customerCity :"Plano",
                        customerState: "Texas",
                        customerZip: "75075"
                    },
                    customerBillingAccount: "65400",
                    customerPhone: "469-826-4133",
                    customerSiteGps: "",
                    customerEntryGps: "",
                    customerAddressNote: "Added 1 note",
                    customerGateCode: ""};
    return chai
      .request(app)
      .post("/customers")
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys('customerName', 'customerType', 'customerBillingAccount');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

  // test strategy:
  //  1. initialize some update data (we won't have an `id` yet)
  //  2. make a GET request so we can get an item to update
  //  3. add the `id` to `updateData`
  //  4. Make a PUT request with `updateData`
  //  5. Inspect the response object to ensure it
  //  has right status code and that we get back an updated
  //  item with the right data in it.
  it("should update items on PUT", function() {
    // we initialize our updateData here and then after the initial
    // request to the app, we update it with an `id` property so
    // we can make a second, PUT call to the app.
    const updateData = { customerType: "DSL",
                    customerName: {
                    	firstName: "Jordi",
                    	lastName: "Caggiano"
                    },
                    customerAddress : {
                        customerStreet1: "123 Plano Parkway",
                        customerStreet2: "Apt142",
                        customerCity :"Plano",
                        customerState: "Texas",
                        customerZip: "75075"
                    },
                    customerBillingAccount: "84641",
                    customerPhone: "469-826-4133",
                    customerSiteGps: "",
                    customerEntryGps: "",
                    customerAddressNote: "Added 3 note",
                    customerGateCode: ""};
    return (
      chai
        .request(app)
        .get("/customers")
        .then(function(res) {
          updateData.id = res.body[0].id;
          return chai
            .request(app)
            .put(`/customers/${updateData.id}`)
            .send(updateData);
        })
        // prove that the PUT request has right status code
        // and returns updated item
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.deep.equal(updateData);
        })
    );
  });

  // test strategy:
  //  1. GET shopping list items so we can get ID of one
  //  to delete.
  //  2. DELETE an item and ensure we get back a status 204
  it("should delete items on DELETE", function() {
    return (
      chai
        .request(app)
        // first have to get so we have an `id` of item
        // to delete
        .get("/customers")
        .then(function(res) {
          return chai.request(app).delete(`/customers/${res.body[0].id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        })
    );
  });
});