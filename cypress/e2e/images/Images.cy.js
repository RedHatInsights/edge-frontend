describe('Images', () => {
  before(() => {
    cy.beforeTest('/manage-images')    
  });

  it('happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Images')

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
  
    cy.wait(2000)
    cy.get('.pf-m-width-35 > .pf-c-table__button', { timeout: 30000 })
      .should('be.visible').click()
    cy.wait(2000)
    cy.sorting('tbody [data-label="Name"]', 'asc')


    cy.get('.pf-m-width-35 > .pf-c-table__button', { timeout: 30000 })
      .should('be.visible').click()
    cy.wait(2000)
    cy.sorting('tbody [data-label="Name"]', 'des')

    cy.testPagination('', 'perPage')

  }) 
})
