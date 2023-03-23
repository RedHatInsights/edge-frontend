#!/bin/bash

# --------------------------------------------
# Export vars for helper scripts to use
# --------------------------------------------
# name of app-sre "application" folder this component lives in; needs to match for quay
export COMPONENT="edge"
# IMAGE should match the quay repo set by app.yaml in app-interface
export IMAGE="quay.io/cloudservices/edge-frontend"
export WORKSPACE=${WORKSPACE:-$APP_ROOT} # if running in jenkins, use the build's workspace
export APP_ROOT=$(pwd)
export CONTAINER_NAME="cypress_execution"
#16 is the default Node version. Change this to override it.
export NODE_BUILD_VERSION=14
COMMON_BUILDER=https://raw.githubusercontent.com/RedHatInsights/insights-frontend-builder-common/master

# --------------------------------------------
# Options that must be configured by app owner
# --------------------------------------------

IQE_PLUGINS="edge"
IQE_MARKER_EXPRESSION="smoke"
IQE_FILTER_EXPRESSION=""
    


# set -exv
set -xv
echo "Before Cypress E2E run"    
 docker rm -f $CONTAINER_NAME || true
docker run -t --name $CONTAINER_NAME \
  -v $PWD:/e2e:ro,Z \
  -w /e2e \
  -e E2E_USERNAME=$E2E_USERNAME \
  -e E2E_PASSWORD=$E2E_PASSWORD \
  --add-host stage.foo.redhat.com:127.0.0.1 \
  --add-host prod.foo.redhat.com:127.0.0.1 \
  --entrypoint bash \
  quay.io/cloudservices/cypress-e2e-image:9f5d140 /e2e/run_e2e.sh

echo "After Cypress E2E run"

# source is preferred to | bash -s in this case to avoid a subshell
source <(curl -sSL $COMMON_BUILDER/src/frontend-build.sh)
BUILD_RESULTS=$?
    

# Stubbed out for now
mkdir -p $WORKSPACE/artifacts
cat << EOF > $WORKSPACE/artifacts/junit-dummy.xml
<testsuite tests="1">
    <testcase classname="dummy" name="dummytest"/>
</testsuite>
EOF

exit $BUILD_RESULTS

#after_success:
# build_deploy_stable.sh 

-v /var/lib/jenkins/workspace/RedHatInsights-edge-frontend-pr-check:/workspace:ro,Z

-v /var/lib/jenkins/workspace/RedHatInsights-edge-frontend-pr-check/build/container_workspace:/e2e:ro,Z