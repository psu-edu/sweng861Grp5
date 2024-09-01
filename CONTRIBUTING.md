# Contributing Guidelines

This is the contributing guidelines for BitFit. Our mission is to empower individuals through innovative social fitness competitions regardless of user preference in wearable technology — together, we will get a BitFit.

Please follow these guidelines to ensure a collaborative and consistent development experience.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Commit Message Guidelines](#commit-message-guidelines)
3. [Branching Strategy](#branching-strategy)
4. [Testing Requirements](#testing-requirements)
5. [Pull Request Process](#pull-request-process)

## Project Setup

Due to the technical requirements and scope of this project, Visual Studio Community 2022 has been chosen as the IDE for this project due to its support of Python and React at no additional cost to developers.
Visual Studio Installation Steps

1. Download Visual Studio 2022 Community Edition from <https://visualstudio.microsoft.com/>
Select the following workloads to download with the initial installation:

- Python Development
- Python Web Support
- ASP.NET Web Development
- Node.JS

2. Sign into Visual Studio using PSU email.
3. Clone project repository from GitHub. Link: psu-edu/sweng861Grp5: Fall 2024 SWENG 861 Group 5 (github.com)
4. Download preferred extensions to enhance developer workflow.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to standardize commit messages.

Types include:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (e.g., formatting)
- refactor: A code change that neither fixes a bug nor adds a feature
- test: Adding missing tests or correcting existing tests
- chore: Other changes like infra or CI/CD

## Branching Strategy

We follow a [Trunk-based Branching Strategy](https://www.atlassian.com/continuous-delivery/continuous-integration/trunk-based-development)
In order to accommodate scaling up the project as it grows over time, we will be implementing a Scaled Trunk-Based Development approach within our GitHub repository. This will consist of a main branch (trunk) that will act as the continuous development branch . New features that have been outlined in Epics/Stories that have been agreed upon by the team will be developed in downstream feature branches adhering to the following format: feature/<new-capability>. After sufficient review and approval by the team, these feature branches will be merged back into the main branch. Lastly, versioned release branches will be cut from the main branch using semantic versioning standards. i.e release/1.0.0.

## Testing Requirements

## Pull Request Process

When submitting a pull request (PR), please follow these guidelines:

1. Ensure your branch is to date with Main.
2. Open a pull request with the PR template filled out so we can link the branch to the Jira Issue
3. Ensure all tests pass, and linting issues are resolved.
