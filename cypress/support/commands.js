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

Cypress.Commands.add('login', () => {
  cy.visit(Cypress.config().baseUrl)
  cy.get('#username-verification').type(Cypress.env('username'))
  cy.get('#login-show-step2').click()
  cy.get('#password').type(Cypress.env('password'))
  cy.get('#rh-password-verification-submit-button').click()
})

Cypress.Commands.add('clearCookieConsentModal', () => {
  const consentModal = Cypress.$('.truste_overlay')
  if (consentModal.length > 0) {
    cy.get('.truste_popframe').then((iframe) => {
      const body = iframe.contents().find('body');
      cy.wrap(body).find('a.call').click()
    })
  }
})