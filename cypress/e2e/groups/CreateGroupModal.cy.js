const dayjs = require('dayjs')

describe('Create group modal', () => {
  before(() => {
    cy.beforeTest('/fleet-management')    
  });

  it('create group modal happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Groups')
    cy.clickButton('Create group')
    cy.get('.pf-c-form__label-text').should('have.text', 'Group name')
    cy.get('#name-helper').should('include.text', this.contents.nameHelper)
    cy.get('.pf-c-form__actions > .pf-m-primary').should('to.be.disabled')
    const groupName = "cy-group-".concat(dayjs().format('DDMMYYHHmmss'))
    cy.wait(500)
    cy.get('#name').type(groupName)
    cy.get('.pf-c-form__actions > .pf-m-primary').should('to.not.be.disabled')
    cy.get('.pf-c-form__actions > .pf-m-primary').click()
    cy.get('.pf-c-alert__title').should('include.text', 'Success')
    cy.get('.pf-c-alert__description').should('include.text', groupName.concat(' has been created successfully'))


  }) 
})
