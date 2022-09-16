chai.use(require("chai-sorted"));
import { really, map } from "cypress-should-really";
describe("Systems", () => {
  before(() => {
    cy.beforeTest("/inventory");
    /*
    cy.fixture("imageData").then(function (data) {
      this.data = data;
    });
    cy.fixture("contents").then(function (contents) {
      this.contents = contents;
    });
    cy.viewport(1600, 1000);
    cy.login();
    cy.clearCookieConsentModal();
    */
  });

  it("happy path", function () {
    cy.intercept("GET", "/api/edge/v1/devices/devicesview*", {
      fixture: "systemTable.json",
    });
    cy.get(".pf-c-title", { timeout: 30000 }).should("include.text", "Systems");

    //Update button disabled on open
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.be.disabled");

    //Select first device in inventory
    cy.selectInDropdownMenu("Status", "Update available");
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-c-table__check > input'
    ).click();

    //Button enabled when one device with update available is selected
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.not.be.disabled");

    //Select second device
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-c-table__check > input'
    ).click();

    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-m-width-20 > a'
    ).then(($text) => {
      const msg = $text.text();
      if (msg) {
        cy.get(
          '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-m-width-20 > a'
        ).then(($text2) => {
          const msg2 = $text2.text();
          //expect(msg).not.to.eq(msg2);
          //If images are the same, update button should be enabled
          if (msg === msg2) {
            cy.get(".pf-c-button.pf-m-primary")
              .contains("Update")
              .should("to.not.be.disabled");
          } else {
            //If images are not the same, update button should be disabled
            cy.get(".pf-c-button.pf-m-primary")
              .contains("Update")
              .should("to.be.disabled");

            //Deselect devices
            cy.get(
              '[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-c-table__check > input'
            ).click();
            cy.get(
              '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-c-table__check > input'
            ).click();

            //Update button disabled when devices are deselected
            cy.get(".pf-c-button.pf-m-primary")
              .contains("Update")
              .should("to.be.disabled");

            //Select two devices of specified image
            cy.get('tbody [data-label="Image"]').each(($element) => {
              cy.wrap($element).then(($element) => {
                if ($element.text() === "iqe-test-image-8_5") {
                  cy.get($element)
                    .parent()
                    .find(".pf-c-table__check > input")
                    .click();
                  //Check that button is enabled after devices are selected
                  cy.get(".pf-c-button.pf-m-primary")
                    .contains("Update")
                    .should("to.not.be.disabled");
                }
              });
            });
          }
        });
      }
    });
  });
});
//});
