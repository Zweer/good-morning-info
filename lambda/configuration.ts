import configuration, { fields } from './models/configuration';
import { parseBody, getApiProxy } from './utils/aws';

type apiConfiguration = {
  list: Function,
  listHandler: Function,

  bulkSet: Function,
  bulkSetHandler: Function,

  get: Function,
  getHandler: Function,

  set: Function,
  setHandler: Function,
};

const api = getApiProxy() as apiConfiguration;

api.list = () => configuration.scan().exec();
export const list = async event => api.listHandler(event);

api.bulkSet = (event) => {
  const body = parseBody(event);

  return Promise
    .all(Object.keys(body)
      .map(key => configuration.update(key, { [fields.value]: body[key] })));
};
export const bulkSet = async event => api.bulkSetHandler(event);

api.get = (event) => {
  const { configKey } = event.pathParameters;

  return configuration.getValue(configKey);
};
export const get = async event => api.getHandler(event);

api.set = (event) => {
  const { pathParameters: { configKey } } = event;
  const body = parseBody(event);

  return configuration.update(configKey, { [fields.value]: body });
};
export const set = async event => api.setHandler(event);
