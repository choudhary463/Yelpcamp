const Campground=require('../models/campground');
const User=require('../models/user');

module.exports.registerIndex=(req,res)=>{
    res.render('user/register',{title:'register'});
};

module.exports.register=async (req,res,next)=>{
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
};

module.exports.loginIndex=(req,res)=>{
    res.render('user/login',{title:'login'});
};

module.exports.login=(req,res)=>{
    req.flash('success','Welcome back!');
    const path=req.session.returnTo||'/campgrounds';
    delete req.session.returnTo;
    res.redirect(path);
};

module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success','looking forward to see you again!!');
    res.redirect('/campgrounds');

};

module.exports.profile=async (req,res)=>{
    const {id}=req.params;
    const user=await User.findById(id);
    if(user){
        const campgrounds=await Campground.find({author:id});
        res.render('user/profile',{user,title:user.name,campgrounds});
    }
    else{
        req.flash('error','invalid user');
        res.redirect('/campgrounds');
    }
};