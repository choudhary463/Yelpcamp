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
    for(let i=0;i<50;i++){
        let RandomTitle=randomName([3,3]);
        let RandomPrice=(1+Math.random()*10).toFixed(3);
        let RandomDescription=randomName([5,5,5,5,5,5]);
        let Randomidx=Math.floor(Math.random()*cities.length);
        let RandomLocation=cities[Randomidx].city+", "+cities[Randomidx].state;
        let RandomImage='https://source.unsplash.com/collection/483251';
        seedCampGrounds.push({title:RandomTitle,price:RandomPrice,description:RandomDescription,location:RandomLocation,image:RandomImage});
    }
};
seedData();
Campground.deleteMany({})
.then((data)=>{
    console.log(data);
})
.catch((err)=>{
    console.log(err);
});

const Insert=async ()=>{
    if(seedCampGrounds.length){
         await Campground.insertMany(seedCampGrounds);
    }
    await Campground.findOne({});
}
const InsertData=async ()=>{
    await Insert();
    mongoose.connection.close();
}
InsertData();
