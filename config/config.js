'use strict';

const Getenv = require('getenv');

const internals = {};

/**
 * The main configuration object for Dead Drop. It will be used to
 * initialize all of the sub-components. It can extend any property of
 * the dead drop object.
 *
 * @memberof DeadDrop
 * @typedef {object} tConfiguration
 * @property {number} [port=1988] the port where the app will listen on
 */
module.exports = internals.Config = {
  port: Getenv.int('DEAD_DROP_PORT', 1988)
};
