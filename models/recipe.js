const { DataTypes, Sequelize } = require('sequelize');
const sequelize=require('../utils/db-connection');

const Recipe=sequelize.define('Recipe',{
  title: DataTypes.STRING,
    ingredients: DataTypes.TEXT,
    instructions: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    cookingTime: DataTypes.STRING,
    servings: DataTypes.INTEGER,
    level:DataTypes.STRING,
    diet:DataTypes.STRING,
});

module.exports=Recipe;