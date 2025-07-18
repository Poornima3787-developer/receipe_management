const Review = require('../models/review');
const User=require('../models/user');
const Recipe=require('../models/recipe');

exports.addReview = async (req, res) => {
  try {
    const { recipeId, rating, comment } = req.body;
    const review = await Review.create({
      recipeId,
      userId: req.user.id,
      rating,
      comment
    });
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsForRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.findAll({
      where: { recipeId },
      include: [{ model: User, attributes: ['id', 'username'] }]
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};