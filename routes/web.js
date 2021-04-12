const indexController = require('../app/http/controllers/indexController')
const authController = require('../app/http/controllers/authController')

function initRoutes(app){
     app.get('/', indexController().index)
     app.get('/cart', (req,res)=>{
        res.render('customers/cart')
     })
     app.get('/u_home', (req,res)=>{
       res.render('customers/u_home')
     })
     app.get('/u_hotel', (req,res)=>{
       res.render('customers/u_hotel')
     })
     
     app.get('/u_register', authController().register_customer)
     app.post('/u_register', authController().postRegister_customer)
     app.get('/manager_register', authController().register_manager)
     app.post('/manager_register', authController().postRegister_manager)
     app.get('/login', authController().login)
     app.post('/login', authController().postLogin)

      app.get('/manager', (req,res)=>{
        res.render('hotel/manager')
      }) 
      
      app.get('/staff', (req,res)=>{
        res.render('hotel/staff')
      })

}

module.exports = initRoutes
