/// <reference types="cypress" />

describe('Create image wizard', () => {
  beforeEach(() => {

    const userName = Cypress.env('username');
    const userPassword = Cypress.env('password');

    cy.visit(Cypress.config().baseUrl)

    cy.waitFor('#username-verification');
    cy.get('#username-verification')
        .type(`${userName}{enter}`);
    cy.waitFor('#password');
    cy.get('#password')
        .type(`${userPassword}{enter}`);

});

  it('should send the correct data when the wizard is submitted.', () => {
    const releaseMapper = {
      'rhel-85': 'Red Hat Enterprise Linux (RHEL) 8.5',
      'rhel-84': 'Red Hat Enterprise Linux (RHEL) 8.4',
    };
    
    const imageTypeMapper = {
      'rhel-edge-commit': 'RHEL for Edge Commit (.tar)',
      'rhel-edge-installer': 'RHEL for Edge Installer (.iso)',
    };

    //change these property to test different wizard inputs
    const manageImagesUrl = 'manage-images'
    const imageName = 'UI_Test_Image-3'
    const distribution = 'rhel-85'
    const outputTypes = 'rhel-edge-commit'
    const packageName = 'vim-common'
    const deviceUserName = 'test-name'
    const sshKey = 'ssh-rsa 1'

    const requestBody = {
      "name": imageName,
      "version": 0,
      "distribution": distribution,
      "imageType": outputTypes,
      "packages": [
          {
              "name": packageName
          }
      ],
      "outputTypes": outputTypes === 'rhel-edge-installer' ? ['rhel-edge-installer', 'rhel-edge-commit'] : ['rhel-edge-commit'],
      "commit": {
          "arch": "x86_64"
      },
      "installer": outputTypes === 'rhel-edge-installer' ? {
        "username": deviceUserName,
        "sshkey": sshKey
      } : {}
    }

    // spying and response stubbing
    cy.intercept('POST', '**/images', (req) => {
      req.reply({
        statusCode: 200,
        body: req.body,
      })
    }).as('postImageData')

    cy.visit('/' + manageImagesUrl)
    cy.url().should('include', manageImagesUrl)
    cy.waitFor('.pf-c-title')
    cy.get('.pf-c-title')
        .should('include.text', 'Images')
    //if cookies banner close it
    if(cy.get('#truste-consent-button')) {
      cy.get('#truste-consent-button').click()
    }
    //open image wizard
    cy.waitFor('[data-ouia-component-id="OUIA-Generated-Button-primary-1"]')
    cy.get('[data-ouia-component-id="OUIA-Generated-Button-primary-1"]').click()
    cy.waitFor('#name')
    //input image name
    cy.get('#name').type(`${imageName}`)
    cy.clickNextButtonImageWizard()
    cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Options')
    //pick release and output type
    cy.get('.pf-c-form__group-control > .pf-c-select > .pf-c-select__toggle').click()
    cy.waitFor('#release-item-1')
    if (distribution === 'rhel-85') {
      cy.get('#release-item-1').click()
    }
    if (distribution === 'rhel-84') {
      cy.get('#release-item-2').click()
    }
    if (outputTypes === 'rhel-edge-installer') {
      cy.get('#rhel-edge-installer').check()
      cy.get('.pf-c-wizard__nav-list > :nth-child(3)')
      .should('contain', 'Device registration')
      cy.clickNextButtonImageWizard()
      //add username and ssh key
      cy.get('.pf-c-form > .pf-c-title')
        .should('contain', 'Device registration')
      cy.get('#username').type(deviceUserName)
      cy.get('#credentials').type(sshKey)
      cy.get('.pf-c-wizard__nav-list > :nth-child(4)')
      .should('contain', 'Additional packages')
      cy.clickNextButtonImageWizard()
      cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Additional packages')
    } else {
      cy.get('#rhel-edge-installer').uncheck()
      cy.get('.pf-c-wizard__nav-list > :nth-child(3)')
      .should('contain', 'Additional packages')
      cy.clickNextButtonImageWizard()
      cy.get('.pf-c-form > .pf-c-title')
        .should('contain', 'Additional packages')
    }
    //add package to image
    cy.get('[data-testid="available-search-input"]').type(`${packageName}{enter}`)
    cy.waitFor('#composable-option-0 > .pf-c-dual-list-selector__list-item-row > .pf-c-dual-list-selector__item > .pf-c-dual-list-selector__item-main > :nth-child(1) > .pf-c-content')
    cy.get('#composable-option-0 > .pf-c-dual-list-selector__list-item-row > .pf-c-dual-list-selector__item > .pf-c-dual-list-selector__item-main > :nth-child(1) > .pf-c-content').click()
    cy.get('.pf-c-dual-list-selector__controls > :nth-child(1)').click()
    cy.waitFor('[data-testid="chosen-packages-list"] > #composable-option-0 > .pf-c-dual-list-selector__list-item-row > .pf-c-dual-list-selector__item')
    cy.get('[data-testid="chosen-packages-list"] > #composable-option-0 > .pf-c-dual-list-selector__list-item-row > .pf-c-dual-list-selector__item')
      .should('contain', 'vim-common')
    cy.clickNextButtonImageWizard()
    cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Review')
    //submit create image wizard
    cy.get('[data-testid="review-image-details"] > :nth-child(3) > dd')
      .should('contain', imageName)
    cy.get('[data-testid="review-image-details"] > :nth-child(5) > dd')
      .should('contain', '1')
    cy.get('[data-testid="review-image-output"] > :nth-child(3) > dd')
      .should('contain', releaseMapper[distribution])
    cy.get('[data-testid="review-image-output"]')
      .should('contain', imageTypeMapper[outputTypes])
    cy.get('[data-testid="review-image-packages"] > .pf-m-9-col > dd')
      .should('contain', '1')
    cy.clickNextButtonImageWizard()

    cy.wait('@postImageData')
    cy.get('@postImageData').then((req) => {
      expect(req.request.body).to.deep.equal(requestBody)
    })
  });
});