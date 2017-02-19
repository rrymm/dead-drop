'use strict';

const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const KoaRoute = require('koa-route');

const MainMenuController = require('./controllers/main_menu');
const RecordingMenuController = require('./controllers/recording_menu');
const RecordingsController = require('./controllers/recordings');

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

    this._app.use(KoaBodyParser());

    this._initializeMainMenuRoutes();
    this._initializeRecordingMenuRoutes();
    this._initializeRecordingsRoutes();

    this._app.use(function * () {

      this.body = 'How did you get here? Shoo!';
    });

  }

  // Starts listening

  _startServer() {

    this._app.listen(this.port);
  }

  // Initializes the main menu routes.

  _initializeMainMenuRoutes() {

    const mainMenuController = new MainMenuController();

    this._app.use(KoaRoute.get('/menus/main', mainMenuController.serveMenu()));
    this._app.use(KoaRoute.post('/menus/main', mainMenuController.parseMenuSelection()));
  }

  // Initializes the recording menu routes.

  _initializeRecordingMenuRoutes() {

    const recordingMenuController = new RecordingMenuController();

    this._app.use(KoaRoute.get('/menus/recording', recordingMenuController.serveMenu()));
    this._app.use(KoaRoute.post('/menus/recording', recordingMenuController.parseMenuSelection()));
  }

  // Initializes the recordings routes.

  _initializeRecordingsRoutes() {

    const recordingsController = new RecordingsController({
      redis: this.redis
    });

    this._app.use(KoaRoute.get('/recordings', recordingsController.startRecording()));
    this._app.use(KoaRoute.post('/recordings', recordingsController.saveRecording()));
    this._app.use(KoaRoute.get('/recordings/:id', recordingsController.getRecording()));
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
