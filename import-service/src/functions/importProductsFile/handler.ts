import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatError500Response, formatJSONResponseSignedUrl } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const s3 = new S3({ region: 'eu-west-1' });
    const fileName = event.queryStringParameters.name;
    const BUCKET = 'node-in-aws-s3-import';
    const catalogPath = `uploaded/${fileName}`;
    const params = {
        Bucket: BUCKET,
        Key: catalogPath,
        Expires: 60,
        ContentType: 'text/csv'
    }

    try {

        const url = await s3.getSignedUrl('putObject', params);
        
        return formatJSONResponseSignedUrl({
            url
        });

    } catch (error) {
        return formatError500Response({
            ...error
        });
    }
};

export const main = middyfy(importProductsFile);