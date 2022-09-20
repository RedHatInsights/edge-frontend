
describe('Edit Modal', () => {
  before(() => {
    cy.beforeTest('/repositories')    
  });

  it('edit repository modal happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Custom repositories')
    cy.get('.pf-c-search-input__text-input').type('cy-repo').wait(1000)
    cy.get('tbody > tr').first().find('button').click()
    cy.get('.pf-c-dropdown__menu > li').first().click()

    cy.get('.pf-c-modal-box__title-text').should('include.text', 'Edit repository')
    cy.get('.pf-c-content > p').should('include.text', this.contents.editRepositoryContent)
    cy.get('#name-helper').should('include.text', this.contents.nameHelper)
    
    cy.get(':nth-child(3) > .pf-c-form__group-label').find('label').should('include.text', 'BaseURL')
    cy.get('#baseURL').type('edit')
    cy.get('.pf-c-helper-text__item-text').should('include.text', this.contents.baseUrlHelperEdit)

    cy.get('.pf-c-form__actions > .pf-m-primary').contains('Update').click()

    cy.get('.pf-c-alert__title').should('include.text', 'Success')
    cy.get('.pf-c-alert__description').should('include.text','has been edited successfully')

  }) 
})
