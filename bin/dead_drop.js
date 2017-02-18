#!/usr/bin/env node
'use strict';

const Config = require('../config/config');
const DeadDrop = require('..');

const internals = {};

internals.deadDrop = new DeadDrop(Config);

internals.main = () => {

  internals.deadDrop.run().catch((err) => {

    console.error(err.stack || err.message || err);
    process.exit(1);
  });
};

internals.main();
