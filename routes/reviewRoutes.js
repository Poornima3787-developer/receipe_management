const express = require('express');
const router = express.Router();

const {authenticate}=require('../middleware/authenticate');
const reviewController=require('../controller/reviewController');

router.post('/', authenticate, reviewController.addReview);
router.get('/:recipeId',reviewController.getReviewsForRecipe);

module.exports=router;