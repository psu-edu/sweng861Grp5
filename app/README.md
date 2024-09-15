# Contributing to the App

## Running in Dev mode

The project is using nodemon to watch files for changes and hot reload the project, this can be accomplished by running `npm run dev`

## Building and Starting the server

Use `npm run build` to bundle the project to a dist directory, then `npm run start` will start the project

## Running with Docker

The project was bootrapped with `docker init` and can run the dockerfile through the docker compose in the root of the project

## Lint and Formatting

[Eslint](https://eslint.org/) and [Prettier](https://prettier.io/) have been setup to help support linting and formatting, these can be used with `npm run lint` to see what may change and `npm run lint -- --fix` to change based on the recommended rulesets
