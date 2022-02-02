// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('clickNextButtonImageWizard', () => {
  cy.waitFor('.pf-c-wizard__footer > .pf-m-primary')
  cy.get('.pf-c-wizard__footer > .pf-m-primary')
    .should('be.enabled')
  cy.get('.pf-c-wizard__footer > .pf-m-primary').click()
  cy.waitFor('.pf-c-form > .pf-c-title')
})
