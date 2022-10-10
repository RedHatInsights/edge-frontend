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

//import { recurse } from 'cypress-recurse'
Cypress.Commands.add('login', () => {
  cy.visit(Cypress.config().baseUrl)
  cy.get('#username-verification', { timeout: 30000 }).should('be.visible').type(Cypress.env('username'))
  cy.get('#login-show-step2', { timeout: 30000 }).should('be.visible').click()
  cy.get('#password', { timeout: 30000 }).should('be.visible').type(Cypress.env('password'))
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

Cypress.Commands.add('beforeTest', (url) => {
  cy.fixture("imageData").then(function (data) {
    this.data = data
    })
  cy.fixture("contents").then(function (contents) {
    this.contents = contents
   })
  cy.viewport(1600, 1000)
  cy.login()
  cy.clearCookieConsentModal()
  cy.visit(url)

})

Cypress.Commands.add('iterateRows', (element, value) => {
  cy.get(`tbody ${element}`).each(($element) => {
    cy.wrap($element)
      .contains(value)
  })

})

Cypress.Commands.add('selectInDropdownMenu', (label, status) => {
  cy.get('[data-testid="toolbar-header-testid"]').find('[data-testid="filter-dropdown-testid"]').click()
  cy.get('[data-testid="toolbar-header-testid"]').find('[data-testid="filter-dropdown-testid"]').contains(label).click()
  cy.get('[data-testid="toolbar-header-testid"]').find('[data-testid="filter-input-testid"]').click()
  cy.get('label').contains(status).click()
  cy.get('[data-testid="toolbar-header-testid"]').find('[data-testid="filter-input-testid"]').click()

})

Cypress.Commands.add('clickButton', (value) => {
  cy.get('button').contains(value).click()
})

Cypress.Commands.add('testPagination', (selector, test) => {
  if(test == "perPage"){    
    cy.wrap([10, 20, 50, 100]).each((num, i, array) => {
      cy.get(`${selector} [data-testid="toolbar-header-testid"]`).find('[data-testid="pagination-header-test-id"]').click()
      cy.get(`${selector} [data-testid="toolbar-header-testid"]`).find(`[data-action="per-page-${num}"]`).click()
      cy.get(`${selector} [data-testid="toolbar-header-testid"]`).find('b').should('include.text', `1 - ${num}`)

      })
      cy.get(`${selector} [data-testid="toolbar-header-testid"]`).find('[data-action="previous"]').should('to.be.disabled')
      cy.get(`${selector} [data-testid="toolbar-header-testid"]`).find('[data-action="next"]').should('to.not.be.disabled')    

  }else{    

  }
})

Cypress.Commands.add('sorting', (selector, order) => {
  const collator = new Intl.Collator('en-US', {ignorePunctuation: true})
  
  cy.get(selector)
  .then(($cell) => Cypress._.map($cell, (el) => el.innerText))
  .then((list)=>{
    var sortedList = [...list].sort((a, b) => order === "asc" ? collator.compare(a, b) : collator.compare(b, a));
    expect(list).to.deep.equal(sortedList)

  })
  
})


