/// <reference types="cypress" />

const { waitFor } = require("@testing-library/react");

describe('Create image wizard', () => {
  let customRepoFlag = false
  const manageImagesUrl = 'manage-images'

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
    cy.intercept('GET', '/api/featureflags/v0*').as('featureFlag')
    cy.visit('/' + manageImagesUrl)
    cy.url().should('include', manageImagesUrl)
    cy.waitFor('.pf-c-title')

    cy.wait('@featureFlag')
      .then(flag => customRepoFlag = flag.response.body.toggles.find(toggle => toggle.name === 'fleet-management.custom-repos').enabled)

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
    const imageName = 'UI_Test_Image-3'
    const distribution = 'rhel-85'
    const outputTypes = 'rhel-edge-commit'
    const packageName = 'vim-common'
    const deviceUserName = 'test-name'
    const sshKey = 'ssh-rsa 1'
    const customRepoName = 'tpapaioa-repo-1'
    const customPkg = 'bear-4.1-1.noarch.rpm'

    const requestBody = {
      "name": "UI_Test_Image-3",
      "version": 0,
      "distribution": "rhel-85",
      "imageType": "rhel-edge-commit",
      "packages": [
          {
              "name": "vim-common"
          }
      ],
      "outputTypes": [
          "rhel-edge-commit"
      ],
      "commit": {
          "arch": "x86_64"
      },
      "installer": {},
      "thirdPartyRepositories": [
          {
              "ID": 4770,
              "Name": "tpapaioa-repo-1",
              "URL": "https://repos.fedorapeople.org/pulp/pulp/demo_repos/zoo"
          }
      ],
      "customPackages": [
          {
              "Name": "bear-4.1-1.noarch.rpm"
          }
      ]
  }

    // spying and response stubbing
    cy.intercept('POST', '**/images', (req) => {
      req.reply({
        statusCode: 200,
        body: req.body,
      })
    }).as('postImageData')

    
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
    }
    //if custom repos feature flag is enabled, test custom repos steps
    if (customRepoFlag) {
      //add custom repo
      cy.get('.pf-c-form > .pf-c-title')
        .should('contain', 'Custom repositories')
      cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Custom repositories')
      cy.get('.pf-c-form > [data-testid="toolbar-header-testid"] > :nth-child(1) > .pf-c-toolbar__content-section > [data-testid="filter-input-testid"] > :nth-child(1) > #textInput1 > .pf-c-input-group > .pf-c-search-input__bar > .pf-c-search-input__text > .pf-c-search-input__text-input').type(customRepoName)
      cy.get('[data-ouia-component-id="OUIA-Generated-TableRow-2"] > .pf-c-table__check > input').click()
      cy.clickNextButtonImageWizard()
      // add custom package
      cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Custom packages')
      cy.get('.pf-c-form__group-control > .pf-c-form-control').type(customPkg)
      cy.clickNextButtonImageWizard()
    }
    
    cy.get('.pf-c-form > .pf-c-title')
      .should('contain', 'Additional packages')
    
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
    cy.get('[data-testid="review-image-details"] > :nth-child(2) > .pf-m-9-col > dd')
      .should('contain', imageName)
    cy.get('[data-testid="review-image-details"] > :nth-child(3) > .pf-m-9-col > dd')
      .should('contain', '1')
    cy.get('[data-testid="review-image-output"] > :nth-child(2) > .pf-m-9-col > dd')
      .should('contain', releaseMapper[distribution])
    cy.get('[data-testid="review-image-output"]')
      .should('contain', imageTypeMapper[outputTypes])
    cy.get('[data-testid="review-image-output"] > :nth-child(3) > .pf-m-9-col > dd')
      .should('contain', 'RHEL for Edge Commit (.tar)')
    cy.get('[data-testid="review-image-packages"] > :nth-child(2) > .pf-m-9-col > dd')
      .should('contain', '1')
    cy.get('[data-testid="review-image-packages"] > :nth-child(3) > .pf-m-9-col > dd')
      .should('contain', '1')
    cy.clickNextButtonImageWizard()

    cy.wait('@postImageData')
    cy.get('@postImageData').then((req) => {
      expect(req.request.body).to.deep.equal(requestBody)
    })
  });
});