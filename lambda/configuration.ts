import configuration, { fields } from './models/configuration';
import { createSuccessMessage, createErrorMessage } from './utils/aws';

export function list(event, context, callback) {
  configuration.scan().exec()
    .then(configItems => callback(null, createSuccessMessage(configItems)))
    .catch(error => callback(null, createErrorMessage(error)));
}

export function get(event, context, callback) {
  const { configKey } = event.pathParameters;

  configuration.getValue(configKey)
    .then(configValue => callback(null, createSuccessMessage(configValue)))
    .catch(error => callback(null, createErrorMessage(error)));
}

export function bulkSet(event, context, callback) {
  const { body } = event;

  let bodyObj = {};

  try {
    bodyObj = JSON.parse(body);
  } catch (error) {
    body
      .split('&')
      .map(keyValue => keyValue.split('='))
      .forEach(([key, value]) => {
        bodyObj[key] = value;
      });
  }

  Promise
    .all(Object.keys(bodyObj)
      .map(key => configuration.update(key, { [fields.value]: bodyObj[key] })))
    .then(changed => callback(null, createSuccessMessage(changed)))
    .catch(error => callback(null, createErrorMessage(error)));
}
