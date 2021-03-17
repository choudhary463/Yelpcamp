const express = require('express');
const mongoose=require('mongoose');
const Campground=require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db=mongoose.connection;
db.on('error',console.error.bind('connection error'));
db.once('open',() =>{
    console.log('database connected');
});

const p=new Campground({
    title:"anmol",
    price: "1",
    description:"11",
    location:"111"
});

const 