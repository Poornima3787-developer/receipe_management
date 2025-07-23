const express = require('express');
const router = express.Router();
const { authenticate}  = require('../middleware/authenticate');
const {isAdmin}=require('../middleware/isAdmin');
const adminController = require('../controller/adminController');

router.get('/users', authenticate, isAdmin, adminController.getAllUsers);
router.put('/users/:userId/status', authenticate, isAdmin, adminController.updateUserStatus);
router.delete('/users/:userId', authenticate, isAdmin, adminController.deleteUser);

router.get('/recipes', authenticate, isAdmin, adminController.getAllRecipes);
router.delete('/recipes/:recipeId', authenticate, isAdmin, adminController.deleteRecipe);

module.exports = router;
