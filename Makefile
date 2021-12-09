install-deps:
	npm install --save-dev start-server-and-test

open-cypress:
	npx cypress open --env configFile=local

test-local:
	BETA=true npm run start:proxy
	$(npm bin)/cypress open --env configFile=local

test-prod:
	npx cypress run --env configFile=prod

test-stage:
	npx cypress run --env configFile=stage

tests:
	npx cypress run

.PHONY: help install-deps open-cypress test-local test-prod test-stage tests