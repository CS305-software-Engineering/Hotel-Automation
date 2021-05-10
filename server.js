 require('dotenv').config()
 const express = require('express')
 const app = express()
 const PORT = process.env.PORT || 3000
 const ejs = require('ejs')
 const expressLayout = require('express-ejs-layouts')
 const path = require('path')
 const mongoose = require('mongoose')
 const session = require('express-session')
 const flash = require('express-flash')
 const MongoDbStore = require('connect-mongo')
 const passport = require('passport')
//mongodb connection
const url = 'mongodb+srv://harshagarg09:harshagarg09@cluster0.iizlz.mongodb.net/atithi?retryWrites=true&w=majority'
mongoose.connect(url,
    {
        useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true
    }
).then(() => {
    console.log("Database connected")
});
const connection = mongoose.connection;

//Session store
let mongoStore = MongoDbStore.create({
                        mongoUrl: url,
                     //   mongooseConnection: connection,
                        collection: 'sessions'
                    })
//Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}))


//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//Assets
 app.use(flash())
 app.use(express.static('public'))
 app.use(express.urlencoded({extended : false}))
 app.use(express.json())

 app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})


 require('./routes/web')(app)


app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`)
})
//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')







 
