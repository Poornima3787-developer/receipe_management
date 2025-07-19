const express=require('express');
const router=express.Router();
const recipeController=require('../controller/recipeController');
const {authenticate}=require('../middleware/authenticate');
const upload=require('../middleware/upload');

router.post('/',authenticate,upload.single('image'),recipeController.createRecipe);
router.get('/my', authenticate, recipeController.getMyRecipes);
router.put('/:id',authenticate,recipeController.updateRecipe);
router.delete('/:id',authenticate,recipeController.deleteRecipe);
router.get('/:id',recipeController.getRecipeById);
router.get('/', recipeController.getAllRecipes);
router.get('/search',authenticate,recipeController.getSearch);
router.get('/filter',authenticate,recipeController.getPrefernceSearch);

module.exports=router;