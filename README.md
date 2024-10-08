# sweng861Grp5

Fall 2024 SWENG 861 Group 5

# BitFit

## Mission

Our mission is to empower individuals through innovative social fitness competitions regardless of user preference in wearable technology — together, we will get a BitFit.

## Problem

Vendor lock-in with fitness wearable brands creates a barrier where users cannot share their health and fitness data.

## Solution

Create a fitness tracking dashboard compatible with a variety of wearable devices for user convenience in tracking their friend's progress as well as their own.

## Product Scope

The product will be a web application. The scope of our app includes user registration, group formation, leaderboards, goal tracking, the display of health data for an individual, and public display of data for groups. We would like to utilize a pub-sub pattern to decouple the application’s services and allow for further evolution of the architecture. We want to support a maintainable application and will accomplish this through containers. The health data will be gathered via 3rd party SDKs and authentication to the user’s tracking device will be handled through 3rd parties.

Testing autolink with SCRUM-1

## Running the application

1) Ensure you have Docker and NPM installed

2) Run `sh env.sh` to copy the .env.example to a .env file in both root and app/ directory

3) Run `docker compose up -d` to run the compose file and spin the app up locally

a) If you want to work on the client or API, just shut down the equivalent container and spin up the dev server locally `npm run dev` after you have installed the dependencies.
