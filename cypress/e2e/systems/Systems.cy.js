describe('Systems', () => {

  it('systems max header test', () => {
    cy.largeHeaderRequest('/inventory');
  });

});
