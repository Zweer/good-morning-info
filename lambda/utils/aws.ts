import { APIGatewayProxyResult } from 'aws-lambda';

export type ErrorWithStatus = Error & {
  statusCode: number,
};

function createMessage(statusCode: number, bodyObj: object): APIGatewayProxyResult {
  const body = JSON.stringify(bodyObj);

  return {
    statusCode,
    body,
  };
}

export function createSuccessMessage(data: object): APIGatewayProxyResult {
  return createMessage(200, { data });
}

export function createErrorMessage(error: ErrorWithStatus): APIGatewayProxyResult {
  return createMessage(error.statusCode || 500, { error });
}

export function parseBody(event): object {
  const body = event.body as string;
  const contentType = event.headers['Content-Type'] as string;

  let bodyObj = {};

  switch (contentType) {
    case 'application/json':
      bodyObj = JSON.parse(body);
      break;

    case 'application/x-www-form-urlencoded':
      body
        .split('&')
        .map(keyValue => keyValue.split('='))
        .forEach(([key, value]) => {
          bodyObj[key] = value;
        });
      break;

    case 'text/plain':
      bodyObj = body;
      break;

    default:
      throw new Error(`Invalid Content-Type: ${contentType}`);
  }

  return bodyObj;
}

export function getApiProxy() {
  return new Proxy({}, {
    get(target, property) {
      const wrapperText = 'Handler';

      if (typeof property === 'string' && property.match(wrapperText)) {
        const functionNameToWrap = property.replace(wrapperText, '');

        if (target[functionNameToWrap] !== undefined) {
          return async function (event) {
            return target[functionNameToWrap](event)
              .then(result => createSuccessMessage(result))
              .catch(error => createErrorMessage(error));
          };
        }
      }

      return target[property];
    },
  });
}

export function generatePolicy(principalId, effect, resource) {
  const authResponse = {
    principalId,
    policyDocument: null,
  };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }],
    };

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}
