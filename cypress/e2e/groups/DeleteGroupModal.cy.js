const dayjs = require('dayjs')

describe('Create group modal', () => {
  before(() => {
    cy.beforeTest('/fleet-management')    
  });

  it('create group modal happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Groups')
    cy.get('.pf-c-search-input__text-input').type('cy-group').wait(500)
    cy.get('tbody > tr').first().find('button').click()
    cy.get('.pf-c-dropdown__menu > li').first().next().click()

    cy.get('.pf-c-modal-box__title-text').should('include.text', 'Delete group')
    cy.get('.pf-c-form__actions > .pf-m-danger').contains('Delete').should('to.be.disabled')
    cy.get('.pf-c-content > p').should('include.text', this.contents.deleteGroupContent)
    cy.get('#confirmation').click()
    cy.get('.pf-c-check__label').should('include.text', 'I understand that this action cannot be undone.')
    cy.get('.pf-c-form__actions > .pf-m-danger').should('to.not.be.disabled')
    cy.get('.pf-c-form__actions > .pf-m-danger').contains('Delete').click()
    cy.get('.pf-c-alert__title').should('include.text', 'Success')
    cy.get('.pf-c-alert__description').contains("has been removed successfully")


  }) 
})
