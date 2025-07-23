const express=require('express');
const router=express.Router();
const userController=require('../controller/userController');
const {authenticate}=require('../middleware/authenticate');

router.post('/register',userController.register);
router.post('/login',userController.login);
router.put('/profile',authenticate,userController.updateProfile);
router.get('/profile',authenticate,userController.getProfile);
router.get('/all',authenticate,userController.getAllUsers);

module.exports=router;