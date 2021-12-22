/// <reference types="cypress" />

describe('simple login to fleet management', () => {
    beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)
    });

    it('displays an error for incorrect login attempt', () => {
        const userName = Cypress.env('username');
        const userPassword = 'Meow';
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
