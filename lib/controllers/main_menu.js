'use strict';

const Twilio = require('twilio');

const internals = {};

internals.kMenuTimeout = 10; // timeout in seconds
internals.kMenuDigits = 1; // number of digits in the menu
internals.kContentType = 'application/xml'; // The content type used to respond
internals.kMenuLanguage = 'es-mx'; // the language to use
internals.kTimeoutMessage = 'Oh... está bien. Adios!';
internals.kMainMenuRoute = '/menus/main';
internals.kRecordingMenuRoute = '/menus/recording';
internals.kRandomMessageRoute = '/recordings/0';
internals.kLeaveMessageRoute = '/recordings';
internals.kMenuMessage = 'Marca 1 para grabar mensaje. ' +
                         'Marca 2 para escuchar mensaje al azar. ' +
                         'Marca 3 si conoces el número de mensaje'; // the message that will be shown
internals.kMenuInvalidResponseMessage = 'No entendí... Volviendo al menu principal.'; // invalid selection message
internals.kMenuOptions = {
  leaveMessage: 1,
  listenToRandomMessage: 2,
  listenToSpecificMessage: 3
}; // the menu options

/**
 * Handles the HTTP requests for the main menu
 *
 * @class MainMenuController
 */
module.exports = internals.MainMenuController = class MainMenuController {

  /**
   * Serves the menu
   *
   * @function serveMenu
   * @memberof MainMenuController
   * @instance
   * @return {generator} a koa compatible handler generator function
   */
  serveMenu() {

    return function * () {

      const response = new Twilio.TwimlResponse();

      // the action will default to post in the same URL, so no change
      // required there.
      response.gather({
        timeout: internals.kMenuTimeout,
        numDigits: internals.kMenuDigits
      }, function nestedHandler() {

        this.say(internals.kMenuMessage, { language: internals.kMenuLanguage });
      }).say(internals.kTimeoutMessage, { language: internals.kMenuLanguage });

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }

  /**
   * Parses the selected main menu response
   *
   * @function parseMenuSelection
   * @memberof MainMenuController
   * @instance
   * @return {generator} a koa compatible handler generator function
   */
  parseMenuSelection() {

    return function * () {

      const menuSelection = parseInt(this.request.body.Digits);

      const response = new Twilio.TwimlResponse();

      if (menuSelection === internals.kMenuOptions.leaveMessage) {
        response.redirect(internals.kLeaveMessageRoute, { method: 'GET' });
      }
      else if (menuSelection === internals.kMenuOptions.listenToRandomMessage) {
        response.redirect(internals.kRandomMessageRoute, { method: 'GET' });
      }
      else if (menuSelection === internals.kMenuOptions.listenToSpecificMessage) {
        response.redirect(internals.kRecordingMenuRoute, { method: 'GET' });
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
