const express = require('express');
const router=express.Router();
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground');
const {isValidCampGround,isvalidID,isLoggedIn}=require('../middleware');


router.get('/',catchAsync(async (req,res)=>{
    const AllCampGrounds=await Campground.find({});
    res.render('campground/index',{AllCampGrounds,title:'All campgrounds'});
}));
router.get('/new',isLoggedIn,(req,res)=>{
    res.render('campground/new',{title:'Create new'});
});
router.post('/',isValidCampGround,isLoggedIn,catchAsync( async (req,res)=>{
    const p=new Campground(req.body);
    const P=await p.save();
    req.flash('success','Successfully created campground');
    res.redirect(`/campgrounds/${p.id}`);
}));
router.get('/:id',isvalidID,catchAsync(async (req,res,next)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(camp){
        res.render('campground/campground',{camp,title:`${camp.title}`});
    }
    else{
        throw new ExpressError('campground not found',404);
    }
}));
router.put('/:id',isvalidID,isValidCampGround, catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,req.body);
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${camp.id}`);
}));
router.get('/:id/edit',isvalidID,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    res.render('campground/edit',{camp,title:'Edit campground'});
}));
router.delete('/:id',isvalidID,catchAsync(async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    await camp.delete();
    req.flash('success','Successfully deleted campground');
    res.redirect('/campgrounds');
}));

module.exports=router;