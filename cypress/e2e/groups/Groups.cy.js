import { really, map } from 'cypress-should-really'

describe('Groups', () => {
  before(() => {
    cy.beforeTest('/fleet-management')
  });

  it('groups happy path', () => {
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Groups')

    cy.get('.pf-c-search-input__text-input').type('cy-group')

    cy.wait(500)

    cy.get('tbody [data-label="Name"] > a').should('include.text', 'cy-group')
    cy.wait(500).clickButton('Clear filters')

    cy.wait(500)

    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible')
    cy.get('tbody [data-label="Name"]').should(really(map('innerText'), 'be.ascending'))

    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible').click()
    cy.get('tbody [data-label="Name"]').should(really(map('innerText'), 'be.sorted', { descending: true }))

    cy.wait(500).testPagination('', 'perPage')

  }) 
})
