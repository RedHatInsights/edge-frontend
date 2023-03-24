#!/bin/bash
WK_DIR=/home/tester/workspace
mkdir $WK_DIR
cp . -r $WK_DIR/
cd $WK_DIR
npm i
npx cypress run --env configFile=e2e --e2e --spec cypress/e2e/visitis/Visits.cy.js
 # npx cypress run --env configFile=e2e --e2e --spec cypress/e2e/images/Images.cy.js
# npx cypress run --env configFile=e2e --e2e --spec cypress/e2e/systems/Systems.cy.js