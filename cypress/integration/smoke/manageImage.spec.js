/// <reference types="cypress" />

describe('manage image', () => {
  beforeEach(() => {
      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
  
      const APP_ENV = Cypress.env('app_env');
      cy.visit(Cypress.env(`${APP_ENV}_host`));
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })

  it('successfully create image', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    const userName = Cypress.env('stage_user')
    const userPassword = Cypress.env('stage_password')
    const imageName = `ui-test_${Date.now()}`

    //login
    cy.waitFor('#username-verification')
    cy.get('#username-verification').type(`${userName}{enter}`)
    cy.waitFor('#password')
    cy.get('#password').type(`${userPassword}{enter}`)
    cy.url()
      .should('include', '/fleet-management')
    //navagate to manage images
    cy.intercept('/api/edge/devices/*').as('getEdgeDevice')
    cy.waitFor('@getEdgeDevice')
    cy.waitFor('#nav-toggle')
    cy.get('#nav-toggle').click()
    cy.waitFor('[data-quickstart-id="Manage-Images"]')
    cy.get('[data-quickstart-id="Manage-Images"]')
      .should('be.visible')
    cy.get('[data-quickstart-id="Manage-Images"]')
      .should('contain', 'Manage Images')
    cy.get('[data-quickstart-id="Manage-Images"]').click()
    cy.waitFor('[data-ouia-component-id="Images"] > [data-testid="router-link"]')
    cy.get('[data-ouia-component-id="Images"] > [data-testid="router-link"]')
      .should('contain', 'Images')
    cy.get('[data-ouia-component-id="Images"] > [data-testid="router-link"]').click()
    cy.url()
      .should('include', '/manage-images')
    //open image wizard
    cy.waitFor('[data-ouia-component-id="OUIA-Generated-Button-primary-1"]')
    cy.get('[data-ouia-component-id="OUIA-Generated-Button-primary-1"]').click()
    cy.waitFor('#name')
    //input image name
    cy.get('#name').type(`${imageName}`)
    cy.waitFor('.pf-c-wizard__footer > .pf-m-primary')
    cy.get('.pf-c-wizard__footer > .pf-m-primary')
      .should('be.enabled')
    cy.get('.pf-c-wizard__footer > .pf-m-primary').click()
    cy.waitFor('.pf-c-form > .pf-c-title')
    cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Options')
    //pick release and output type
    cy.get('.pf-c-form__group-control > .pf-c-select > .pf-c-select__toggle').click()
    cy.waitFor('#release-item-0')
    cy.get('#release-item-0').click()
    cy.get('#rhel-edge-installer').uncheck()
    cy.get('.pf-c-wizard__nav-list > :nth-child(3)')
      .should('contain', 'Additional packages')
    cy.waitFor('.pf-c-wizard__footer > .pf-m-primary')
    cy.get('.pf-c-wizard__footer > .pf-m-primary')
      .should('be.enabled')
    cy.get('.pf-c-wizard__footer > .pf-m-primary').click()
    cy.waitFor('.pf-c-form > .pf-c-title')
    cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Additional packages')
    //add package to image
    cy.get('.pf-m-available > .pf-c-dual-list-selector__tools > .pf-c-dual-list-selector__tools-filter > .pf-c-form-control').type(`vim{enter}`)
    cy.waitFor('#basicSelectorWithSearch-available-pane-option-0 > .pf-c-dual-list-selector__item-main > :nth-child(1) > .pf-c-content > .pf-c-dual-list-selector__item-text')
    cy.get('#basicSelectorWithSearch-available-pane-option-0 > .pf-c-dual-list-selector__item-main > :nth-child(1) > .pf-c-content > .pf-c-dual-list-selector__item-text').click()
    cy.get('.pf-c-dual-list-selector__controls > :nth-child(1)').click()
    cy.waitFor('#basicSelectorWithSearch-chosen-pane-option-0 > .pf-c-dual-list-selector__item-main > :nth-child(1) > .pf-c-content > .pf-c-dual-list-selector__item-text')
    cy.get('#basicSelectorWithSearch-chosen-pane-option-0 > .pf-c-dual-list-selector__item-main > :nth-child(1) > .pf-c-content > .pf-c-dual-list-selector__item-text')
      .should('contain', 'vim-common')
    cy.waitFor('.pf-c-wizard__footer > .pf-m-primary')
    cy.get('.pf-c-wizard__footer > .pf-m-primary')
      .should('be.enabled')
    cy.get('.pf-c-wizard__footer > .pf-m-primary').click()
    cy.waitFor('.pf-c-form > .pf-c-title')
    cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Review')
    //submit create image wizard
    cy.get('[data-testid="review-image-details"] > :nth-child(3) > dd')
      .should('contain', 'ui-test_')
    cy.get('[data-testid="review-image-details"] > :nth-child(5) > dd')
      .should('contain', '1')
    cy.get('[data-testid="review-image-output"] > :nth-child(3) > dd')
      .should('contain', 'Red Hat Enterprise Linux (RHEL) 8.5')
    cy.get('[data-testid="review-image-output"] > :nth-child(5) > dd')
      .should('contain', 'RHEL for Edge Commit (.tar)')
    cy.get('[data-testid="review-image-packages"] > .pf-m-9-col > dd')
      .should('contain', '1')
    cy.waitFor('.pf-c-wizard__footer > .pf-m-primary')
    cy.get('.pf-c-wizard__footer > .pf-m-primary')
      .should('be.enabled')
    cy.get('.pf-c-wizard__footer > .pf-m-primary').click()
  })

});