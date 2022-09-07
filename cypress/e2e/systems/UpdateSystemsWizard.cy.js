chai.use(require("chai-sorted"));
import { really, map } from "cypress-should-really";
describe("Systems", () => {
  before(() => {
    cy.beforeTest("/inventory");
  });

  it("happy path", function () {
    cy.get(".pf-c-title", { timeout: 30000 }).should("include.text", "Systems");

    //Update button disabled on open
    cy.get(".pf-c-button.pf-m-primary")
      .contains("Update")
      .should("to.be.disabled");

    //Select first two devices in inventory
    cy.selectInDropdownMenu("Status", "Update available");
    cy.get(
      '[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-c-table__check > input'
    ).click();
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
          expect(msg).not.to.eq(msg2);
          if (msg === msg2) {
            cy.get(".pf-c-button.pf-m-primary")
              .contains("Update")
              .should("to.not.be.disabled");
            cy.log("enabled");
          } else {
            cy.get(".pf-c-button.pf-m-primary")
              .contains("Update")
              .should("to.be.disabled");
            cy.log("disabled");
          }
        });
      }
    });
    /*
      cy.get(
        '[data-ouia-component-id="OUIA-Generated-TableRow-3"] > .pf-m-width-20 > a'
      ).should(($text2) => {
        const msg2 = $text2.text();
        expect(msg).not.to.eq(msg2);
        if (msg === msg2) {
          cy.get(".pf-c-button.pf-m-primary")
            .contains("Update")
            .should("to.not.be.disabled");
        } else {
          cy.get(".pf-c-button.pf-m-primary")
            .contains("Update")
            .should("to.be.disabled");
        }
      });
      */
  });

  //Disabled when checked devices have no Update Available status
  //if its running status check it and ensure button is disabled

  //Disabled when devices have different images
  //check two different images and ensure button is disabled

  //Update single system
  //check some system with update available and ensure button is enabled

  //Update multiple systems with same image set
  //check multiple systems of specified image and ensure button is enabled

  //Default - Update button disabled when no devices are selected
  //uncheck all devices and ensure button is disabled
});
//});
