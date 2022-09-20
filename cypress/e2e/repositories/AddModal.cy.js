const dayjs = require('dayjs')

describe('Add modal', () => {
  before(() => {
    cy.beforeTest('/repositories')    
  });

  it('add repository modal happy path', function () {  
    cy.get('.pf-c-title', { timeout: 30000 }).should('include.text', 'Custom repositories')
    cy.clickButton('Add repository')
    cy.get('.pf-c-content > p').should('include.text', this.contents.addModalContent)
    cy.get('.pf-c-form__actions > button').contains('Add').should('to.be.disabled')

    cy.get(':nth-child(2) > .pf-c-form__group-label').find('label').should('include.text', 'Name')
    const repoName = "cy-repo-".concat(dayjs().format('DDMMYYHHmmss'))
    cy.wait(1000)
    cy.get('#name').type(repoName)
    cy.get('#name-helper').should('include.text', this.contents.nameHelper)
    
    cy.get(':nth-child(3) > .pf-c-form__group-label').find('label').should('include.text', 'BaseURL')
    cy.get('#baseURL').type('https://example.com/'.concat(repoName))
    cy.get('#baseURL-helper').should('include.text', this.contents.baseUrlHelper)

    cy.get('.pf-c-form__actions > button').should('to.not.be.disabled')
    cy.get('.pf-c-form__actions > .pf-m-primary').click()

    cy.get('.pf-c-alert__title').should('include.text', 'Success')
    cy.get('.pf-c-alert__description').should('include.text', repoName.concat(' has been created successfully'))




    


  }) 
})
