// import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
// import { formatJSONResponse, unauthorizedJSONResponse, forbiddenJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

// import schema from './schema';

const basicAuthorizer = async (event) => {
    console.log('Event:', JSON.stringify(event));
    if (event['type'] != 'TOKEN') {
        return null;
    }

    try {
        const authorizationToken: any = event.authorizationToken;
        
        const encodedCreds = authorizationToken.split(' ')[1];
        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');
        const userName: string = plainCreds[0];
        const password: string = plainCreds[1];

        console.log(`UserName: ${userName} and Passwoed: ${password}`);

        const storedUserPassword = process.env[userName];
        const effect = !storedUserPassword || storedUserPassword != password ? 'Deny' : 'Allow';

        if (effect == 'Deny') {
            return generatePolicy('Deny', event.methodArn);
        }

        return generatePolicy(effect, event.methodArn, userName);

    } catch(e) {
        console.log('Internal server error appeared', e);
        return generatePolicy('Deny', event.methodArn);
    }

};

const generatePolicy = (action: 'Allow' | 'Deny', arn: string, userName?: string) => {
    return {
        principalId: userName ?? 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: action,
                    Resource: arn
                }
            ]
        }
    }
}

export const main = middyfy(basicAuthorizer);
