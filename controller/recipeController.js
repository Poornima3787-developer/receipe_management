const { Op } = require('sequelize');
const Recipe=require('../models/recipe');


exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSearch=async (req,res)=>{
  try {
    const {query}=req.query;
    const recipes=await Recipe.findAll({
      where:{
        [Op.or]:[
      
           { title: { [Op.like]: `%${query}%` } },
           { ingredients: { [Op.like]: `%${query}%` } } 
          
        ]
      }
    });
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getPrefernceSearch=async (req,res)=>{
  try {
    const { diet, difficulty, maxTime } = req.query;
  const where = {};
  if (diet) where.diet = diet;
  if (difficulty) where.difficulty = difficulty;
  if (maxTime) where.cookingTime = { [Op.lte]: parseInt(maxTime) };

  const recipes = await Recipe.findAll({ where });
  res.json({ recipes });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.createRecipe=async (req,res)=>{
  try {
    const {title,ingredients,instructions,cookingTime,servings,level,diet,image}=req.body;
   let imageUrl = '';
if (image) {
  imageUrl = image; 
}

    const recipe=await Recipe.create({
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      imageUrl,
      level,
      diet,
      userId: req.user.id
    })
     res.status(201).json({ message: 'Recipe created', recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getMyRecipes = async (req, res) => {
  try {
    console.log("Request from user ID:", req.user.id);
    const recipes = await Recipe.findAll({ where: { userId: req.user.id } });
    res.json({ recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateRecipe=async (req,res)=>{
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized or recipe not found' });
    }

    Object.assign(recipe, req.body);
    await recipe.save();
    res.json({ message: 'Recipe updated', recipe });
  } catch (error) {
   res.status(500).json({ message: error.message });
  }
}

exports.deleteRecipe=async (req,res)=>{
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized or recipe not found' });
    }
    await recipe.destroy();
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ recipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
