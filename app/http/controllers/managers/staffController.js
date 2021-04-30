const User = require('../../../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

function staffController(){
    return {
        register_staff(req,res) {
            res.render('hotel/staff')
        },
        
        async postRegister_staff(req,res) {
            //Logic
            const {username, email, password} = req.body;
            //Validate request #TODO : yet to be implemented
            //show errors??
            if(!username || !email || !password){
                req.flash('Please fill all the fields');
                return res.redirect('/staff')
            }
            //CHeck if email exists
            User.exists({ email: email }, (err, result) => {
                if(result){
                    req.flash('error','Email already taken! Person already added');
                    return res.redirect('/staff')
                }
            })
            //Hash password
            const hashedPassword = await bcrypt.hash(password, 10)
            //Create user in database
            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                role:'staff'
            })
            user.save().then((user) => {
                req.flash('Added Successfully');
                return res.redirect('/manager')
            }).catch(err => {
                console.log(Error);
                return res.redirect('/staff')
            })
            console.log(req.body);           
        }
    }
}

module.exports = staffController
