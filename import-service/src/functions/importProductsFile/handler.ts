import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
const BUCKET = 'node-in-aws-s3-import';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    let result = {};
    const fileName = event.queryStringParameters.name;

    try {
        const signedURL = `https://${BUCKET}.s3.amazonaws.com/uploaded/${fileName}`;
        result[0] = (signedURL);
    } catch (error) {
        return formatError500Response({
            ...error
        });
    }

    return formatJSONResponse({
        ...result
    });
};

export const main = middyfy(importProductsFile);