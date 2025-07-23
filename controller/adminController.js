const User = require('../models/user');
const Recipe = require('../models/recipe');

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'name', 'email', 'status', 'role'] });
  res.json({ users });
};

exports.updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body; // 'approved', 'banned', etc.
  await User.update({ status }, { where: { id: userId } });
  res.json({ message: `User status updated to ${status}` });
};

exports.deleteUser = async (req, res) => {
  await User.destroy({ where: { id: req.params.userId } });
  res.json({ message: 'User deleted' });
};

exports.getAllRecipes = async (req, res) => {
  const recipes = await Recipe.findAll({ include: ['User'] });
  res.json({ recipes });
};

exports.deleteRecipe = async (req, res) => {
  await Recipe.destroy({ where: { id: req.params.recipeId } });
  res.json({ message: 'Recipe deleted' });
};
