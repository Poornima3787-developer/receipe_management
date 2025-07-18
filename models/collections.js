const { DataTypes } = require('sequelize');
const sequelize=require('../utils/db-connection');

const Collection = sequelize.define('Collection', {
    name: { type: DataTypes.STRING, allowNull: false },
  }, {});

module.exports=Collection;
