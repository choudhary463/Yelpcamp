const Campground=require('../models/campground');
const Review=require('../models/review');
const {cloudinary}=require('../cloudinary/index');

module.exports.index=async (req,res)=>{
    const AllCampGrounds=await Campground.find({});
    res.render('campground/index',{AllCampGrounds,title:'All campgrounds'});
};
module.exports.newcampground=(req,res)=>{
    res.render('campground/new',{title:'Create new'});
};
module.exports.createCampground=async (req,res)=>{
    const p=new Campground(req.body);
    p.author=req.user.id;
    p.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    const P=await p.save();
    req.flash('success','Successfully created campground');
    res.redirect(`/campgrounds/${p.id}`);
};
module.exports.campgroundIndex=async (req,res,next)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    let userId=null;
    if(req.user) userId=req.user.id;
    let review=null;
    if(userId) review=await Review.findOne({campground:id,author:userId});
    res.render('campground/campground',{camp,title:`${camp.title}`,review});
};
module.exports.editCampground=async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findByIdAndUpdate(id,req.body);
    camp.images.push(...req.files.map(f=>({url:f.path,filename:f.filename})));
    await camp.save();
    if(req.body.deleteImages.length){
        let remaining=0;
        for(let img of camp.images){
            if(!req.body.deleteImages.includes(img.filename)) remaining++;
        }
        if(!remaining){
            req.flash('error','do not delete all images');
            return res.redirect(`/campgrounds/${camp.id}/edit`);
        }
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(camp);
    }
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${camp.id}`);
};
module.exports.editCampgroundIndex=async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    res.render('campground/edit',{camp,title:'Edit campground'});
};
module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    for(let img of camp.images){
        await cloudinary.uploader.destroy(img.filename);
    }
    await camp.delete();
    await Review.deleteMany({campground:id});
    req.flash('success','Successfully deleted campground');
    res.redirect('/campgrounds');
};
