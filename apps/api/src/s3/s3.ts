import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.REGION || 'us-east-1',
});

export const s3 = new AWS.S3({
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_SECRET_ACCESS_ID!,
    secretAccessKey: process.env.STORJ_SECRET_ACCESS_KEY!,
  },
}); // do not use s3ForcePathStyle or signatureVersion


