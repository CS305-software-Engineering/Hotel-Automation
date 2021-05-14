const indexController = require('../app/http/controllers/indexController')
const authController = require('../app/http/controllers/authController')
const homeController = require('../app/http/controllers/customers/homeController')
const orderController = require('../app/http/controllers/customers/orderController')
const userController = require('../app/http/controllers/customers/userController')
const staffController = require('../app/http/controllers/managers/staffController')
const menuController = require('../app/http/controllers/managers/menuController')
const cartController = require('../app/http/controllers/customers/cartController')
const ordersController = require('../app/http/controllers/managers/ordersController')

function initRoutes(app){
     app.get('/', indexController().index)
     
     app.get('/u_home', homeController().index)
     app.get('/u_hotel', (req,res)=>{
       res.render('customers/u_hotel')
     })
     app.get('/display_menu/:hotelname', homeController().displayMenu)
     app.get('/previous_orders', orderController().displayOrder)
     app.get('/completed_orders', ordersController().displayOrder)
     
     
     app.get('/u_register', authController().register_customer)
     app.post('/u_register', authController().postRegister_customer)
     app.get('/manager_register', authController().register_manager)
     app.post('/manager_register', authController().postRegister_manager)
     app.get('/login', authController().login)
     app.post('/login', authController().postLogin)
     app.post('/logout',authController().logout)
     app.get('/staff', staffController().register_staff)
     app.post('/staff', staffController().postRegister_staff)
     app.get('/staff_list', staffController().displayStaff)

      app.get('/manager', (req,res)=>{
        res.render('hotel/manager')
      }) 
      
app.get('/managerhome', (req,res)=>{
  res.render('hotel/managerhome')
})
app.get('/staff', (req,res)=>{
  res.render('hotel/staff')
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

// app.get('/staff_list', (req,res)=>{
//  res.render('hotel/staff_list')
// })

app.get('/rawmaterials', (req,res)=>{
  res.render('hotel/rawmaterials')
})

app.get('/menu', menuController().displayMenu)
app.post('/menu', menuController().addMenu)
app.post('/menu/edit', menuController().editMenu)
app.get('/menu/delete/:id', menuController().deleteMenu)

app.post('/change_password', userController().changePassword);
app.get('/changePassword', userController().renderchangePassword);

app.get('/cart', cartController().index)
app.post('/update-cart', cartController().update)
app.post('/delete-cart', cartController().delete)
app.get('/cart/delete/:id', cartController().deleteitem)

<<<<<<< HEAD
app.post('/orders',orderController().store)
app.get('/customer/orders',orderController().index)


=======
app.get('/neworders',ordersController().index)
>>>>>>> 0f6832b28708657b259c5b5dddba744acc65b226
}

module.exports = initRoutes
