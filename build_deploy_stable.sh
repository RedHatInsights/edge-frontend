#!/bin/bash
set -e
set -x
export NEW_RELEASE_TAG="FLEET-X.Y.Z"

export FRONTEND="edge-frontend"
export FRONTEND_URL="git@github.com:RedHatInsights/edge-frontend.git"

export WORKING_DIR="$HOME/playground"
export ANNOTATION_MSG="Releasing Fleet Management Front End $NEW_RELEASE_TAG"


    create_workdir
    clean_frontend
    checkout_frontend
    create_release_tag
    push_release_tag
    git checkout prod-stable
    git rebase $NEW_RELEASE_TAG
    git push origin prod-stable -f


create_workdir() {
    if [ ! -d $WORKING_DIR ]; then
        echo "Creating $WORKING_DIR directory"
        mkdir -p $WORKING_DIR;
    fi
}

clean_frontend() {
    rm -rf $WORKING_DIR/$FRONTEND
}
checkout_frontend() {
    cd $WORKING_DIR
    git clone $FRONTEND_URL
    cd $FRONTEND
}

create_release_tag() {
    git tag -a "$NEW_RELEASE_TAG" -m "$ANNOTATION_MSG"
    echo "New release tag: $NEW_RELEASE_TAG"
}

push_release_tag() {
    git push origin $NEW_RELEASE_TAG
}