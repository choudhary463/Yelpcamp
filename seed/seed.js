const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');

mongoose.connect('mongodb://localhost:27017/yelpcamp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});
const db=mongoose.connection;
db.on('error',console.error.bind('connection error'));
db.once('open',() =>{
    console.log('database connected');
});

seedCampGrounds=[];
const randomName = (arr)=>{
    let res="";
    let len=0;
    for(let a of arr){
        let x=3+Math.floor(Math.random()*a);
        len+=(x+1);
        for(let i=0;i<x;i++){
            let r=Math.floor(Math.random()*26);
            res+=String.fromCharCode(97+r);
        }
        res+=" ";
    }
    res=res.slice(0,len-1);
    return res;
};
const seedData= async () =>{
    let arr=[];
    for(let i=0;i<50;i++){
        let RandomTitle=randomName([3,3]);
        let RandomPrice=(1+Math.random()*10).toFixed(3);
        let RandomDescription=randomName([5,5,5,5,5,5]);
        let Randomidx=Math.floor(Math.random()*cities.length);
        while(arr.includes(Randomidx)){
            Randomidx=Math.floor(Math.random()*cities.length);
        }
        arr.push(Randomidx);
        let RandomLocation=cities[Randomidx].city+", "+cities[Randomidx].state;
        let RandomImage=[
            {
                url: 'https://res.cloudinary.com/ac463/image/upload/v1616152802/YelpCamp/anim3_x6opit.jpg',
                filename: 'YelpCamp/jexqta0gfsjoxdanuojr'
            }
        ];
        let authorID='60507ed0cd06fc1824b5200f';
        const randomGeometry={
            type:'Point',
            coordinates:[cities[Randomidx].longitude,cities[Randomidx].latitude]
        }
        console.log(i);
        seedCampGrounds.push({title:RandomTitle,price:RandomPrice,description:RandomDescription,location:RandomLocation,images:RandomImage,geometry: randomGeometry,author:authorID,totalRaing:0,totalUsers:0});
    }
};

const Insert=async ()=>{
    if(seedCampGrounds.length){
         await Campground.insertMany(seedCampGrounds);
    }
    await Campground.findOne({});
}
const InsertData=async ()=>{
    await Campground.deleteMany({});
    await seedData();
    await Insert();
    mongoose.connection.close();
}
InsertData();
