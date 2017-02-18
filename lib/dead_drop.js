'use strict';

const Koa = require('koa');
const KoaRoute = require('koa-route');

const internals = {};

/**
 * The Dead Drop class is the main entry point for the application.
 *
 * @class DeadDrop
 * @param {DeadDrop.tConfiguration} config the initialization options to
 * extend the instance
 */
module.exports = internals.DeadDrop = class DeadDrop {

  constructor(config) {

    Object.assign(this, config);
  }

  /**
   * Initializes the application and starts listening. Also prints a
   * nice robotic banner with information.
   *
   * @function run
   * @memberof DeadDrop
   * @instance
   */
  run() {

    this._initializeServer();
    this._startServer();
    this._printBanner();

    return Promise.resolve();
  }

  // Initializes the Koa application and all the handlers.

  _initializeServer() {

    this._app = Koa();

    this._app.use(KoaRoute.get('/menus/main', function * () {

      this.body = 'I will return the main menu.';
    }));

    this._app.use(KoaRoute.post('/menus/main', function * () {

      this.body = 'I will parse the main menu.';
    }));

    this._app.use(KoaRoute.get('/menus/recording', function * () {

      this.body = 'I will return the select recording menu.';
    }));

    this._app.use(KoaRoute.post('/menus/recording', function * () {

      this.body = 'I will parse the select recording menu.';
    }));

    this._app.use(KoaRoute.get('/recordings', function * () {

      this.body = 'I will initiate recording process';
    }));

    this._app.use(KoaRoute.post('/recordings', function * () {

      this.body = 'I will create a new recording';
    }));

    this._app.use(KoaRoute.get('/recordings/:id', function * (id) {

      id = parseInt(id);

      if (id === 0) {
        this.body = 'I will return a random recording';
      }
      else {
        this.body = 'I will return a specific recording';
      }
    }));

    this._app.use(function * () {

      this.body = 'hello, world';
    });

  }

  // Starts listening

  _startServer() {

    this._app.listen(this.port);
  }

  // Prints the banner.

  _printBanner() {

    console.log('      >o<');
    console.log('    /-----\\');
    console.log(`    |ú   ù|  - Happy to listen on: ${this.port}`);
    console.log('    |  U  |');
    console.log('     \\---/');
    console.log('  +---------+');
    console.log(' ~|    ()   |~');
    console.log(' ~|    /\\   | ~');
    console.log(' ~|    \\/   |  ~c');
    console.log(' ^+---------+');
    console.log('   (o==o==o) ');

  }
};
