const { DataTypes } = require('sequelize');
const sequelize=require('../utils/db-connection');

const Follow = sequelize.define('Follow', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

module.exports=Follow;