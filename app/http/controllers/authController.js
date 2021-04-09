const User = require('../../models/user')
const bcrypt = require('bcrypt')
function authController(){
    return {
        login(req,res) {
            res.render('auth/login')
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
            //Validate request #TODO : yet to be implemented
            //show errors??
            if(!username || !email || !password){
                return res.redirect('/u_register')
            }
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
                console.log(err)
                return res.redirect('/u_register')
            })
            console.log(req.body);
            
        }
    }
}

module.exports = authController