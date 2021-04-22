const Hotel = require('../../../models/hotel')
function homeController(){
    return {
        //read
        async index(req,res) {

            const hotels = await Hotel.find()
            console.log(hotels)
            return res.render('customers/u_home', {hotels: hotels})
        }
    }
}

module.exports = homeController