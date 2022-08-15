//chai.use(require('chai-sorted'))
import { really, map } from 'cypress-should-really'
describe('Images', () => {
  before(() => {
    cy.beforeTest('/manage-images')    
  });

  it('happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Systems')

    //Filter by Name
    cy.get('[data-testid="toolbar-header-testid"]').find('[data-testid="filter-dropdown-testid"]').click()
    cy.get('[data-testid="toolbar-header-testid"]').find('[data-testid="filter-dropdown-testid"]').contains('Name').click()
    cy.get('.pf-c-search-input__text-input').type('cy-test')
    cy.get('.pf-m-width-35 > a').should('include.text', 'cy-test')
    cy.wait(500)
    cy.iterateRows('a', 'cy-test')
    cy.clickButton('Clear filters')

    //Filter by Status - Ready
    cy.selectInDropdownMenu('Status', 'Ready')
    cy.iterateRows('p', 'Ready')
    cy.clickButton('Clear filters')

    //Sort by Status - Error
    cy.selectInDropdownMenu('Status', 'Error')
    cy.iterateRows('p', 'Error')
    cy.clickButton('Clear filters')

    cy.testPagination('', 'perPage')

    cy.wait(2000)
    cy.get('.pf-m-width-35 > .pf-c-table__button').click()
    cy.get('tbody [data-label="Name"]').wait(3000).should(
      really(map('innerText'), 'be.ascending')
    )

    cy.get('.pf-m-width-35 > .pf-c-table__button').wait(3000).click()
    cy.get('tbody [data-label="Name"]')
      .should(
        really(map('innerText'), 'be.sorted', { descending: true, })
      )

  }) 
})
