const User = require('../../models/user')
const Hotel = require('../../models/hotel')

const bcrypt = require('bcrypt')
const passport = require('passport')

var crypto = require('crypto');
var nodemailer = require('nodemailer');

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
                if (!user.isVerified) {
                    req.flash('Error : Your mail account is not verified.', info.message)
                    return res.redirect('/login') 
                }
                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }
                    token: generateToken(user);
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
            if(!username || !email || !password ){
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

            // Create a verification token for this user
            var token = new token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    
            // Save the verification token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
    
            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
            });
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
                            // Create a verification token for this user
                            var token = new token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
                    
                            // Save the verification token
                            token.save(function (err) {
                                if (err) { return res.status(500).send({ msg: err.message }); }
                    
                            // Send the email
                            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                            var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                            transporter.sendMail(mailOptions, function (err) {
                                if (err) { return res.status(500).send({ msg: err.message }); }
                                res.status(200).send('A verification email has been sent to ' + user.email + '.');
                            });
                            });
                                hotel.save().then((hotel) => {
                                    return res.redirect('/login')
                                }).catch(err => {
                                  console.log(err)
                                    return res.redirect('/manager_register')
                                })
                              //  return res.redirect('/manager')
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

        async confirmationPost(req, res, next) {
            req.assert('email', 'Email is not valid').isEmail();
            req.assert('email', 'Email cannot be blank').notEmpty();
            req.assert('token', 'Token cannot be blank').notEmpty();
            req.sanitize('email').normalizeEmail({ remove_dots: false });
        
            // Check for validation errors    
            var errors = req.validationErrors();
            if (errors) return res.status(400).send(errors);
        
            // Find a matching token
            Token.findOne({ token: req.body.token }, function (err, token) {
                if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
        
                // If we found a token, find a matching user
                User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
                    if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                    if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
        
                    // Verify and save the user
                    user.isVerified = true;
                    user.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        res.status(200).send("The account has been verified. Please log in.");
                    });
                });
            });
        }, 

        async resendTokenPost (req, res, next) {
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('email', 'Email cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({ remove_dots: false });
    
        // Check for validation errors    
        var errors = req.validationErrors();
        if (errors) return res.status(400).send(errors);
    
        User.findOne({ email: req.body.email }, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
            if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
    
            // Create a verification token, save it, and send email
            var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
    
            // Save the token
            token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
    
                // Send the email
                var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
                var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                    if (err) { return res.status(500).send({ msg: err.message }); }
                    res.status(200).send('A verification email has been sent to ' + user.email + '.');
                });
            });
    
        });
    },

        logout(req,res){
            req.logout()
            return res.redirect('/manager_register')
        }
    }
}

module.exports = authController
