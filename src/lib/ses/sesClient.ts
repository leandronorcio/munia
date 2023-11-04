import 'server-only';
/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples.html.

Purpose:
sesClient.js is a helper function that creates an Amazon Simple Email Services (Amazon SES) service client.

*/
// snippet-start:[ses.JavaScript.createclientv3]
import { SESClient } from '@aws-sdk/client-ses';

// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY as string,
  },
});
export { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
