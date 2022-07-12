const imageName = 'acruzgon-20220627'
const release = 'Red Hat Enterprise Linux (RHEL) 9.0'
const outputTypes = ["RHEL for Edge Commit (.tar)", "RHEL for Edge Installer (.iso)"]
const packageName = 'python3'
const userName = 'acruzgon'
const sshKey = 'ssh-ed25519'

describe('Update image wizard', () => {
  beforeEach(() => {
    cy.viewport(1600, 1000)
    cy.login()
    cy.clearCookieConsentModal()
    cy.visit('/manage-images')
  });

  it('passes', () => {
    cy.waitFor('.pf-c-title')
    cy.get('.pf-c-search-input__text-input', { timeout: 30000 })
      .should('be.visible')
      .type(imageName)

    cy.wait(3000)
    cy.get('.pf-c-table__action').click()
    cy.wait(3000)
    cy.get('.pf-c-dropdown__menu-item').contains('Update Image').click()
    cy.wait(3000)
    cy.get('h2').should('include.text', 'Update image:')
    cy.get('.pf-c-button.pf-m-secondary').contains('Back').should('to.be.disabled')
    cy.get('.pf-c-button.pf-m-primary').contains('Next').click()

    //Options
    cy.get('h1').should('include.text', 'Options')
    cy.get('[id="rhel-edge-installer"]').check()
    cy.get('button').contains('Next').click()

    //Device registration
    cy.get('h1').should('include.text', 'Device registration')
    cy.get('button').contains('Next').click()

    //Custom repos
    cy.get('h1').should('include.text', 'Custom repositories')
    cy.get('button').contains('Next').click()

    //Additional packages
    cy.get('h1').should('include.text', 'Additional packages')
    cy.get('[id="available-textinput"]').type(packageName)
    cy.get('[data-testid="package-search"]').click()
    cy.get('[aria-label="Add all"]').click()
    cy.get('button').contains('Next').click()

    //Review
    cy.wait(1000)
    cy.get('h1').should('include.text', 'Review')

    cy.get('[data-testid="review-image-details"] > .pf-m-12-col > h2').should('include.text', 'Details')
    cy.get('[data-testid="review-image-details"] > :nth-child(2) > .pf-m-9-col > dd').should('include.text', imageName)


    cy.get('[data-testid="review-image-output"] > .pf-m-12-col > h2').should('include.text', 'Output')
    cy.get('[data-testid="review-image-output"] > :nth-child(2) > .pf-m-9-col > dd').should('include.text', release)
    cy.get('[data-testid="review-image-output"] > :nth-child(3) > .pf-m-9-col > dd').should('include.text', outputTypes[0])
    cy.get('[data-testid="review-image-output"] > :nth-child(4) > .pf-m-9-col > dd').should('include.text', outputTypes[1])

    cy.get('[data-testid="review-image-registration"] > .pf-m-12-col > h2').should('include.text', 'Registration')
    cy.get('[data-testid="review-image-registration"] > :nth-child(2) > .pf-m-9-col > dd').should('include.text', userName)
    cy.get('[data-testid="review-image-registration"] > :nth-child(3) > .pf-m-9-col > dd').contains(sshKey)

    cy.get('[data-testid="review-image-packages"] > .pf-m-12-col > h2').should('include.text', 'Packages')

  })

})