require('dotenv').config();
const express=require('express');
const app=express();
const path = require('path');
const cors = require('cors');

const sequelize=require('./utils/db-connection');

//Route imports
const userRouter=require('./routes/userRoutes');
const recipeRouter=require('./routes/recipeRoutes');
const favoriteRouter=require('./routes/favouriteRotes');
const collectionRouter=require('./routes/collectionRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const followRouter=require('./routes/followRoutes');
const s3Router=require('./routes/s3Routes');

//model imports
const User=require('./models/user');
const Recipe=require('./models/recipe');
const Favorite=require('./models/favorite');
const Collection=require('./models/collections');
const Review=require('./models/review');
const Follow=require('./models/follow');


//middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


//serve html views
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'dashboard.html'));
});

app.get('/create-recipe', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'create-recipe.html'));
});

app.get('/my-recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'my-recipes.html'));
});

app.get('/profile',(req,res)=>{
  res.sendFile(path.join(__dirname,'view','profile.html'))
})

app.get('/favorite',(req,res)=>{
  res.sendFile(path.join(__dirname,'view','favorite.html'))
})

app.get('/follows',(req,res)=>{
  res.sendFile(path.join(__dirname,'view','follow.html'))
})

app.get('/feed',(req,res)=>{
  res.sendFile(path.join(__dirname,'view','feed.html'))
})

//API routes
app.use('/users',userRouter);
app.use('/recipe',recipeRouter);
app.use('/favorites',favoriteRouter);
app.use('/collections',collectionRouter);
app.use('/reviews',reviewRouter);
app.use('/follow',followRouter);
app.use('/',s3Router);


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

Collection.hasMany(Favorite);
Favorite.belongsTo(Collection);

User.hasMany(Review);
Review.belongsTo(User);

Recipe.hasMany(Review);
Review.belongsTo(Recipe);

User.belongsToMany(User, {
  through: Follow,
  as: 'Followers',    
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

User.belongsToMany(User, {
  through: Follow,
  as: 'Following',    
  foreignKey: 'followerId',
  otherKey: 'followingId'
});

Follow.belongsTo(User, { foreignKey: 'followerId', as: 'Follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'Following' });


// DB Sync and server startup
sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3000, () => console.log('Server running'));
});