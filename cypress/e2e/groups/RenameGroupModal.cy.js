describe('Rename group modal', () => {
  before(() => {
    cy.beforeTest('/fleet-management')    
  });

  it('rename group modal happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Groups')
    cy.get('.pf-c-search-input__text-input').type('cy-group').wait(500)
    cy.get('tbody > tr').first().find('button').click()
    cy.get('.pf-c-dropdown__menu > li').first().click()

    cy.get('.pf-c-modal-box__title-text').should('include.text', 'Rename group')
    cy.get('.pf-c-form__actions > .pf-m-primary').should('to.be.disabled')
    cy.get('#name-helper').should('include.text', this.contents.nameHelper)
    cy.get('#name').type('edit')
    cy.get('.pf-c-form__actions > .pf-m-primary').should('to.not.be.disabled')
    cy.get('.pf-c-form__actions > .pf-m-primary').contains('Save').click()

  }) 
})
