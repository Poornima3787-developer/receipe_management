const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();
const s3Controller=require('../controller/s3Controller');

router.get('/s3url',authenticate,s3Controller.getImage);

module.exports=router;