const Favorite=require('../models/favorite');
const Recipe=require('../models/recipe');

exports.addFavorite=async (req,res)=>{
     try {
    const { recipeId } = req.body;
    const fav = await Favorite.create({ UserId: req.user.id, RecipeId: recipeId });
    res.status(201).json(fav);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { UserId: req.user.id },
      include: { model: Recipe }
    });
    res.json(favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const fav = await Favorite.findOne({ where: { id, UserId: req.user.id } });
    if (!fav) return res.status(404).json({ message: 'Favorite not found' });
    await fav.destroy();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

