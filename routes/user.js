const express=require('express');
const router=express.Router();
const passport = require('passport');
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,isNotLoggedIn}=require('../middleware');
const userController=require('../controllers/users');

router.route('/register')
    .get(isNotLoggedIn,userController.registerIndex)
    .post(catchAsync (userController.register));

router.route('/login')
    .get(isNotLoggedIn,userController.loginIndex)
    .post(passport.authenticate('local',{failureFlash:'invalid Email id or Password', failureRedirect:'/login'}),userController.login)

router.get('/logout',isLoggedIn,userController.logout);

router.get('/profile/:id',catchAsync( userController.profile));

module.exports=router;