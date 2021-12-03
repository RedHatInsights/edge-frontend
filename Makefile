install-deps:
	npm install

open-cypress:
	npx cypress open

tests:
	npx cypress run

.PHONY: help install-deps open-cypress tests