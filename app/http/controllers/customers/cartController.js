function cartController(){
    return {
        //read
        index(req,res) {
            res.render('index')
        }
    }
}

module.exports = cartController