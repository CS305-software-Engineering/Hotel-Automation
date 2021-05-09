const User = require('../../models/user')
const Hotel = require('../../models/hotel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const passport = require('passport')

//const mailgun = require("mailgun-js");
//const DOMAIN = 'sandboxe9a03327bcbd4f01aac092dcb2f85fed.mailgun.org';
//const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

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
            const {username, email, password,cPassword} = req.body;
            //Validate request 
            if(!username || !email || !password || !cPassword ){
                return res.redirect('/u_register')
            }
            if( password != cPassword){
                req.flash("Password does not match");
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

            const token = jwt.sign({name,email,password}, process.env.JWT_ACC_ACTIVATE,{expiresIn:'20m'});

            // Email Verification
            const data = {
                from: 'noreply@hello.com',
                to: email,
                subject: 'Account Activation Link',
                html: `
                    <h2> Please click on the given link to activate your account </h2>
                    <p>${process.env.CLIENT_URL}/authentication/activate/${token} </p>
                    `
            };
            mg.messages().send(data, function (error, body) {
                if(error){
                    return res.json({
                        error: err.message
                    })
                }
                return res.json({message:'Email has been sent, kindly activate your account'})
                console.log(body);
            });


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
             //Hash password
            const hashedPassword =  await bcrypt.hash(password, 10)
            User.exists({ email: email }, (err, result) => {
                if(result){
                    req.flash('error','Email already taken! If already registered, please login!');
                    return res.redirect('/manager_register')
                }
                else{
                            //CHeck if hotel exists
                    Hotel.exists({ hotelname: hotelname }, (err, result) => {
                        if(result){
                            req.flash('error','Hotel already registered, please login!');
                            return res.redirect('/manager_register')
                        }
                        else{
                                   
                            //Create user in database
                            const user = new User({
                                username: managername,
                                email: email,
                                password: hashedPassword,
                                role: 'manager'
                            })
                            user.save().then((user) => {
                                const hotel = new Hotel({
                                    hotelname: hotelname,
                                    hoteladdr: hoteladdr,
                                    manager: managername,
                                    email: email,
                                })
                                hotel.save().then((hotel) => {
                                    return res.redirect('/login')
                                }).catch(err => {
                                  console.log(err)
                                    return res.redirect('/manager_register')
                                })
                                return res.redirect('/manager')
                            }).catch(err => {
                              console.log(err)
                                return res.redirect('/manager_register')
                            })

                            // Save Hotel in database: yet to be implemented
                            
            
                        }
                    })
                   
                }
            })
             
        },

        logout(req,res){
            req.logout()
            return res.redirect('/manager_register')
        }
    }
}

exports.activateAccount = (req,res) => {
    const {token} = req.body;
    if(token){
        jwt.verify(token,process.env.JWT_ACC_ACTIVATE, function(err,decodedToken){
            if(err){
                return res.status(400).json({error: 'Incorrect or Expired link.'})
            }
            const {name,email,password }= decodedToken;
        })
    }
    else{
        return res.json({error: "Something went wrong!!!"})
    }
}
module.exports = authController
