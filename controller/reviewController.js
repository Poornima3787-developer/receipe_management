const Review = require('../models/review');
const User=require('../models/user');
const Recipe=require('../models/recipe');

exports.addReview = async (req, res) => {
  try {
    const { recipeId, rating, comment } = req.body;
    const review = await Review.create({
    RecipeId: recipeId,
    UserId: req.user.id,
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
  where: { RecipeId: recipeId },
  include: [{ model: User, attributes: ['id', 'name'] }]
});
console.log("Fetched reviews:", reviews);
const average = (
  reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
).toFixed(1);

res.json({ reviews, averageRating: parseFloat(average) });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: error.message });
  }
};