import { APIGatewayProxyResult } from 'aws-lambda';

export type ErrorWithStatus = Error & {
  statusCode: number,
};

export function createSuccessMessage(body: object): APIGatewayProxyResult {
  const response = {
    statusCode: 200,
    body: '',
  };

  if (body) {
    response.body = JSON.stringify(body);
  }

  return response;
}

export function createErrorMessage(error: ErrorWithStatus): APIGatewayProxyResult {
  return {
    statusCode: error.statusCode || 500,
    body: JSON.stringify(error),
  };
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
