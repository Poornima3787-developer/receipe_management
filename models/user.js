const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db-connection');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,        
    primaryKey: true
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: DataTypes.STRING,
  profileImageUrl: DataTypes.STRING
});

module.exports=User;

