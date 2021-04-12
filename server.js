 const express = require('express')
 const app = express()
 const PORT = process.env.PORT || 3000
 const ejs = require('ejs')
 const expressLayout = require('express-ejs-layouts')
 const path = require('path')

 //Assets
 app.use(express.static('public'))

 app.get('/', (req,res)=>{
   res.render('index')
})
app.get('/cart', (req,res)=>{
   res.render('customers/cart')
})
app.get('/u_home', (req,res)=>{
  res.render('customers/u_home')
})
app.get('/u_hotel', (req,res)=>{
  res.render('customers/u_hotel')
})
app.get('/u_register', (req,res)=>{
  res.render('auth/u_register')
})
app.get('/manager_register', (req,res)=>{
   res.render('auth/manager_register')
 })
app.get('/login', (req,res)=>{
   res.render('auth/login')
 })

app.get('/manager', (req,res)=>{
  res.render('hotel/manager')
}) 

app.get('/staff', (req,res)=>{
  res.render('hotel/staff')
})

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

 