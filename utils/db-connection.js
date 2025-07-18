require('dotenv').config();
const {Sequelize}=require('sequelize');

const sequelize=new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.PASSWORD,{
  host:process.env.DB_HOST,
  dialect:'mysql',
  loggings:false,
});

module.exports = sequelize;
