const express=require('express');
const passport = require('passport');
const router=express.Router();
const User=require('../models/user');
const catchAsync=require('../utils/catchAsync');
const {isLoggedIn,isNotLoggedIn}=require('../middleware');

router.get('/register',isNotLoggedIn,(req,res)=>{
    res.render('user/register',{title:'register'});
});

router.post('/register', catchAsync (async (req,res,next)=>{
    try{
        const {name,email,password}=req.body;
        const newUser= new User({name,email,username:email});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success','registered succesfully');
            res.redirect('/campgrounds');
        });
    }catch{
        req.flash('error','this Email id is already registered');
        res.redirect('/register');
    }
}));

router.get('/login',isNotLoggedIn,(req,res)=>{
    res.render('user/login',{title:'login'});
});

router.post('/login',passport.authenticate('local',{failureFlash:'invalid Email id or Password', failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome back!');
    const path=req.session.returnTo||'/campgrounds';
    delete req.session.returnTo;
    res.redirect(path);
})

router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.flash('success','looking forward to see you again!!');
    res.redirect('/campgrounds');

})
router.get('/profile/:id',catchAsync( async (req,res)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    res.render('user/profile',{name:user.name});
}));
module.exports=router;