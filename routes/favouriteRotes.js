const express=require('express');
const router=express.Router();
const {authenticate}=require('../middleware/authenticate')
const favouriteController=require('../controller/favoriteController');

router.post('/', authenticate, controller.addFavorite);
router.get('/', authenticate, controller.getFavorites);
router.delete('/:id', authenticate, controller.removeFavorite);

module.exports = router;