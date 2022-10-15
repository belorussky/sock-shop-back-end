import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3 } from 'aws-sdk';
const BUCKET = 'node-in-aws-s3-import';
const csv = require('csv-parser');

import schema from './schema';

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log(event);
    const s3 = new S3({ region: 'eu-west-1' });
    const results = [];
    const paramsListObj = {
        Bucket: BUCKET,
        Prefix: 'uploaded/',
        Delimiter: '/',
        StartAfter: 'uploaded/'
    };
    

    try {
        const s3Response = await s3.listObjectsV2(paramsListObj).promise();
        const files = s3Response.Contents;

        const paramsReadStr = {
            Bucket: BUCKET,
            Key: files[0].Key
        }
    
        const s3Stream = s3.getObject(paramsReadStr).createReadStream();
        
        s3Stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
        });
        
        
        await s3.copyObject({
            Bucket: BUCKET,
            CopySource: BUCKET + '/' + files[0].Key,
            Key: files[0].Key.replace('uploaded', 'parsed')
        }).promise();

        await s3.deleteObject({
            Bucket: BUCKET,
            Key: files[0].Key
        }).promise();
    } catch (error) {
        return formatError500Response({
            ...error
        });
    }
};

export const main = middyfy(importFileParser);