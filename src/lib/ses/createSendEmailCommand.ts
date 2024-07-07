import { SendEmailCommand } from '@aws-sdk/client-ses';

export const createSendEmailCommand = (toAddress: string, fromAddress: string, subject: string, body: string) =>
  new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body,
        },
        // Text: {
        //   Charset: 'UTF-8',
        //   Data: body,
        // },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
