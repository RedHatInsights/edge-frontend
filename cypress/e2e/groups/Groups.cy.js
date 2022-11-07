describe('Groups', () => {
  before(() => {
    cy.beforeTest('/fleet-management');
  });

  it('groups happy path', () => {
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Groups');
    cy.get('.pf-c-search-input__text-input').type('cy-group');
    cy.wait(500);
    cy.get('tbody [data-label="Name"] > a').should('include.text', 'cy-group');
    cy.wait(500).clickButton('Clear filters');
    cy.wait(500);
    
    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible');
    cy.sorting('tbody [data-label="Name"]', 'asc');
    cy.get('.pf-c-table__button', { timeout: 30000 }).should('be.visible').click();
    cy.wait(1000);
    cy.sorting('tbody [data-label="Name"]', 'des');
    cy.wait(500).testPagination('', 'perPage');
  });

  it('groups max header test', () => {
    cy.largeHeaderRequest('/fleet-management');
  });

});
