const User = require('../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
function authController(){
    return {
        login(req,res) {
            res.render('auth/login')
        },
        postLogin(req, res, next) {
            console.log("hello from postLogin")
            passport.authenticate('local', (err, user, info) => {
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    if(user.role=='customer')
                        return res.redirect('/u_home')
                    else
                        return res.redirect('/manager')

                })
            })(req, res, next)

        },
        register_manager(req,res) {
            res.render('auth/manager_register')
        },
        register_customer(req,res) {
            res.render('auth/u_register')
        },
        async postRegister_customer(req,res) {
            //Logic
            const {username, email, password} = req.body;
            //Validate request 
            if(!username || !email || !password){
                return res.redirect('/u_register')
            }
            //CHeck if email exists
            User.exists({ email: email }, (err, result) => {
                if(result){
                    console.log('Email already taken! If already registered, please login!');
                    req.flash('error','Email already taken! If already registered, please login!');
                    return res.redirect('/u_register')
                }
            })
            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            //Create user in database
            const user = new User({
                username: username,
                email: email,
                password: hashedPassword
            })
            user.save().then((user) => {
                return res.redirect('/login')
            }).catch(err => {
              //  console.log(err)
                return res.redirect('/u_register')
            })
            console.log(req.body);
            
        },
        async postRegister_manager(req,res) {
            //Logic
            const {hotelname,hoteladdr,managername, email, password} = req.body;
            //Validate request #TODO : yet to be implemented
            //show errors??
            if(!hotelname || !hoteladdr || !managername || !email || !password){
                return res.redirect('/manager_register')
            }
            //CHeck if email exists
            User.exists({ email: email }, (err, result) => {
                if(result){
                    req.flash('error','Email already taken! If already registered, please login!');
                    return res.redirect('/manager_register')
                }
            })
             //CHeck if hotel exists
             User.exists({ hotelname: hotelname }, (err, result) => {
                if(result){
                    req.flash('error','Hotel already registered, please login!');
                    return res.redirect('/manager_register')
                }
            })
            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            //Create user in database
            const user = new User({
                username: managername,
                email: email,
                password: hashedPassword,
                role: 'manager'
            })
            user.save().then((user) => {
                return res.redirect('/login')
            }).catch(err => {
              //  console.log(err)
                return res.redirect('/manager_register')
            })
            console.log(req.body);

            //#TODO: Save Hotel in database: yet to be implemented
            
        }
    }
}

module.exports = authController
