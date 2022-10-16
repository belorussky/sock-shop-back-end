import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { S3, SQS } from 'aws-sdk';
const csv = require('csv-parser');


import schema from './schema';

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const BUCKET = process.env.IMPORT_BUCKET_NAME;
    const s3 = new S3({ region: 'eu-west-1' });
    const sqs = new SQS();
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

        await new Promise<object[]>((resolve, reject) => { 
            s3Stream.pipe(csv())
            .on('error', error => reject(error))
            .on('data', row => {
                sqs.sendMessage({
                    QueueUrl: process.env.SQS_URL,
                    MessageBody: JSON.stringify(row)
                }, (err, data) => {
                    console.log(err, 1);
                    console.log(data, 2)
                    console.log('Send message for: ' + row);
                });
            })
            .on('end', async () => { 
                await s3.copyObject({
                    Bucket: BUCKET,
                    CopySource: BUCKET + '/' + files[0].Key,
                    Key: files[0].Key.replace('uploaded', 'parsed')
                }).promise();
        
                await s3.deleteObject({
                    Bucket: BUCKET,
                    Key: files[0].Key
                }).promise();
            }); 
        });
        
    } catch (error) {
        return formatError500Response({
            ...error
        });
    }
};

export const main = middyfy(importFileParser);