[![Build Status](https://travis-ci.com/RedHatInsights/edge-frontend.svg?branch=master)](https://travis-ci.com/RedHatInsights/edge-frontend)

# Overview
- [About](#about)
- [Tools](#tools)
- [Setup](#setup)

# About
The edge-frontend repo is the front-end for [RHEL for Edge/Fleet managment ](https://console.stage.redhat.com/edge/fleet-management), which is part of console.redhat.com.

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

## Insights-Proxy
[Insights-proxy](https://github.com/RedHatInsights/insights-proxy) is the proxy this repo uses to combine together local code and remote code. In this repo we use insights to combine our local edge-frontend code to the remote code that runs console.redhat.com.

## Spandx
[spandx](https://github.com/redhataccess/spandx) is an HTTP switchboard. With it, you can weave together pieces of a large, complex website by choosing which resources should come from your local system and which should come from a remote environment.

For example, you could point spandx at your production site, but route `/static/js` to a local directory, which allows you to test your local JS against the production environment. Code in production, it's fun.

More technically, spandx is a flexible, configuration-based reverse proxy for local development.

## Patternfly
[PatternFly](https://www.patternfly.org/v4/) is an open source design system created to enable consistency and usability across a wide range of applications and use cases. PatternFly provides clear standards, guidance, and tools that help designers and developers work together more efficiently and build better user experiences.

## Frontend-Components
[Frontend-components](https://github.com/RedHatInsights/frontend-components) is a monorepo of Red Hat Cloud services Components for applications in a React.js environment. This repo uses a lot of components imported from the frontend-components repo using module federation.

## Module Federation
[Module Federation](https://webpack.js.org/concepts/module-federation/) is a feature in Webpack that allows for sharing components outside a repo. When importing a component with module federation, the component is bundled with it's dependances.

## Data Driven Forms
[Data Driven Forms](https://data-driven-forms.org/) converts JSON form definitions (schemas) into fully functional React forms with the provided set of features.

# Setup
Install all dependencies
```bash
npm install
```
**NOTE:**
You will need to run cloud-services-config until edge-frontend is on a stable branch

## Setting up cloud-services-config

Clone [cloud-services-config](https://github.com/RedHatInsights/cloud-services-config) to your local machine and navigate into the cloned directory.

Copy `main.yml` to its own config directory.

```bash
mkdir config
cp main.yml config
```

Start `http-server`
```bash
npx http-server -p 8889
```
### *You can choose to either run the application with [webpack-proxy](#running-locally-with-webpack-proxy) or with [insights-proxy](#running-locally-with-insights-proxy).*
*If you need to run edge-api locally you will need to use insights-proxy.*

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

Run the application in beta environment - beta only supported
```bash
BETA=true npm run start:proxy
```
**Edge application will be available on https://ci.foo.redhat.com:1337/beta/edge/fleet-management**

## Running locally with insights-proxy

Follow the guide on [insights-proxy](https://github.com/RedHatInsights/insights-proxy) on how to install proxy.

Once insights-proxy is setup, run Spandx with the following commands:

### **For frontend only**
In one terminal run
```bash
USE_CLOUD=true SPANDX_CONFIG=./profiles/local-frontend.js ../insights-proxy/scripts/run.sh
```

### **For frontend and backend** 

In one terminal setup and run [Edge-api](https://github.com/RedHatInsights/edge-api)

In another terminal run
 
```bash
USE_CLOUD=true SPANDX_CONFIG=./profiles/local-frontend-and-api.js ../insights-proxy/scripts/run.sh
```

After running SPANDX open another terminal and run

```bash
npm start
```
**Edge application will be available on https://ci.foo.redhat.com:1337/beta/edge/fleet-management**
