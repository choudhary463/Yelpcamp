const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {isValidCampGround,isvalidID,isLoggedIn,isValidUser}=require('../middleware');
const reviewsController=require('../controllers/reviews');

router.route('/reviews')
    .get(isvalidID,catchAsync(reviewsController.index))
    .post(isvalidID,isLoggedIn,catchAsync(reviewsController.createReview))
    .put(isvalidID,isLoggedIn,catchAsync(reviewsController.editReview))
    .delete(isvalidID,isLoggedIn,catchAsync(reviewsController.deleteReview));

router.get('/reviews/edit',isvalidID,isLoggedIn,catchAsync(reviewsController.editReviewIndex));

module.exports=router;