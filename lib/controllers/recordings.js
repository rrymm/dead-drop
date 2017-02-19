'use strict';

const Twilio = require('twilio');

const internals = {};

internals.kContentType = 'application/xml'; // The content type used to respond
internals.kLanguage = 'es-mx'; // the language to use
internals.kMaxMessageLength = 30; // max message length in seconds
internals.kRecordMessage = 'Graba tu mensaje despues del bip. ' +
                           'Presiona cualquier tecla para finalizar tu mensaje. '; // the recording message
internals.kConfirmationMessage = 'Gracias. Tu mensaje es el número: ';

/**
 * Handles the HTTP requests for the recording menu
 *
 * @class RecordingsController
 */
module.exports = internals.RecordingsController = class RecordingsController {

  /**
   * Start recording process
   *
   * @function startRecording
   * @memberof RecordingsController
   * @instance
   * @return {generator} a koa compatible handler generator function
   */
  startRecording() {

    return function * () {

      const response = new Twilio.TwimlResponse();

      // the action will default to post in the same URL, so no change
      // required there.
      response.say(internals.kRecordMessage, { language: internals.kLanguage })
      .record({
        maxLength: internals.kMaxMessageLength
      });

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }

  /**
   * Saves the recording for later use
   *
   * @function saveRecording
   * @memberof RecordingsController
   * @instance
   * @return {generator} a koa compatible handler generator function
   */
  saveRecording() {

    return function * () {

      // For learning purpouses
      console.log(JSON.stringify(this.request.body, null, 2));

      const response = new Twilio.TwimlResponse();

      const exampleId = 4591;
      const separatedId = exampleId.toString().split('').join(',');

      response.say(`${internals.kConfirmationMessage}${separatedId}`, { language: internals.kLanguage });

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }

  /**
   * Gets a recording.
   *
   * @function getRecording
   * @memberof RecordingsController
   * @instance
   * @return {generator} a koa compatible handler generator function
   */
  getRecording() {

    return function * (id) {

      id = parseInt(id);

      const response = new Twilio.TwimlResponse();

      if (id) {
        response.say(`Obteniendo el mensaje ${id}. NO IMPLEMENTADO!`, { language: internals.kLanguage });
      }
      else {
        response.say('Obteinendo mensaje aleatorio. NO IMPLEMENTADO!', { language: internals.kLanguage });
      }

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }
};
