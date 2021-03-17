const express=require('express');
const router = express.Router({ mergeParams: true });
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');
const Review=require('../models/review');
const {isValidCampGround,isvalidID,isLoggedIn,isValidUser}=require('../middleware');

router.get('/reviews',isvalidID,catchAsync(async (req,res,next)=>{
    res.render('reviews/index');
}));

router.get('/reviews/edit',isvalidID,isLoggedIn,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const review=await Review.findOne({campground:id,author:req.user.id});
    if(review){
        res.render('reviews/edit',{camp,title:'edit review',review});
    }
    else{
        req.flash('error','add review first');
        res.redirect(`/campgrounds/${id}`);
    }
}));

router.post('/reviews',isvalidID,isLoggedIn,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const revieww=await Review.findOne({campground:id,author:req.user.id});
    if(revieww){
        req.flash('error','you already added a review');
        res.redirect(`/campgrounds/${id}`);
    }
    if(camp.author.equals(req.user.id)){
        req.flash('error','author cannot add reviews');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        const review=new Review(req.body);
        review.campground=id;
        review.author=req.user.id;
        const rating=req.body.rating;
        if(camp.totalRating) camp.totalRating=camp.totalRating+parseInt(rating);
        else camp.totalRating=parseInt(rating);
        if(camp.totalUsers) camp.totalUsers=camp.totalUsers+1;
        else camp.totalUsers=1;
        await review.save();
        await camp.save();
        req.flash('success','review addded successfully');
        res.redirect(`/campgrounds/${id}`);
    }
}));

router.put('/reviews',isvalidID,isLoggedIn,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const review=await Review.findOne({campground:id,author:req.user.id});
    if(!review){
        throw new ExpressError(404,'campground and user does not matched');
    }
    if(camp.author.equals(req.user.id)){
        req.flash('error','author cannot add reviews');
        res.redirect(`/campgrounds/${id}`);
    }
    if(!review.author.equals(req.user.id)){
        req.flash('error','you cannnot update this review');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        camp.totalRating-=review.rating;
        review.rating=req.body.rating;
        camp.totalRating+=review.rating;
        review.body=req.body.body;
        await review.save();
        await camp.save();
        req.flash('success','review edited successfully');
        res.redirect(`/campgrounds/${id}`);
    }
}));

router.delete('/reviews',isvalidID,isLoggedIn,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    const review=await Review.findOne({campground:id,author:req.user.id});
    if(!review){
        throw new ExpressError(404,'campground and user does not matched');
    }
    if(camp.author.equals(req.user.id)){
        req.flash('error','author cannot add reviews');
        res.redirect(`/campgrounds/${id}`);
    }
    if(!review.author.equals(req.user.id)){
        req.flash('error','you cannnot delete this review');
        res.redirect(`/campgrounds/${id}`);
    }
    else{
        camp.totalRating-=review.rating;
        camp.totalUsers-=1;
        await review.delete();
        await camp.save();
        req.flash('success','review deleted successfully');
        res.redirect(`/campgrounds/${id}`);
    }
}));
module.exports=router;