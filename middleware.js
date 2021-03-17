const {CampgroundSchema}=require('./schemas.js');

module.exports.isValidCampGround=(req,res,next)=>{
    const {error}=CampgroundSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

module.exports.isvalidID=(req,res,next)=>{
    const {id}=req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        throw new ExpressError('invalid id',400);
    }
    else{
        next();
    }
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        next();        
    }
    else{
        req.flash('error','You must be logged in!!');
        req.session.returnTo=req.originalUrl;
        res.redirect('/login');
    }
}
module.exports.isNotLoggedIn=(req,res,next)=>{
    if(req.user){
        res.redirect(`/profile/${req.user.id}`);
    }
    else{
        next();
    }
}