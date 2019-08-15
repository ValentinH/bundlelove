# bundlelove

A clone of the awesome [bundlephobia.com](https://bundlephobia.com).

This application is split in two parts:

- a react application using [create-react-app](https://create-react-app.dev) (in the `app` folder)
- an express api served as an AWS lambda using [serverless](https://serverless.com/framework/docs/) (in the `api` folder)

## Quick start

```sh
# install the dependencies
yarn install
# run both the react app and the local api
yarn start
```

## react application (app folder)

The first page of the application is the landing page (https://bundlelove.now.sh). It simply provides a search autocomplete input
that let the user search for npm packages.

Then, the main page is the result page (https://bundlelove.now.sh/result?p=react-easy-crop). It contains 4 main components:

- the search input (shared with the landing page)
- the Stats card that shows the "minified" and "minified + gzip" sizes along with the estimated download times for 2G and 3G.
  Hovering a time value will highlight it with an animation which duration matches the value.
- the History card that shows a graph presenting the sizes of the last 3 versions plus the previous major one (if there is one).
  Clicking a bar will go to the corresponding version result page.
- the Composition card that shows a treemap presenting the size of each dependency of the module. Clicking a dependency rectangle
  will open the corresponding result page in a new tab.

### scripts

- `start` starts the app on the 3000 port.
- `test` runs the unit and integration tests.
- `build` generates the production version of the app.
- `deploy` deploys the application to the production target of now.sh.

### built with

- [typescript](https://www.typescriptlang.org) for static type-checking
- [material-ui](https://material-ui.com) for most of the UI components and writing the styles
- [react-router](https://reacttraining.com/react-router/web/guides/quick-start) for routing
- [jest](https://jestjs.io) for running the unit and integration tests
- [react-testing-library](https://testing-library.com/docs/react-testing-library/intro) for testing the components
- [ky](https://github.com/sindresorhus/ky) for the HTTP requests
- [downshift](https://github.com/downshift-js/downshift) for the packages autocomplete component
- [npms.io search api](https://api-docs.npms.io) for the packages autocomplete data
- [d3-hierarchy](https://github.com/d3/d3-hierarchy) for generating the composition treemap

## express api (api folder)

This api is responsible for providing the package information.
It mostly uses [package-build-stats](https://github.com/pastelsky/package-build-stats) to compute the package
sizes (this is the module powering bundlephobia's backend) and the [yarn registry](https://registry.yarnpkg.com)
to retrieve the package metadata.

As computing the sizes is quite slow, I've added a DynamoDB database to cache the previously computed data.

### endpoints

`GET /stats?name=react&version=16.0.0`:

Computes the stats for the given package version (if version is omitted it uses the latest).

`GET /history?name=react`:

Computes the sizes for the 3 latest versions plus the previous major one (if it exists).

### scripts

- `start` starts the api on the 3001 port.
- `test` runs the unit tests.
- `deploy:dev` deploys the api and the database to the dev environment on AWS
- `deploy:prod` deploys the api and the database to the production environment on AWS

### built with

- [serverless](https://serverless.com/framework/docs/) to deploy the api and its database to AWS
- [serverless-offline](https://www.npmjs.com/package/serverless-offline) to run the api locally
- [package-build-stats](https://github.com/pastelsky/package-build-stats) to compute the package sizes (this is the module powering bundlephobia's backend)
- [yarn registry](https://registry.yarnpkg.com) to retrieve the package information
- [pkg-versions](https://github.com/sindresorhus/pkg-versions) to retrieve all the versions of a package
- [got](https://github.com/sindresorhus/got) for the HTTP requests
- [aws-sdk](https://www.npmjs.com/package/aws-sdk) to query the DynamoDB database

## end-to-end tests

I've written a few end-to-end tests using [Cypress](https://www.cypress.io). The goal is to ensure that the app
and the api work well together. It is run as a last step of the CI/CD pipeline (see below).

You can see the UI output by running this command in the root folder:

```sh
yarn start
yarn cy:open
```

## CI/CD pipeline

In order to automatically deploy the application, I've set up this [circleci](https://circleci.com) workflow:
![image](https://user-images.githubusercontent.com/2678610/63109933-8fc5ae80-bf8a-11e9-8b4f-b77d6babdc10.png)

It contains 3 jobs:

- `app`: run the jest tests and deploy the react application to [now.sh](http://now.sh)
- `api`: run the jest tests and deploy the express api and the database to AWS lambda
- `e2e`: run the cypress tests directly on the production app (https://bundlelove.now.sh) once the 2 other jobs are completed.

> This pipeline is a simple demo using CircleCI to deploy all the components of the application.
> Running the e2e tests once everything is deployed won't prevent us from breaking the production, it will only alert if
> something went wrong. As an improvement, we could imagine deploying both the app and the api to a staging environment, run the e2e tests
> and only deploy to production if the tests pass.