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
