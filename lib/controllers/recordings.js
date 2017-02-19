'use strict';

const Joi = require('joi');
const Moment = require('moment');
const Pify = require('pify');
const Redis = require('redis');
const Twilio = require('twilio');

const internals = {};

internals.kContentType = 'application/xml'; // The content type used to respond
internals.kLanguage = 'es-mx'; // the language to use
internals.kMaxMessageLength = 30; // max message length in seconds
internals.kIdDateFormat = 'YYMMDDHHmmssSSS'; // derive ids from current date. 15 digits.
internals.kRecordingsSet = 'recordings';
internals.kRecordMessage = 'Graba tu mensaje despues del bip. ' +
                           'Presiona cualquier tecla para finalizar tu mensaje. '; // the recording message
internals.kConfirmationMessage = 'Gracias. Tu mensaje es el número: ';
internals.kNotFoundMessage = 'Mensaje no encontrado. Adiós!';

internals.kRecordingSchema = Joi.object().keys({
  url: Joi.string().required()
});

/**
 * Handles the HTTP requests for the recording menu
 *
 * @class RecordingsController
 * @param {DeadDrop.tConfiguration} config The configuration to
 * initialize.
 */
module.exports = internals.RecordingsController = class RecordingsController {
  constructor(config) {

    this._redis = Redis.createClient(config.redis);

    // Log an error if it happens.
    this._redis.on('error', (err) => {

      console.error(err);
    });
  }

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

    const self = this;

    return function * () {

      const zadd = Pify(self._redis.zadd.bind(self._redis));

      const response = new Twilio.TwimlResponse();

      const id = Moment().format(internals.kIdDateFormat);
      const url = this.request.body.RecordingUrl;
      const separatedId = id.split('').join('. ');
      const recording = {
        url
      };

      yield self._validate(recording).catch((err) => {

        this.throw(err.message, 422);
      });

      // Add to ordered set for quick fetches, and set for random fetches
      yield zadd(internals.kRecordingsSet, parseInt(id), url);

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

    const self = this;

    return function * (id) {

      id = parseInt(id);

      const zcard = Pify(self._redis.zcard.bind(self._redis));
      const zrange = Pify(self._redis.zrange.bind(self._redis));
      const zscore = Pify(self._redis.zscore.bind(self._redis));
      const zrangebyscore = Pify(self._redis.zrangebyscore.bind(self._redis));

      const response = new Twilio.TwimlResponse();
      let location = null;

      if (!id) {
        const maxNumber = yield zcard(internals.kRecordingsSet);
        const index = Math.floor(Math.random() * maxNumber); // get random between 0 and cardinality
        location = yield zrange(internals.kRecordingsSet, index, index);
      }
      else {
        location = yield zrangebyscore(internals.kRecordingsSet, id, id);
      }

      if (location && location.length > 0) {
        if (!id) {
          id = yield zscore(internals.kRecordingsSet, location[0]);
        }

        const separatedId = id.toString().split('').join('. ');
        response.play(location[0]).say(separatedId);
      }
      else {
        response.say(internals.kNotFoundMessage, { language: internals.kLanguage });
      }

      this.type = internals.kContentType;
      this.body = response.toString();
    };
  }

  // Validates the post schema

  _validate(post) {

    const validate = Pify(Joi.validate.bind(Joi));
    return validate(post, internals.kRecordingSchema);
  }
};
