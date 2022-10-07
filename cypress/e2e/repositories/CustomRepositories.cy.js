describe('Custom repositories', () => {
  before(() => {
    cy.beforeTest('/repositories')    
  });

  it('custom repositories happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Custom repositories')
    cy.get('p').first().should('include.text', this.contents.customRepositories)
    cy.get('.pf-c-search-input__text-input').type('cy-repo')

    cy.wait(500)

    cy.get('[data-label="Name"] > p').should('include.text', 'cy-repo')
    cy.wait(500).clickButton('Clear filters')

    cy.wait(500)

    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible')
    cy.wait(2000)
    cy.sorting('tbody [data-label="Name"]', 'asc')

    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible').click()
    cy.wait(2000)
    cy.sorting('tbody [data-label="Name"]', 'des')


    cy.wait(500).testPagination('', 'perPage')


  }) 
})
