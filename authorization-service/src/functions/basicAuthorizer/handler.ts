import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, unauthorizedJSONResponse, forbiddenJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const basicAuthorizer: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log('Event:', JSON.stringify(event));
    if (event['type'] != 'TOKEN') {
        return unauthorizedJSONResponse({
            message: '401 Unauthorized Error',
            event,
        });
        // return forbiddenJSONResponse({
        //     message: 'You don't have permission to access this resource',
        //     ...error,
        // });
    }

    try {
        const authorizationToken = event.authorizationToken;
        
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const username = plainCreds[0];
        const password = plainCreds[1];

        console.log(`UserName: ${username} and Passwoed: ${password}`);

        const storedUserPassword = process.env[username];
        const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow';

        if (effect == 'Deny') {
            return forbiddenJSONResponse({
                message: `Access is Denied for ${username}!`,
            });
        }

        const policy = generatePolicy(encodedCreds, event.methodArn, effect);

        return formatJSONResponse({
            policy,
        });


    } catch(e) {
        return unauthorizedJSONResponse({
            message: `Unauthorized: ${e.message}`,
        });
    }

};

const generatePolicy = (principalId, resource, effect = 'Allow') => {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    }
}

export const main = middyfy(basicAuthorizer);
