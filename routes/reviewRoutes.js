const express = require('express');
const router = express.Router();

const {authenticate}=require('../middleware/authenticate');
const reviewController=require('../controller/reviewController');

router.post('/',reviewController);
router.get('/:recipeId',reviewController);