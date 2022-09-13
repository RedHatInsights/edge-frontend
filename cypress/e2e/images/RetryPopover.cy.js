const dayjs = require("dayjs");

describe("Device", () => {
  beforeEach(() => {
    cy.beforeTest("/inventory");
  });

  it.only("RetryPopover", function () {
    cy.waitFor(".pf-c-title");
    cy.wait(1000);
  });
});
