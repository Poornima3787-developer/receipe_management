require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.IAM_USER_ACCESSKEY,
  secretAccessKey: process.env.IAM_USER_SECRETKEY,
  region:process.env.REGION,
});

const s3 = new AWS.S3();

exports.getImage=async (req,res)=>{
  const fileName = `${Date.now()}.jpg`;
  console.log('req.query:', req.query);
  const contentType = req.query.contentType || 'image/jpeg';
  console.log('Generating presigned URL with ContentType:', contentType);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: contentType
  };

 try {
  const url = await s3.getSignedUrlPromise('putObject', params);
  res.json({ url });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Failed to get S3 signed URL' });
}

}

