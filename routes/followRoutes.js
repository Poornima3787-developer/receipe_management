const express=require('express');
const router=express.Router();
const {authenticate}=require('../middleware/authenticate');
const followController=require('../controller/followController');

router.post('/follow/:userId', authenticate,followController.addFollow);
router.delete('/unfollow/:userId', authenticate,followController.deleteFollow);
router.get('/following', authenticate,followController.getFollow);
router.get('/activity-feed', authenticate,followController.getActivity);

module.exports=router;