require('dotenv').config();
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Recipe=require('../models/recipe');

function generateToken(id, name) {
  return jwt.sign({ userId: id, name }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

exports.register=async (req,res)=>{
  try {
    const {name,email,password}=req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exstingUser=await User.findOne({where: { email }});
   
    if(exstingUser){
      return res.status(400).json({message:'user already registered .Try to login'})
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const user=await User.create({name,email,password:hashedPassword});

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.login=async (req,res)=>{
  try {
    const {email,password}=req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.name);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.updateProfile=async (req,res)=>{
  try {
    const {name,email}=req.body;
    if (name) req.user.name = name;
    if (email) req.user.email = email;
    await req.user.save();
    res.json({ message: 'Profile updated successfully', user: req.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getProfile=async (req,res)=>{
  try {
    const user=await User.findByPk(req.user.id,{
      attributes:['id','name','email'],
      include:[{
         model:Recipe,
         as: 'contributedRecipes',
         attributes: ['id', 'title', 'cookingTime', 'servings']
      }]
    });
    res.json({user});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}