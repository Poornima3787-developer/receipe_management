const express=require('express');
const router=express.Router();
const {authenticate}=require('../middleware/authenticate');
const collectionController=require('../controller/collectionController');

router.post('/', authenticate, collectionController.createCollection);
router.get('/', authenticate, collectionController.getCollections);
router.post('/:collectionId/favorites', authenticate, collectionController.addToCollection);
router.delete('/:collectionId/favorites/:favoriteId', authenticate, collectionController.removeFromCollection);
router.get('/:id/favorites', authenticate, collectionController.getCollectionFavorites);

module.exports=router;