const Order = require('../../../models/order')
function ordersController () {
    return {
        async displayOrder(req,res) {
            var x = new Date().toISOString().slice(0,10);
            const orders = await Order.find({
                $and: [
                  { "Date": { $eq: x }},
                   // change later to completed
                   {"status" :{$eq: "order_placed"} },
                ]
              })
            
            if(orders == null )
                return console.log("No order yet")
            console.log(orders)
            return res.render('hotel/completed_orders', {orders: orders})
           // res.render('hotel/menu')
        },
    }
}

module.exports = ordersController