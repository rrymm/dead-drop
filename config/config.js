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
 * @property {DeadDrop.tRedisConfiguration} redis the configuration to
 * connect to the redis server
 */
module.exports = internals.Config = {
  port: Getenv.int('DEAD_DROP_PORT', 1988),

  /**
   * Information required to connect to the redis server
   *
   * @memberof DeadDrop
   * @typedef {object} tRedisConfiguration
   * @property {string} host the location of the redis host
   * @property {string} [post=6379] port where redis server is listening
   */
  redis: {
    host: Getenv('DEAD_DROP_REDIS_HOST'),
    port: Getenv.int('DEAD_DROP_REDIS_PORT', 6379)
  }
};
