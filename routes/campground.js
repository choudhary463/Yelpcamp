const express = require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');
const Review=require('../models/review');
const {isValidCampGround,isvalidID,isLoggedIn,isValidUser}=require('../middleware');


router.get('/',catchAsync(async (req,res)=>{
    const AllCampGrounds=await Campground.find({});
    res.render('campground/index',{AllCampGrounds,title:'All campgrounds'});
}));
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campground/new',{title:'Create new'});
});
router.post('/',isValidCampGround,isLoggedIn,catchAsync( async (req,res)=>{
    const p=new Campground(req.body);
    p.author=req.user.id;
    const P=await p.save();
    req.flash('success','Successfully created campground');
    res.redirect(`/campgrounds/${p.id}`);
}));
router.get('/:id',isvalidID,catchAsync(async (req,res,next)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    let userId=null;
    if(req.user) userId=req.user.id;
    let review=null;
    if(userId) review=await Review.findOne({campground:id,author:userId});
    res.render('campground/campground',{camp,title:`${camp.title}`,review});
}));
router.put('/:id',isvalidID,isValidCampGround,isLoggedIn,isValidUser, catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,req.body);
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${camp.id}`);
}));
router.get('/:id/edit',isvalidID,isLoggedIn,isValidUser,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    res.render('campground/edit',{camp,title:'Edit campground'});
}));
router.delete('/:id',isvalidID,isLoggedIn,isValidUser,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    await camp.delete();
    await Review.deleteMany({campground:id});
    req.flash('success','Successfully deleted campground');
    res.redirect('/campgrounds');
}));

module.exports=router;