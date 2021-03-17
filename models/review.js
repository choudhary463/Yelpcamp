const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    body:String,
    rating:Number,
    campground:{
        type:Schema.Types.ObjectId,
        ref:'Campground'
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});
module.exports=mongoose.model('Review',reviewSchema);