'use strict';

const Twilio = require('twilio');

const internals = {};

internals.kMenuTimeout = 10; // timeout in seconds
internals.kMenuDigits = 1; // number of digits in the menu
internals.kContentType = 'application/xml'; // The content type used to respond
internals.kMenuLanguage = 'es-mx'; // the language to use
internals.kTimeoutMessage = 'Oh... está bien. Adios!';
internals.kMenuMessage = 'Para dejar un mensaje, presiona 1. ' +
                         'Para escuchar un mensaje al azar, presiona 2.' +
                         'Para escuchar un mensaje específico presioan 3.'; // the message that will be shown
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
 * @param {DeadDrop.tConfiguration} config The configuration to
 * initialize.
 */
module.exports = internals.MainMenuController = class MainMenuController {
  constructor(config) {

  }

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

    return function * (uuid) {

      const menuSelection = parseInt(this.request.body.Digits);

      const response = new Twilio.TwimlResponse();

      if (menuSelection === internals.kMenuOptions.leaveMessage) {
        response.say('DEBUG: We will redirect to leave message. Not yet implemented.');
      }
      else if (menuSelection === internals.kMenuOptions.listenToRandomMessage) {
        response.say('DEBUG: We will give you a random message. Not yet implemented.');
      }
      else if (menuSelection === internals.kMenuOptions.listenToSpecificMessage) {
        response.say('DEBUG: We will show you to the recording selection menu. Not yet implemented.');
      }
      else {
        response.say(internals.kMenuInvalidResponseMessage, { language: internals.kMenuLanguage })
            .redirect('.', { method: 'GET' });
      }

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }
};
