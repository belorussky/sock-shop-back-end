import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatError500Response } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { SNS } from 'aws-sdk';

import schema from './schema';
import createProductsServerice from '../../service';

const catalogBatchProcess: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const promises = event.Records.map(async ({ body }) => {
        return await createProductsServerice.createProduct(JSON.parse(body));
    });

    const sns = new SNS({ region: 'eu-west-1'});
    
    try {
        await Promise.all(promises)
            .then(async (results) => {
                await sns.publish({
                        Subject: 'Products created successfully',
                        Message: 'New Products created successfully: ' + JSON.stringify(results),
                        TopicArn: process.env.SNS_ARN
                    }, () => {
                        console.log('Email sent successfully!');
                    }).promise();
        });

        return formatJSONResponse({
            message: "New Products created successfully! The email has been successfully sent to the administrator!",
        });
    } catch (error) {
        return formatError500Response({
            ...error
        });
    }
};

export const main = middyfy(catalogBatchProcess);