require('dotenv').config();
const express=require('express');
const app=express();
const path = require('path');

const sequelize=require('./utils/db-connection');
const userRouter=require('./routes/userRoutes');
const recipeRouter=require('./routes/recipeRoutes');
const favoriteRouter=require('./routes/favouriteRotes');
const collectionRouter=require('./routes/collectionRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const followRouter=require('./routes/followRoutes');

const User=require('./models/user');
const Recipe=require('./models/recipe');
const Favorite=require('./models/favorite');
const Collection=require('./models/collections');
const Review=require('./models/review');
const Follow=require('./models/follow');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.use('/users',userRouter);
app.use('/recipe',recipeRouter);
app.use('/favorite',favoriteRouter);
app.use('/collection',collectionRouter);
app.use('/reviews',reviewRouter);
//app.use('/follow',followRouter);

//Associations
User.hasMany(Recipe,{
  foreignKey: 'userId',
  as: 'contributedRecipes'
});
Recipe.belongsTo(User,{
  foreignKey: 'userId',
});

User.hasMany(Favorite);
Favorite.belongsTo(User);

Recipe.hasMany(Favorite);
Favorite.belongsTo(Recipe);

User.hasMany(Collection);
Collection.belongsTo(User);

Recipe.hasMany(Collection);
Collection.belongsTo(Recipe);

User.hasMany(Review);
Review.belongsTo(User);

Recipe.hasMany(Review);
Collection.belongsTo(Recipe);

User.hasMany(Follow,{
  foreignKey: 'followerId',
  as: 'Follower'
});
User.belongsTo(Follow,{
  foreignKey: 'followingId',
  as: 'Following'
});

sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Server running'));
});