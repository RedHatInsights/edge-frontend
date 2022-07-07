describe('empty spec', () => {
  it('passes', () => {
    cy.visit(Cypress.config().baseUrl)
    cy.get('#username-verification').type(Cypress.env('username'))
    cy.get('#login-show-step2').click()
    cy.get('#password').type(Cypress.env('password'))
    cy.get('#rh-password-verification-submit-button').click()
  })
})