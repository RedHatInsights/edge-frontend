/// //<reference types="cypress" />

describe('simple login to fleet management', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit(Cypress.env('stage_host'))
    })

    it('displays an error during the initial login page', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        const wrongUserName = 'Feed the cat'
        const wrongUserPassword = 'Meow'
        const failedLogin = 'Invalid login or password'
        
        cy.waitFor('#username-verification')
        cy.get('#username-verification').type(`${wrongUserName}{enter}`)
        cy.waitFor('#password')
        cy.get('#password').type(`${wrongUserPassword}{enter}`)
        cy.get('#rh-login-form-error-title')
            .should('contain', failedLogin)
    })

    it('login successfully', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        const userName = Cypress.env('stage_user')
        const userPassword = Cypress.env('stage_password')

        cy.waitFor('#username-verification')
        cy.get('#username-verification').type(`${wrongUserName}{enter}`)
        cy.waitFor('#password')
        cy.get('#password').type(`${wrongUserPassword}{enter}`)
        cy.get('#rh-login-form-error-title')
            .should('contain', failedLogin)
    })

    it('login successfully', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        const userName = Cypress.env('stage_user')
        const userPassword = Cypress.env('stage_password')

        cy.waitFor('#username-verification')
        cy.get('#username-verification').type(`${wrongUserName}{enter}`)
        cy.waitFor('#password')
        cy.get('#password').type(`${wrongUserPassword}{enter}`)
        cy.get('#rh-login-form-error-title')
            .should('contain', failedLogin)
    })

    it('login successfully', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        const userName = Cypress.env('stage_user')
        const userPassword = Cypress.env('stage_password')

        cy.waitFor('#username-verification')
        cy.get('#username-verification').type(`${wrongUserName}{enter}`)
        cy.waitFor('#password')
        cy.get('#password').type(`${wrongUserPassword}{enter}`)
        cy.get('#rh-login-form-error-title')
            .should('contain', failedLogin)
    })

    it('login successfully', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        const userName = Cypress.env('stage_user')
        const userPassword = Cypress.env('stage_password')

        cy.waitFor('#username-verification')
        cy.get('#username-verification').type(`${userName}{enter}`)
        cy.waitFor('#password')
        cy.get('#password').type(`${userPassword}{enter}`)
        cy.url()
            .should('include', '/fleet-management')
    })
});
