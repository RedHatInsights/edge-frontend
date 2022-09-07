chai.use(require('chai-sorted'))
import { really, map } from 'cypress-should-really'

describe('Custom repositories', () => {
  before(() => {
    cy.beforeTest('/repositories')    
  });

  it('custom repositories happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Custom repositories')
    cy.get('.pf-c-search-input__text-input').type('cyrepo')
    cy.get('[data-label="Name"] > p').should('include.text', 'cyrepo')
    cy.wait(500).clickButton('Clear filters')

    cy.wait(500)

    cy.get('.pf-c-table__button', { timeout: 30000 })
      .should('be.visible').click()
    cy.get('tbody [data-label="Name"]')
      .should(really(map('innerText'), 'be.ascending'))

    cy.get('.pf-c-table__button', { timeout: 30000 })
      .should('be.visible').click()
    cy.get('tbody [data-label="Name"]')
      .should(really(map('innerText'), 'be.sorted', { descending: true, }))

    cy.wait(500).testPagination('', 'perPage')


  }) 
})
