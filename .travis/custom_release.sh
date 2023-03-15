#!/bin/bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-beta"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-beta"
        echo "PUSHING ${env}-stable"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-stable"
    done
fi

if [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
 for env in beta stable
    do
        echo "PUSHING prod-${env}"
        rm -rf ./build/.git
        .travis/release.sh "prod-${env}"
    done
fi
