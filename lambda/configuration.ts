import configuration from './models/configuration';
import { createSuccessMessage, createErrorMessage } from './utils/aws';

export function list(event, context, callback) {
  configuration.scan().exec()
    .then(configItems => callback(null, createSuccessMessage(configItems)))
    .catch(error => callback(null, createErrorMessage(error)));
}
