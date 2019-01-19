import configuration, { fields, hashKey, rangeKey } from './models/configuration';
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

api.create = (event) => {
  const body = parseBody(event);

  if (Array.isArray(body)) {

  }
};

api.bulkSet = (event) => {
  const body = parseBody(event);

  return Promise.all(
    Object.keys(body)
      .map(hash => Object.keys(body[hash])
        .map(range => configuration.update({ [hashKey]: hash, [rangeKey]: range }, { [fields.value]: body[hash] }))));
};
export const bulkSet = async event => api.bulkSetHandler(event);

api.get = (event) => {
  const { hash, range } = event.pathParameters;

  return configuration.getValue(hash, range);
};
export const get = async event => api.getHandler(event);

api.set = (event) => {
  const { hash, range } = event.pathParameters;
  const body = parseBody(event);

  return configuration.update({ [hashKey]: hash, [rangeKey]: range }, { [fields.value]: body });
};
export const set = async event => api.setHandler(event);
