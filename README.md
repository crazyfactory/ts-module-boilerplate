# translation_updater

[![Greenkeeper badge](https://badges.greenkeeper.io/crazyfactory/translation_updater.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/crazyfactory/translation_updater.svg)](https://travis-ci.org/crazyfactory/translation_updater)
[![GitHub issues](https://img.shields.io/github/issues/crazyfactory/translation_updater.svg)](https://github.com/crazyfactory/translation_updater/issues)
[![codecov](https://codecov.io/gh/crazyfactory/translation_updater/branch/master/graph/badge.svg)](https://codecov.io/gh/crazyfactory/translation_updater)
[![devDependencies Status](https://david-dm.org/crazyfactory/translation_updater/dev-status.svg)](https://david-dm.org/crazyfactory/translation_updater?type=dev)
[![dependencies Status](https://david-dm.org/crazyfactory/translation_updater/status.svg)](https://david-dm.org/crazyfactory/translation_updater)

This CLI tool helps to manage translations on individual packages,
and automatically creates PR to target repository on any new releases on travis.

Any time there's a new release in any package, simply run this CLI, it should automatically create a new PR to target repository with your translations.

## Terminology
### Target repository
Main repository where translations are going to be consumed.

### Source repository
Your package repository where you store translations.

## Usage

Initially you should:

- Add translations on your project.
- setup travis
- set the following environment variables in your source repository:
  - `GH_TOKEN` token which has access to your target repository
  - `LANGUAGE_PATH` path to translation file on your source repository
  - `TARGET_LANGUAGE_PATH` path to translation file to be created on target repository
  - `PROJECT_NAME` best to use name of your package without special characters. This is used name of branch created in target repository
- on `after_success`, simply run this cli

If everything goes well, a new PR should be created in target repository. If not, file an issue.
