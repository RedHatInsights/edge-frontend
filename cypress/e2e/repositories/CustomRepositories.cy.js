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

    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible')
    cy.sorting('tbody [data-label="Name"] > p', 'asc')

    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible').click()
    cy.wait(1000)
    cy.sorting('tbody [data-label="Name"] > p', 'des')


    cy.wait(500).testPagination('', 'perPage')


  }) 
})
