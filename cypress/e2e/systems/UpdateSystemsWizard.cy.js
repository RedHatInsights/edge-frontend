chai.use(require("chai-sorted"));
import { really, map } from "cypress-should-really";
describe("Systems", () => {
  before(() => {
    cy.beforeTest("/inventory");
  });

  it("happy path", function () {
    cy.intercept("GET", "/api/edge/v1/devices/devicesview*", {
      fixture: "systemTable.json",
    });
    cy.get(".pf-c-title", { timeout: 30000 }).should("include.text", "Systems");

    //Update button disabled on open/when no devices are selected
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.be.disabled");

    //Select first device in inventory
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-c-table__check > input'
    ).click();

    //Button disabled when a device without update available is selected
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.be.disabled");

    //Select second device
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-c-table__check > input'
    ).click();

    //Button enabled when devices with same image are selected with at least one with update available
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.not.be.disabled");

    //Deselect first device
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-c-table__check > input'
    ).click();

    //Button enabled with only one device selected, with update available
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.not.be.disabled");

    //Select third device
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-4"] > .pf-c-table__check > input'
    ).click();

    //Button enabled when two devices with same image and update available are selected
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.not.be.disabled");

    //Deselect second device
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-c-table__check > input'
    ).click();

    //Select fourth device, which has different image than third
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-5"] > .pf-c-table__check > input'
    ).click();

    //Button disabled when devices with different images are selected
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.be.disabled");
  });
});
//});
