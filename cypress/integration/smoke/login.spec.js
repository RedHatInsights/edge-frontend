/// <reference types="cypress" />

describe('simple login to fleet management', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test

        //const APP_ENV = Cypress.env('app_env');
        //cy.visit(Cypress.env(`${APP_ENV}_host`));
        cy.visit(Cypress.config().baseUrl)
    });

    it('displays an error during the initial login page', () => {
        const userName = Cypress.env('username');
        const userPassword = Cypress.env('password');
        const failedLogin = 'Invalid login or password';

        cy.waitFor('#username-verification');
        cy.get('#username-verification')
            .type(`${userName}{enter}`);
        cy.waitFor('#password');
        cy.get('#password')
            .type(`${userPassword}{enter}`);
        cy.get('#rh-login-form-error-title')
            .should('contain', failedLogin);
    });
});
