const express = require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const methodOverride=require('method-override');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const passport=require('passport');
const passportLocal=require('passport-local');
const User=require('./models/user');
const campgroundsRoute=require('./routes/campground');
const userRoute=require('./routes/user');

mongoose.connect('mongodb://localhost:27017/yelpcamp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});
const db=mongoose.connection;
db.on('error',console.error.bind('connection error'));
db.once('open',() =>{
    console.log('database connected');
});

const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

const sessionConfig={
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/',(req,res)=>{
    res.send("Ok!");
});

app.use('/',userRoute);
app.use('/campgrounds',campgroundsRoute);

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404));
})
app.use((err,req,res,next)=>{
    const {status=500, message='Something\'s wrong I can feel it'}=err;
    res.status(status).send(message);
})
app.listen(3000,()=>{
    console.log("Running");
});

