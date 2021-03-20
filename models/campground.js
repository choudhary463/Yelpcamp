const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const campgroundSchema= new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    images:[
        {
            url:String,
            filename:String
        }
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            require:true
        }
    },
    totalRating:Number,
    totalUsers:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{toJSON:{virtuals:true}});

campgroundSchema.virtual('properties.popUpText').get(function(){
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>
    <p>${this.description.substring(Math.min(this.description.length,20))}...</p>
    `
})
module.exports=mongoose.model('Campground',campgroundSchema);