const { DataTypes } = require('sequelize');
const sequelize=require('../utils/db-connection');

const Favorite = sequelize.define('Favorite', {}, {});

module.exports=Favorite;