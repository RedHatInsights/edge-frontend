[![Build Status](https://travis-ci.com/RedHatInsights/edge-frontend.svg?branch=master)](https://travis-ci.com/RedHatInsights/edge-frontend)

# edge-frontend

## Getting Started

Install all dependencies

```bash
>$ npm install
```

You can choose to either run the application with [webpack-proxy](#running-locally-with-webpack-proxy) or with [insights-proxy](#running-locally-with-insights-proxy).

### Running locally with webpack-proxy

Add `prod.foo.redhat.com`, `stage.foo.redhat.com`, `qa.foo.redhat.com` and  `ci.foo.redhat.com` to your `/etc/hosts` file (one time action). Follow this guide on [how to edit your `/etc/hosts file`](https://docs.rackspace.com/support/how-to/modify-your-hosts-file/)

Your `/etc/hosts` file can look like:

```bash
127.0.0.1 prod.foo.redhat.com
127.0.0.1 stage.foo.redhat.com
127.0.0.1 qa.foo.redhat.com
127.0.0.1 ci.foo.redhat.com
127.0.0.1 qaprodauth.foo.redhat.com
```

Run the application - beta only supported
```bash
>$ BETA=true npm run start:proxy
```

**Edge application will be available on https://ci.foo.redhat.com:1337/beta/edge/fleet-management**

### Running locally with insights-proxy

Follow the guide on [insights-proxy](https://github.com/RedHatInsights/insights-proxy) on how to install proxy.

Once docker is installed and set run `SPANDX_CONFIG=./profiles/local-frontend.js ../insights-proxy/scripts/run.sh` in one terminal.

Open another terminal and run

```bash
>$ npm start
```

**Edge application will be available on https://ci.foo.redhat.com:1337/edge/fleet-management**
