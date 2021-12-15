/// <reference types="cypress" />

describe('Ensure that web ui is up and running', () => {
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

    it('checks that no error message is present in the UI', () => {
        const warningMessage = 'Something went wrong';

        cy.waitFor('#UserMenu')
        cy.get('.pf-c-card__title')
            .should('have.text', 'Device summary')
        cy.get('h1[data-ouia-component-id="OUIA-Generated-Title-1"]')
            .should('not.contain', warningMessage);
    });

    it('opens nodes management page', () => {
        const nodesUrl = 'fleet-management'

        cy.visit('/' + nodesUrl)
        cy.url().should('include', nodesUrl)
        cy.get('.pf-c-card__title')
            .should('have.text', 'Device summary')
    });

    it('opens images management page', () => {
        const manageImagesUrl = 'manage-images'

        cy.visit('/' + manageImagesUrl)
        cy.url().should('include', manageImagesUrl)
        cy.waitFor('.pf-c-title')
        cy.get('.pf-c-title')
            .should('include.text', 'Manage images')
    });

    it('opens repositories management page', () => {
        const repositoriesUrl = 'repositories'

        cy.visit('/' + repositoriesUrl)
        cy.url().should('include', repositoriesUrl)
        cy.get('.pf-c-title')
            .should('include.text', 'Applications settings')
        cy.get('.pf-c-content > h1')
            .should('include.text', 'Custom repositories')
    });

    it('navigates to images management page', () => {
        const manageImagesUrl = 'manage-images'

        // App selector
        cy.waitFor('#nav-toggle > svg > path')
        cy.get('#nav-toggle > svg > path').click()
        // Manage Images menu
        cy.waitFor('.pf-c-nav__toggle-icon > svg')
        cy.get('.pf-c-nav__toggle-icon > svg').click()
        // Images menu
        cy.waitFor('[data-ouia-component-id="Images"] > [data-testid="router-link"]')
        cy.get('[data-ouia-component-id="Images"] > [data-testid="router-link"]').click()

        cy.url().should('include', manageImagesUrl)
        cy.get('.pf-c-title')
            .should('include.text', 'Manage images')

    });

    it('navigates to repositories page', () => {
        const repositoriesUrl = 'repositories'

        // App selector
        cy.waitFor('#nav-toggle > svg > path')
        cy.get('#nav-toggle > svg > path').click()
        // Manage Images menu
        cy.waitFor('.pf-c-nav__toggle-icon > svg')
        cy.get('.pf-c-nav__toggle-icon > svg').click()
        // Images menu
        cy.waitFor('[data-ouia-component-id="Custom repositories"] > [data-testid="router-link"]')
        cy.get('[data-ouia-component-id="Custom repositories"] > [data-testid="router-link"]').click()

        cy.url().should('include', repositoriesUrl)
        cy.get('.pf-c-title')
            .should('include.text', 'Applications settings')
        cy.get('.pf-c-content > h1')
            .should('include.text', 'Custom repositories')

    });

    it('navigates to nodes management page', () => {
        const nodesUrl = 'fleet-management'

        // App selector
        cy.waitFor('#nav-toggle > svg > path')
        cy.get('#nav-toggle > svg > path').click()
        // Fleet Management menu
        cy.waitFor('[data-ouia-component-id="Fleet management"] > [data-testid="router-link"]')
        cy.get('[data-ouia-component-id="Fleet management"] > [data-testid="router-link"]').click()

        cy.url().should('include', nodesUrl)
        cy.get('.pf-c-card__title')
            .should('have.text', 'Device summary')
    });
});
