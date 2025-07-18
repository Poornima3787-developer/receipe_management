const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_ACCESSKEY,
  secretAccessKey: process.env.IAM_USER_SECRETKEY,
});

module.exports = function uploadToS3(file) {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${uuid.v4()}_${file.name}`,
    Body: file.data,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  return s3.upload(params).promise();
};