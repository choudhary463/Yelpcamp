const express = require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {isValidCampGround,isvalidID,isLoggedIn,isValidUser}=require('../middleware');
const campController=require('../controllers/campgrounds');
const multer  = require('multer');
const {storage}=require('../cloudinary');
const upload = multer({ storage });
router.route('/')
    .get(catchAsync(campController.index))
    .post(isLoggedIn,upload.array('image'),isValidCampGround,catchAsync(campController.createCampground));

router.get('/new',isLoggedIn,campController.newcampground);

router.route('/:id')
    .get(isvalidID,catchAsync(campController.campgroundIndex))
    .put(isvalidID,isLoggedIn,isValidUser,upload.array('image'),isValidCampGround, catchAsync(campController.editCampground))
    .delete(isvalidID,isLoggedIn,isValidUser,catchAsync(campController.deleteCampground));

router.get('/:id/edit',isvalidID,isLoggedIn,isValidUser,catchAsync(campController.editCampgroundIndex));


module.exports=router;