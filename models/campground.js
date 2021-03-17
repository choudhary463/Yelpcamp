const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const campgroundSchema= new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:String,
    totalRating:Number,
    totalUsers:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});
module.exports=mongoose.model('Campground',campgroundSchema);