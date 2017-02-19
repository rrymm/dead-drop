'use strict';

const Twilio = require('twilio');

const internals = {};

internals.kMenuTimeout = 10; // timeout in seconds
internals.kContentType = 'application/xml'; // The content type used to respond
internals.kMenuLanguage = 'es-mx'; // the language to use
internals.kMainMenuRoute = '/menus/main';
internals.kListenMessageRoute = '/recordings/';
internals.kMenuMessage = 'Escribe el numero de mensaje y presiona # para terminar.';
internals.kTimeoutMessage = 'Bueno... volviendo al menú principal.';
internals.kMenuInvalidResponseMessage = 'No entendí... Volviendo al menu principal.'; // invalid selection message

/**
 * Handles the HTTP requests for the recording menu
 *
 * @class RecordingMenuController
 */
module.exports = internals.RecordingMenuController = class RecordingMenuController {

  /**
   * Serves the menu
   *
   * @function serveMenu
   * @memberof RecordingMenuController
   * @instance
   * @return {generator} a koa compatible handler generator function
   */
  serveMenu() {

    return function * () {

      const response = new Twilio.TwimlResponse();

      // the action will default to post in the same URL, so no change
      // required there.
      response.gather({
        timeout: internals.kMenuTimeout
      }, function nestedHandler() {

        this.say(internals.kMenuMessage, { language: internals.kMenuLanguage });
      })
      .say(internals.kTimeoutMessage, { language: internals.kMenuLanguage })
      .redirect(internals.kMainMenuRoute, { method: 'GET' });

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }

  /**
   * Parses the selected recording id
   *
   * @function parseMenuSelection
   * @memberof RecordingMenuController
   * @instance
   * @return {generator} a koa compatible handler generator function
   */
  parseMenuSelection() {

    return function * () {

      const messageId = parseInt(this.request.body.Digits);

      const response = new Twilio.TwimlResponse();

      if (messageId) {
        response.redirect(`${internals.kListenMessageRoute}${messageId}`, { method: 'GET' });
      }
      else {
        response.say(internals.kMenuInvalidResponseMessage, { language: internals.kMenuLanguage })
            .redirect(internals.kMainMenuRoute, { method: 'GET' });
      }

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }
};

