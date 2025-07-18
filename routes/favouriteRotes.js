const express=require('express');
const router=express.Router();
const {authenticate}=require('../middleware/authenticate')
const favouriteController=require('../controller/favoriteController');

router.post('/', authenticate, favouriteController.addFavorite);
router.get('/', authenticate, favouriteController.getFavorites);
router.delete('/:id', authenticate, favouriteController.removeFavorite);

module.exports = router;