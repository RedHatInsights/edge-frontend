const dayjs = require('dayjs')

describe('Create image wizard', () => {
  beforeEach(() => {
    cy.fixture("imageData").then(function (data) {
      this.data = data
    })
    cy.fixture("contents").then(function (contents) {
      this.contents = contents
    })
    cy.viewport(1600, 1000)
    cy.login()
    cy.clearCookieConsentModal()
    cy.visit('/manage-images')
  });

  it('happy path', function () {  
    //cy.log(this.data)
    cy.waitFor('.pf-c-title')
    cy.wait(1000)
    cy.get(':nth-child(3) > .pf-c-button', { timeout: 30000 }).contains('Create new image').click()

    //Wizard header
    cy.get('.pf-c-wizard__header > h2').should('include.text', 'Create image')

    //Footer
    cy.get('.pf-c-button.pf-m-primary').contains('Next').should('to.be.disabled')
    cy.get('.pf-c-button.pf-m-secondary').contains('Back').should('to.be.disabled')
    cy.get('.pf-c-wizard__footer-cancel > .pf-c-button').contains('Cancel')

    //Details
    cy.get('.pf-c-form > .pf-c-title').should('include.text', 'Details')
    cy.get('.pf-c-content > p').should('include.text', this.contents.detailsContent)
    cy.get('.pf-c-form__group-label').find('.pf-c-form__label-text').should('include.text', 'Image name')
    
    const imageName = "cy-test-".concat(dayjs().format('DDMMYYYYHHmmss'))
    cy.get('#name').type(imageName)
    cy.get('.pf-c-wizard__footer > .pf-m-primary').contains('Next').click()

    //Options
    cy.get('.pf-c-form > .pf-c-title').should('include.text', 'Options')
    cy.get('.pf-c-content > p').should('include.text', this.contents.optionsContent)
    cy.get('.pf-c-form__label-text').should('include.text', 'Output type')

    cy.get('#rhel-edge-commit').should('be.checked')
    cy.get(':nth-child(1) > .pf-c-check__label').should('include.text', 'RHEL for Edge Commit (.tar)')
    cy.get(':nth-child(2)').find('.pf-c-helper-text__item-text')
      .should('include.text', this.contents.edgeCommitContent)
    
    cy.get('#rhel-edge-installer').should('be.checked')
    cy.get(':nth-child(3) > .pf-c-check__label').should('include.text', 'RHEL for Edge Installer (.iso)')
    cy.get(':nth-child(4)').find('.pf-c-helper-text__item-text')
      .should('include.text', this.contents.edgeInstallerContent)
   
    cy.get('.pf-m-visited').should('include.text', 'Learn more about image types.')
    cy.get('.pf-c-wizard__footer > .pf-m-primary').contains('Next').click()

    //Device registration
    cy.get('.pf-c-button.pf-m-primary').contains('Next').should('to.be.disabled')
    cy.get('.pf-c-form > .pf-c-title').should('include.text', 'Device registration')
    cy.get('.pf-c-form__label-text').should('include.text', 'Username')
    cy.get('#username').type(this.data.userName)

    cy.get(':nth-child(4)').find('.pf-c-form__label-text').should('include.text', 'SSH key')
    cy.get('#credentials').type(this.data.sshKey)
    cy.get('.pf-m-visited').should('include.text','Learn more about SSH keys')
    cy.get('.pf-c-button.pf-m-primary').contains('Next')
      .should('to.not.be.disabled')
      .click()

    //Custom repositories
    cy.get('.pf-c-form > .pf-c-title').should('include.text', 'Custom repositories')
    cy.get('.pf-c-content > p').should('include.text', this.contents.customRepoContent)

    //Custom repositories -- pagination
    cy.get('.pf-c-form > [id="toolbar-header"]').find('[aria-label="Items per page"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('[data-action="per-page-10"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('b').should('include.text', '1 - 10')


    cy.get('.pf-c-form > [id="toolbar-header"]').find('[aria-label="Items per page"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('[data-action="per-page-20"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('b').should('include.text', '1 - 20')

    cy.get('.pf-c-form > [id="toolbar-header"]').find('[aria-label="Items per page"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('[data-action="per-page-50"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('b').should('include.text', '1 - 50')

    cy.get('.pf-c-form > [id="toolbar-header"]').find('[aria-label="Items per page"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('[data-action="per-page-100"]').click()
    cy.get('.pf-c-form > [id="toolbar-header"]').find('b').should('include.text', '1 - 100')

    cy.get('.pf-c-wizard__footer > .pf-m-primary').contains('Next').click()

    //Additional packages
    cy.get('.pf-c-form > .pf-c-title').should('include.text', 'Additional packages')
    cy.get('.pf-c-content > p').should('include.text', this.contents.additionalPackagesContent)
    cy.get('.pf-m-available > .pf-c-dual-list-selector__header > .pf-c-dual-list-selector__title > .pf-c-dual-list-selector__title-text').should('include.text', 'Available packages')
    cy.get('.pf-m-chosen > .pf-c-dual-list-selector__header > .pf-c-dual-list-selector__title > .pf-c-dual-list-selector__title-text').should('include.text', 'Chosen packages')

    cy.get('[data-testid="available-search-input"]').type(this.data.packageName)
    cy.get('[data-testid="package-search"]').click()
    cy.get('[aria-label="Add all"]').click()
    cy.get('.pf-c-wizard__footer > .pf-m-primary').contains('Next').click()

    //Review
    cy.get('.pf-c-form > .pf-c-title').should('include.text', 'Review')
    cy.get('.pf-c-content > p').should('include.text', this.contents.reviewContent)

    cy.get('[data-testid="review-image-details"] > .pf-m-12-col > h2').should('include.text', 'Details')
    cy.get('[data-testid="review-image-details"] > :nth-child(2) > .pf-m-9-col > dd').should('include.text', imageName)
    cy.get('[data-testid="review-image-details"] > :nth-child(3) > .pf-m-9-col > dd').should('include.text','1')

    cy.get('[data-testid="review-image-registration"] > .pf-m-12-col > h2').should('include.text', 'Registration')
    cy.get('[data-testid="review-image-registration"] > :nth-child(2) > .pf-m-9-col > dd').should('include.text', this.data.userName)
    cy.get('[data-testid="review-image-registration"] > :nth-child(3) > .pf-m-9-col > dd').should('include.text', this.data.sshKey)

    cy.get('[data-testid="review-image-packages"] > .pf-m-12-col > h2').should('include.text', 'Packages')
    cy.get('[data-testid="review-image-packages"] > :nth-child(2) > .pf-m-9-col > dd').should('include.text','0')
    cy.get('[data-testid="review-image-packages"] > :nth-child(3) > .pf-m-9-col > dd').should('include.text','1')

    //Click Create image

    cy.get('.pf-c-wizard__footer > .pf-m-primary').click()
    cy.wait(2000)
    cy.get('.pf-c-alert__description').should('include.text', imageName)
    cy.get('.pf-c-search-input__text-input', { timeout: 30000 })
    .should('be.visible')
    .type(imageName)
    cy.wait(1000)
    cy.get('.pf-m-width-35 > a').should('include.text', imageName)
    cy.get(':nth-child(2) > p').should('include.text', 'Image build in progress')


  })


})