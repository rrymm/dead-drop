# dead-drop
A phone messaging system

## Configuring

This project usese environment variables to work. For most cases, the
defaults work but some sensitive info like keys must be overridden. Copy
the file in `config/env.dist` to `.env` in the project root and override
the values.

When running with `make run`, it'll pick up these values automatically.
If you're doing it the hard way, you'll have to source them. You must
set the `DEAD_DROP_ACCOUNT_SID` to match your account sid. This is so
dead drop can filter out calls from other accounts.

## Running Locally

You'll need [Docker][docker] to run the project.

* Run the image with `make run`

## Running locally the hard way

If you don't want to use docker, you can also run it the old fashioned
way.

1. Install dependencies with `yarn install` (recommended), or `npm install`
2. Run with `npm start`

## Generating documentation

This project uses JSDoc to generate documentation. Generate everything
with `npm run document`. The documentation will be generated in the
`doc` directory.

## Building and pushing the image

You can also do some other operations

* Build the image with `make build`
* Push and build the image with `make upload`
* Clean the environment with `make clean`

## Setting up Twilio

Get a twilio number, and on the configuration set the voice settings to
"Webhooks/TwiML" and point the `A call comes in` hook to:
the `/menus/main/` path of your dead drop installation. For example: 
`https://dead-drop.unlimited.piza/menus/main`. It must be accessible
from the internet.

You will also need your account sid. This is obtained from the "[Account
Settings][account-settings]" area in the twilio dashboard.

## Checking the code

This project uses the [Hapi Style Guide][hapi-style-guide] for
javascript style, and includes eslint configuration to check them. Run
`npm run lint` to check the code.

[docker]: https://www.docker.com/
[hapi-style-guide]: https://hapijs.com/styleguide
[account-settings]: https://www.twilio.com/console/account/settings
