// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Choosing to ignore Pendo errors for now
Cypress.on('uncaught:exception', (err, runnable, promise) => {
    if (err) {
        console.log('Cypress is ignoring the following error:')
        console.log(err)
        return false;
    }

    if (promise) {
        console.log('Cypress is ignoring the following promise:')
        console.log(promise)
        return false
    }
    // return false;
});

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
