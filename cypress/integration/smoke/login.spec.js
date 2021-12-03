/// <reference types="cypress" />

describe('simple login to fleet management', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test

    const APP_ENV = Cypress.env('app_env');
    cy.visit(Cypress.env(`${APP_ENV}_host`));
  });

  it('displays an error during the initial login page', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    const userName = 'Feed the cat';
    const userPassword = 'Meow';
    const failedLogin = 'Invalid login or password';

    cy.waitFor('#username-verification');
    cy.get('#username-verification').type(`${userName}{enter}`);
    cy.waitFor('#password');
    cy.get('#password').type(`${userPassword}{enter}`);
    cy.get('#rh-login-form-error-title').should('contain', failedLogin);
  });
});
