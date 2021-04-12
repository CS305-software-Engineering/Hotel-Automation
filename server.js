 const express = require('express')
 const app = express()
 const PORT = process.env.PORT || 3000
 const ejs = require('ejs')
 const expressLayout = require('express-ejs-layouts')
 const path = require('path')
 const mongoose = require('mongoose')
 //const flash = require('express-flash')
//mongodb connection
const url = 'mongodb+srv://harshagarg09:harshagarg09@cluster0.iizlz.mongodb.net/atithi?retryWrites=true&w=majority'
mongoose.connect(url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Database connected")
});
 

//Assets
// app.use(flash())
 app.use(express.static('public'))
 app.use(express.urlencoded({extended : false}))
 app.use(express.json())
 require('./routes/web')(app)


app.get('/managerhome', (req,res)=>{
  res.render('hotel/managerhome')
})

app.get('/viewprofile', (req,res)=>{
  res.render('hotel/viewprofile')
})

app.get('/neworders', (req,res)=>{
  res.render('hotel/neworders')
})

app.get('/addstaff', (req,res)=>{
  res.render('hotel/addstaff')
})

app.get('/completedorder', (req,res)=>{
  res.render('hotel/completedorder')
})

app.get('/rawmaterials', (req,res)=>{
  res.render('hotel/rawmaterials')
})

app.listen(PORT, () => {
   console.log(`Listening on port ${PORT}`)
})
//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')







 
