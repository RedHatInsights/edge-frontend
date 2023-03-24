describe('Visit links', () => {
  it('manage images happy path', () => {
  
    cy.beforeTest('/manage-images');

    cy.beforeTest('/repositories');
 
    cy.beforeTest('/inventory');
  
    cy.beforeTest('/fleet-management');

  });  
});
