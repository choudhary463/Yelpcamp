const express = require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {isValidCampGround,isvalidID,isLoggedIn,isValidUser}=require('../middleware');
const campController=require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campController.index))
    .post(isValidCampGround,isLoggedIn,catchAsync(campController.createCampground));

router.get('/new',isLoggedIn,campController.newcampground);

router.route('/:id')
    .get(isvalidID,catchAsync(campController.campgroundIndex))
    .put(isvalidID,isValidCampGround,isLoggedIn,isValidUser, catchAsync(campController.editCampground))
    .delete(isvalidID,isLoggedIn,isValidUser,catchAsync(campController.deleteCampground));

router.get('/:id/edit',isvalidID,isLoggedIn,isValidUser,catchAsync(campController.editCampgroundIndex));


module.exports=router;