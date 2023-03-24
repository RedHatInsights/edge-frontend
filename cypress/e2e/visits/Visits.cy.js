describe('Visit Images', () => {
  before(() => {
    cy.beforeTest('/manage-images');
  });
  it('manage images happy path', () => {
    cy.url().should('include', '/manage-images')
  });  
});

describe('Visit Repositories', () => {
  before(() => {
    cy.beforeTest('/repositories');
  });
  it('manage repositories happy path', () => { 
    cy.url().should('include', '/repositories')
  });  
});

describe('Visit Inventory', () => {
  before(() => {
    cy.beforeTest('/inventory');
  });
  it('manage inventory happy path', () => {   
    cy.url().should('include', '/inventory')
  });  
});

describe('Visit Groups', () => {
  before(() => {
    cy.beforeTest('/fleet-management');
  });
  it('manage groups happy path', () => {
    cy.url().should('include', '/fleet-management')
  });  
});
