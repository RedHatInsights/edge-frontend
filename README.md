**NOTE**
As of July 31, 2025, the hosted edge management service will no longer be supported. This means that pushing image updates to Immutable (OSTree) systems using the Hybrid Cloud Console will be discontinued, and this repo will be archived. For an alternative way to manage edge systems, customers are encouraged to explore [Red Hat Edge Manager (RHEM)](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/managing_device_fleets_with_the_red_hat_edge_manager/index).

[![Build Status](https://travis-ci.com/RedHatInsights/edge-frontend.svg?branch=master)](https://travis-ci.com/RedHatInsights/edge-frontend)

# Overview
- [About](#about)
- [Tools](#tools)
- [Setup](#setup)

# About
The `edge-frontend` repository contains the front-end code for [RHEL for Edge/Fleet Management](https://console.stage.redhat.com/edge/fleet-management), a part of the [console.redhat.com](https://console.redhat.com) platform.


# Tools
- [Cloud-Services-Config](#cloud-services-config)
- [Insights-Proxy](#insights-proxy)
- [Spandx](#spandx)
- [Patternfly](#patternfly)
- [Frontend-Components](#frontend-components)
- [Module Federation](#module-federation)
- [Data-Driven-Forms](#data-driven-forms)

## Cloud-Services-Config
[Cloud-service-config](https://github.com/RedHatInsights/cloud-services-config) is used to run Red Hat Hybrid Cloud Console locally. RHEL for Edge/Fleet Management is part of Red Hat Hybrid Cloud Console. 

## Spandx
[spandx](https://github.com/redhataccess/spandx) is an HTTP switchboard. With it, you can weave together pieces of a large, complex website by choosing which resources should come from your local system and which should come from a remote environment.

For example, you could point spandx at your production site, but route `/static/js` to a local directory, which allows you to test your local JS against the production environment. Code in production, it's fun.

More technically, spandx is a flexible, configuration-based reverse proxy for local development.

## Patternfly
[PatternFly](https://www.patternfly.org/v4/) is an open source design system created to enable consistency and usability across a wide range of applications and use cases. PatternFly provides clear standards, guidance, and tools that help designers and developers work together more efficiently and build better user experiences.

## Frontend-Components
[Frontend-components](https://github.com/RedHatInsights/frontend-components) is a monorepo of Red Hat Cloud services Components for applications in a React.js environment. This repo uses a lot of components imported from the frontend-components repo using module federation.

## Module Federation
[Module Federation](https://webpack.js.org/concepts/module-federation/) is a feature in Webpack that allows for sharing components outside a repo. When importing a component with module federation, the component is bundled with it's dependencies.

## Data Driven Forms
[Data Driven Forms](https://data-driven-forms.org/) converts JSON form definitions (schemas) into fully functional React forms with the provided set of features.

# Setup
Install all dependencies
Install NVM
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```
Source the new instructions NVM added to .bashrc
```
source ~/.bashrc
```
Install version 16
```bash
nvm install 16
```
Use version 16
```
nvm use 16
```
install dependencies
```
npm install
```
Verify that node version should be 16.13.0 <= 16.13.1

## Running locally with webpack-proxy

Add `prod.foo.redhat.com`, `stage.foo.redhat.com`, `qa.foo.redhat.com` and  `ci.foo.redhat.com` to your `/etc/hosts` file (one time action). Follow this guide on [how to edit your `/etc/hosts file`](https://docs.rackspace.com/support/how-to/modify-your-hosts-file/)

Your `/etc/hosts` file can look like:

```bash
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
127.0.0.1 qa.foo.redhat.com
127.0.0.1 ci.foo.redhat.com
127.0.0.1 qaprodauth.foo.redhat.com
```

### **For frontend only**

Run the application in beta environment - beta only supported
```bash
BETA=true npm run start:proxy
```

### **For frontend and backend**

Run the application in beta environment - beta only supported
```bash
API_PORT=3000 BETA=true npm run start:proxy
```
**Edge application will be available on https://stage.foo.redhat.com:1337/preview/edge/fleet-management**

To switch environment (for instance if you want to run your app with prod DB)
```bash
ENVIRONMENT=prod BETA=true npm run start:proxy
```
**Edge application will be available on https://prod.foo.redhat.com:1337/preview/edge/fleet-management**

### **For frontend federated**
```bash
BETA=true npm run start:federated
```
