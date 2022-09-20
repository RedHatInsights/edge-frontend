const dayjs = require('dayjs')

describe('Remove Modal', () => {
  before(() => {
    cy.beforeTest('/repositories')    
  });

  it('remove repository modal happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Custom repositories')
    cy.get('.pf-c-search-input__text-input').type('cy-repo').wait(1000)
    cy.get('tbody > tr').first().find('button').click()
    cy.get('.pf-c-dropdown__menu > li').last().click()

    cy.get('.pf-c-modal-box__title-text').should('include.text', 'Remove repository')
    cy.get('.pf-c-content > p').should('include.text', this.contents.removeModalContent)
    cy.get(':nth-child(2) > .pf-c-content > b').should('include.text', 'Name')
    cy.get(':nth-child(3) > .pf-c-content > b').should('include.text', 'BaseURL')

    cy.get('.pf-m-danger').contains('Remove').click()

    cy.get('.pf-c-alert__title').should('include.text', 'Success')
    cy.get('.pf-c-alert__description').contains("has been removed successfully")

  }) 
})
